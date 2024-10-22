import loading from "loading-cli";
const log = loading("loading ...").start();
;(async() => {
    log.start("memulai ...")
    await new Promise(resolve => setTimeout(resolve, 1000))
    log.stop()
    // process.exit()
})()