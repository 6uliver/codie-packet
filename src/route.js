'use strict';

module.exports = {
    create: function create(source, destination) {
        return destination << 2 | source;
    },
    parse: function parse(route) {
        return {
            source: route & 0x3,
            destination: route >> 2
        };
    }
};
