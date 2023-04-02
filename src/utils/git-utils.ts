import { doesFileExist } from "./path-utils";

export function resolveGetFiles(filesArray: string[][]) {
  return ([] as string[]).concat(...filesArray)
    .filter((file: string) => {
      return doesFileExist(file);
    });
}