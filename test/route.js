'use strict';

var route = require('../src/route');
var assert = require('chai').assert;

suite('Route', function () {

    suite('Create', function () {
        test('00-00 route', function () {
            assert.equal(route.create(0, 0), 0x0);
        });

        test('00-01 route', function () {
            assert.equal(route.create(0, 1), 0x4);
        });

        test('01-00 route', function () {
            assert.equal(route.create(1, 0), 0x1);
        });
    });

    suite('Parse', function () {
        test('00-00 route', function () {
            assert.deepEqual(route.parse(0x0), {
                source: 0,
                destination: 0
            });
        });

        test('00-01 route', function () {
            assert.deepEqual(route.parse(0x4), {
                source: 0,
                destination: 1
            });
        });

        test('01-00 route', function () {
            assert.deepEqual(route.parse(0x1), {
                source: 1,
                destination: 0
            });
        });
    });
});
