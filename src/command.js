var TYPE = require('./type');

module.exports = {
    NULL: {
        ID: 0x0000,
        ARGS: [],
        REARGS: []
    },
    ECHO: {
        ID: 0x0001,
        ARGS: [],
        REARGS: []
    },
    DRIVE_SPEED: {
        ID: 0x1060,
        ARGS: [TYPE.I8, TYPE.I8],
        REARGS: [TYPE.U16, TYPE.U8]
    },
    DRIVE_DISTANCE: {
        ID: 0x1061,
        ARGS: [TYPE.U16, TYPE.I8, TYPE.I8],
        REARGS: [TYPE.U16, TYPE.U8]
    },
    DRIVE_TURN: {
        ID: 0x1062,
        ARGS: [TYPE.U16, TYPE.I8],
        REARGS: [TYPE.U16, TYPE.U8]
    },
    SONAR_GET_RANGE: {
        ID: 0x1063,
        ARGS: [],
        REARGS: [TYPE.U16, TYPE.U16]
    },
    SPEAK_BEEP: {
        ID: 0x1064,
        ARGS: [TYPE.U16],
        REARGS: [TYPE.U16, TYPE.U8]
    },
    LED_SET_COLOR: {
        ID: 0x1065,
        ARGS: [TYPE.U16, TYPE.U8, TYPE.U8, TYPE.U8],
        REARGS: [TYPE.U16, TYPE.U8]
    },
    BATTERY_GET_SOC: {
        ID: 0x1069,
        ARGS: [],
        REARGS: [TYPE.U16, TYPE.U8]
    },
    LIGHT_SENSE_GET_RAW: {
        ID: 0x106a,
        ARGS: [],
        REARGS: [TYPE.U16, TYPE.U16]
    },
    LINE_GET_RAW: {
        ID: 0x106b,
        ARGS: [],
        REARGS: [TYPE.U16, TYPE.U16, TYPE.U16]
    },
    MIC_GET_RAW: {
        ID: 0x106c,
        ARGS: [],
        REARGS: [TYPE.U16, TYPE.U16]
    },
};
