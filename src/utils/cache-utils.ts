import * as vscode from 'vscode';
import { getRootPath, doesUriExist } from './path-utils';
import { getFileContentFromTag, getTag } from '../git-extension';
import { TextEncoder } from 'util';

interface FileTagInformation {
  tag: string;
  uri: vscode.Uri;
}

/**
 * This class is a wrapper for the cache directory.
 * It contains all the functions to interact with the cache directory.
 * @export
 * @abstract
 * @class CacheUtils
 * @example
 * // returns
 * // "mnt/c/program/.git/tmp"
 * CacheUtils.cacheDirectory;
 * @example
 * // returns
 * // "mnt/c/program/.git/tmp/1234567890/file1" as a vscode.Uri
 * CacheUtils.getUriForCacheFile("file1", "1234567890" /* tag *\/);
 */
export default abstract class CacheUtils {
  private static cacheDirectory = getRootPath() + "/.git/tmp";

  public static clearCache() {
    vscode.workspace.fs.delete(vscode.Uri.file(this.cacheDirectory), { recursive: true });
  }

  public static openCacheFile(filePath: string) {
    this.getFileTagInformation(filePath).then((uriTag) => {
      if (uriTag) { vscode.window.showTextDocument(uriTag.uri); }
    });
  }

  public static getUriForCacheFile(file: string, tag: string) {
    return vscode.Uri.file(`${this.cacheDirectory}/${tag}/${file}`);
  }

  public static getFileTagInformation(file: string): Promise<FileTagInformation | void> {
    return getTag().then((tag) => {
      const uriNTag = { uri: CacheUtils.getUriForCacheFile(file, tag), tag };
      if (doesUriExist(uriNTag.uri)) {
        return uriNTag;
      }

      return this.downloadFile(tag, file)
        .then(() => {
          return uriNTag;
        })
        .catch(err => {
          if (err.message.includes("exists on disk")) {
            vscode.window.showWarningMessage(`File ${file} exists on disk, but not in the current tag. This is generally due that it is a new file.`);
          }
          else {
            vscode.window.showErrorMessage(`${err}`);
          }
        });
    });
  }

  private static downloadFile(tag: string, file: string) {
    return getFileContentFromTag(tag, file)
      .then((content) => {
        return vscode.workspace.fs.writeFile(CacheUtils.getUriForCacheFile(file, tag), new TextEncoder().encode(content));
      });
  }
}