'use strict';

var ENTITY = require('./entity');
var PRIORITY = require('./priority');
var TYPE = require('./type');
var COMMAND = require('./command');

var COMMAND_IDS = {};
Object.keys(COMMAND).forEach(function (key) {
    COMMAND_IDS[key] = COMMAND[key].ID;
});

var route = require('./route');

var OFFSET = {
    INFO: 0,
    SEQ: 1,
    CMD: 3,
    ARGLEN: 5,
    ARGDAT: 7
};

function writeInfo(buffer, route, priority) {
    buffer.writeUInt8((route << 4) | priority, OFFSET.INFO);
}

function writeSequenceNumber(buffer, sequenceNumber) {
    buffer.writeUInt16LE(sequenceNumber, OFFSET.SEQ);
}

function writeCmdId(buffer, cmdId) {
    buffer.writeUInt16LE(cmdId, OFFSET.CMD);
}

function writeArgumentLength(buffer, length) {
    buffer.writeUInt16LE(length, OFFSET.ARGLEN);
}

function writeArguments(buffer, argumentTypes, data) {
    var offset = OFFSET.ARGDAT;
    data.forEach(function (argument, index) {
        var type = argumentTypes[index];
        if (type.unsigned) {
            switch (type.length) {
                case 1:
                    buffer.writeUInt8(argument, offset);
                    break;
                case 2:
                    buffer.writeUInt16LE(argument, offset);
                    break;
            }
        } else {
            switch (type.length) {
                case 1:
                    buffer.writeInt8(argument, offset);
                    break;
            }
        }
        offset += type.length;
    });
}

function getArgumentsLength(argumentTypes) {
    var length = 0;
    argumentTypes.forEach(function (argumentType) {
        length += argumentType.length;
    });
    return length;
}

function parseData(buffer, reargs) {
    var offset = OFFSET.ARGDAT;
    var data = [];
    reargs.forEach(function (argumentType) {
        switch (argumentType) {
            case TYPE.U8:
                data.push(buffer.readUInt8(offset));
                offset += 1;
                break;
            case TYPE.U16:
                data.push(buffer.readUInt16LE(offset));
                offset += 2;
                break;
        }
    });
    return data;
}

function findCommandById(commandId) {
    var commandKeys = Object.keys(COMMAND);
    for (var i in commandKeys) {
        if (COMMAND[commandKeys[i]].ID === commandId) {
            return COMMAND[commandKeys[i]];
        }
    }
}

function cleanPacketData(inputPacket) {
    return {
        source: inputPacket.source || ENTITY.APP,
        destination: inputPacket.destination || ENTITY.MCU,
        priority: inputPacket.priority || PRIORITY.NORMAL,
        sequenceNumber: inputPacket.sequenceNumber || 0,
        commandId: inputPacket.commandId || COMMAND_IDS.NULL,
        data: inputPacket.data || []
    };
}

function create(inputPacket) {
    var packet = cleanPacketData(inputPacket);

    var cmd = findCommandById(packet.commandId);
    var routeId = route.create(packet.source, packet.destination);
    var buffer = new Buffer(OFFSET.ARGDAT + getArgumentsLength(cmd.ARGS));
    buffer.fill(0);

    writeInfo(buffer, routeId, packet.priority);
    writeSequenceNumber(buffer, packet.sequenceNumber);
    writeCmdId(buffer, cmd.ID);
    writeArgumentLength(buffer, getArgumentsLength(cmd.ARGS));
    writeArguments(buffer, cmd.ARGS, packet.data);

    return buffer;
}

function parse(buffer) {
    var commandId = (buffer.readUInt16LE(OFFSET.CMD) ^ 0x8000);
    var command = findCommandById(commandId);
    var data = parseData(buffer, command.REARGS);
    var info = buffer.readUInt8(OFFSET.INFO);
    var routeId = route.parse((info & 0xF0) >> 4);

    return {
        source: routeId.source,
        destination: routeId.destination,
        priority: info & 0x0F,
        commandId: commandId,
        sequenceNumber: buffer.readUInt16LE(1),
        data: data
    };
}

module.exports = {
    COMMANDS: COMMAND_IDS,
    ENTITY: ENTITY,
    create: create,
    parse: parse
};
