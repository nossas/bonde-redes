import fs from "fs";
import path from "path";
import { promisify } from "util";
import dbg from "./dbg";

const writeFile = promisify(fs.writeFile);

const log = dbg.extend("saveStateToFile");

const saveStateToFile = async (filename: string, state: any) => {
  try {
    await writeFile(
      path.resolve("src/__tests__/data", `${filename}.json`),
      JSON.stringify(state)
    );
    log(`saved to file '${filename}'.`);
  } catch (e) {
    log(e);
  }
};

export default saveStateToFile;
