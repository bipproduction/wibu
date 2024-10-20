"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotificationSubscribeFromServer = pushNotificationSubscribeFromServer;
const PushDb_1 = require("../PushDb");
async function pushNotificationSubscribeFromServer({ endpoint, data, WIBU_PUSH_DB_TOKEN }) {
    PushDb_1.PushDb.init({
        project: "push-notification",
        WIBU_PUSH_DB_TOKEN
    });
    try {
        await PushDb_1.PushDb.upsert({
            id: endpoint,
            data: data
        });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
