import { ollamaAi } from "./src/";
import loading from "loading-cli";
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiY20xZ290ZjJtMDAwMDQ4dTk4dnBkM2lqOCIsIm5hbWUiOm51bGwsInBob25lIjoiNjI4OTY5NzMzODgyMSJ9LCJpYXQiOjE3MjcxOTgzMTEsImV4cCI6MTk0ODEwMTUxMX0.XVD8VBnxfjCG62GcVCEUb-TJNFiVyGgCkkW2PQQYRMY";
(async () => {
  const log = loading("loading ...").start();
  const data = await ollamaAi({
    token: token,
    prompt: "contoh code python dalam 20 kata"
  });

  console.log(data);
  log.stop();
})();
