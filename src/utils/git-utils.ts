import { doesFileExist } from "./path-utils";

/**
 * This function flattens the array of files and checks if the files exist.
 * @param filesArray The array of files to flatten
 * @returns The list of files as a string[] that exist
 */
export function getFlattenAndCheckIfFileExist(filesArray: string[][]) {
  return ([] as string[]).concat(...filesArray)
    .filter((file: string) => {
      return doesFileExist(file);
    });
}