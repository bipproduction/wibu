"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotificationDeleteSubscribe = pushNotificationDeleteSubscribe;
const PushDb_1 = require("../PushDb");
async function pushNotificationDeleteSubscribe(endpoint) {
    const subscribe = await PushDb_1.PushDb.delete(endpoint);
    return subscribe;
}
