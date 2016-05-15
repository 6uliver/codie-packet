codie-packet
===========

[![NPM Version](https://img.shields.io/npm/v/codie-packet.svg)](https://npmjs.org/package/codie-packet) 
[![Build Status](https://travis-ci.org/6uliver/codie-packet.svg?branch=master)](https://travis-ci.org/6uliver/codie-packet) 
[![Coverage Status](https://coveralls.io/repos/github/6uliver/codie-packet/badge.svg?branch=master)](https://coveralls.io/github/6uliver/codie-packet?branch=master)

*Unofficial* Node.js library for creating and parsing Codie packets based on [Codie BLE API documentation](http://codie.azurewebsites.net/api/)

## Install

You can get codie-packet via npm.

```bash
$ npm install codie-packet --save
```

## Usage

Forge a packet for Codie:

```js
var CodiePacket = require('codie-packet');

var buffer = CodiePacket.create({
    source: CodiePacket.ENTITY.APP,
    destination: CodiePacket.ENTITY.MCU,
    priority: CodiePacket.PRIORITY.NORMAL,
    sequenceNumber: 1337,
    commandId: CodiePacket.COMMANDS.DRIVE_DISTANCE,
    data: [200, 100, 100]
});

/* Send buffer to the BLE layer */
```

Parse a packet received from Codie:

```js
var CodiePacket = require('codie-packet');

var buffer = /* Receive buffer from the BLE layer */

var packet = CodiePacket.parse(buffer);

// for example:
packet == {
    source: CodiePacket.ENTITY.MCU,
    destination: CodiePacket.ENTITY.APP,
    priority: CodiePacket.PRIORITY.NORMAL,
    sequenceNumber: 1337,
    commandId: CodiePacket.COMMANDS.DRIVE_DISTANCE,
    data: [0]
};
```

For detailed description of **ENTITY**, **PRIORITY** and **COMMANDS** constants see [Codie BLE API documentation](http://codie.azurewebsites.net/api/), everything is the same just in UPPER_CASE.

