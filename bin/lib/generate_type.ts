import fs from "fs/promises";
import path from "path";
import { URL } from "url";
import JsonToTs from "json-to-ts";
import _ from "lodash";
import loading from "loading-cli";

const rootTypes = path.join(process.cwd(), "src/types");

export async function generateType(pathSource: string, fileName?: string) {
  const log = loading("loading ...").start();

  try {
    await fs.mkdir(rootTypes, { recursive: true });
    const dataJson = isValidUrl(pathSource)
      ? await fetchJsonFromUrl(pathSource)
      : await fetchJsonFromFile(pathSource);

    if (!dataJson) return log.fail("Failed to generate type | dataJson");

    let { name, json } = dataJson;
    if (fileName) {
      name = fileName;
    }
    name = _.startCase(name).replace(/ /g, "");
    const jsonObject = Array.isArray(json) ? json[0] : json;

    log.info("Generating type ...");

    const types = JsonToTs(jsonObject)
      .map((type, i) =>
        i === 0
          ? `export interface ${type.replace(/interface RootObject/g, name)}`
          : type
      )
      .join("\n");

    await fs.writeFile(
      path.join(rootTypes, `${name}.d.ts`),
      `/* eslint-disable @typescript-eslint/no-explicit-any */\n${types}`,
      "utf8"
    );

    log.succeed("Type generated");
  } catch (error) {
    log.fail("Failed to generate type | global error");
    console.error(error);
  } finally {
    log.stop();
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function fetchJsonFromUrl(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    console.log("File not found" + response.statusText);
    return null;
  }
  const json = await response.json();
  return { name: path.basename(url), json };
}

async function fetchJsonFromFile(filePath: string) {
  if (path.extname(filePath) !== ".json") {
    console.log("Only .json is supported");
    return null;
  }
  const json = JSON.parse(await fs.readFile(filePath, "utf8"));

  return { name: path.basename(filePath, ".json"), json };
}
