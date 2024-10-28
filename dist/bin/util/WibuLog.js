"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WibuLog = void 0;
const loading_cli_1 = __importDefault(require("loading-cli"));
class WibuLog {
    static log = () => (0, loading_cli_1.default)("").start();
}
exports.WibuLog = WibuLog;
