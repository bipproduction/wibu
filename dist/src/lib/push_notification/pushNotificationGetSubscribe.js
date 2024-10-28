"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotificationGetSubscribe = pushNotificationGetSubscribe;
const PushDb_1 = require("../PushDb");
async function pushNotificationGetSubscribe() {
    const subscribe = await PushDb_1.PushDb.findMany();
    return subscribe;
}
