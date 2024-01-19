"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const pino_1 = __importDefault(require("pino"));
const pino_2 = __importDefault(require("pino"));
const transport = pino_1.default.transport({
    target: "pino-pretty",
    options: { colorize: true }
});
const log = (0, pino_2.default)({
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${(0, dayjs_1.default)().format()}"`
}, transport);
exports.default = log;
