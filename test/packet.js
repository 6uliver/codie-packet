'use strict';

var Packet = require('../src/packet');
var route = require('../src/route');
var assert = require('chai').assert;

suite('Packet', function () {

    suite('Create', function () {

        test('Route', function () {
            assert.equal((Packet.create({
                source: Packet.ENTITY.MCU,
                destination: Packet.ENTITY.BLE
            }).readUInt8(0) & 0xF0) >> 4, route.create(Packet.ENTITY.MCU, Packet.ENTITY.BLE));
        });

        test('Priority', function () {
            assert.equal(Packet.create({
                priority: 6
            }).readUInt8(0) & 0x0F, 6);
        });

        test('Sequence number', function () {
            assert.equal(Packet.create({
                sequenceNumber: 12345
            }).readUInt16LE(1), 12345);
        });

        test('Command ID', function () {
            assert.equal(Packet.create({
                commandId: Packet.COMMANDS.DRIVE_DISTANCE
            }).readUInt16LE(3), Packet.COMMANDS.DRIVE_DISTANCE);
        });

        test('Arguments length - zero', function () {
            assert.equal(Packet.create({
                commandId: Packet.COMMANDS.ECHO
            }).readUInt16LE(5), 0);
        });

        test('Arguments length - non-zero', function () {
            assert.equal(Packet.create({
                commandId: Packet.COMMANDS.DRIVE_DISTANCE
            }).readUInt16LE(5), 4);
        });

        test('Arguments data - UInt16, Int8', function () {
            var buffer = Packet.create({
                commandId: Packet.COMMANDS.DRIVE_DISTANCE,
                data: [1, 127, -127]
            });
            assert.equal(buffer.readUInt16LE(7), 1);
            assert.equal(buffer.readInt8(9), 127);
            assert.equal(buffer.readInt8(10), -127);
        });

        test('Arguments data - UInt8', function () {
            var buffer = Packet.create({
                commandId: Packet.COMMANDS.LED_SET_COLOR,
                data: [1, 2, 127, 255]
            });
            assert.equal(buffer.readUInt16LE(7), 1);
            assert.equal(buffer.readUInt8(9), 2);
            assert.equal(buffer.readUInt8(10), 127);
            assert.equal(buffer.readUInt8(11), 255);
        });
    });

    suite('Parse', function () {

        var targetBuffer;

        setup(function () {
            targetBuffer = new Buffer(7);
            targetBuffer.fill(0);
            targetBuffer.writeUInt16LE(Packet.COMMANDS.NULL ^ 0x8000, 3);
        });

        test('Route', function () {
            var routeId = route.create(Packet.ENTITY.MCU, Packet.ENTITY.BLE);
            var buffer = new Buffer([routeId << 4 | 0]);
            buffer.copy(targetBuffer, 0);

            var packet = Packet.parse(targetBuffer);

            assert.equal(packet.source, Packet.ENTITY.MCU);
            assert.equal(packet.destination, Packet.ENTITY.BLE);
        });

        test('Priority', function () {
            var buffer = new Buffer([0xF]);
            buffer.copy(targetBuffer, 0);

            var packet = Packet.parse(targetBuffer);

            assert.equal(packet.priority, 0xF);
        });

        test('Sequence number', function () {
            targetBuffer.writeUInt16LE(12345, 1);

            var packet = Packet.parse(targetBuffer);

            assert.equal(packet.sequenceNumber, 12345);
        });

        test('Command ID', function () {
            targetBuffer.writeUInt16LE(Packet.COMMANDS.ECHO ^ 0x8000, 3);

            var packet = Packet.parse(targetBuffer);

            assert.equal(packet.commandId, Packet.COMMANDS.ECHO);
        });

        test('Arguments length - zero', function () {
            var packet = Packet.parse(targetBuffer);

            assert.equal(packet.data.length, 0);
        });

        test('Arguments length - non-zero', function () {
            targetBuffer.writeUInt16LE(Packet.COMMANDS.BATTERY_GET_SOC ^ 0x8000, 3);
            targetBuffer.writeUInt16LE(2, 5);
            var argumentsBuffer = new Buffer([0x12, 0x00, 0xff]);
            var packet = Packet.parse(Buffer.concat([targetBuffer, argumentsBuffer]));

            assert.equal(packet.data.length, 2);
        });

        test('Arguments data - UInt16, UInt8', function () {
            targetBuffer.writeUInt16LE(Packet.COMMANDS.BATTERY_GET_SOC ^ 0x8000, 3);
            targetBuffer.writeUInt16LE(3, 5);
            var argumentsBuffer = new Buffer(3);
            argumentsBuffer.writeUInt16LE(12345, 0);
            argumentsBuffer.writeUInt8(127, 2);

            var packet = Packet.parse(Buffer.concat([targetBuffer, argumentsBuffer]));

            assert.equal(packet.data[0], 12345);
            assert.equal(packet.data[1], 127);
        });
    });
});
