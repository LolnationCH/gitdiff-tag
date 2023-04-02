import * as vscode from 'vscode';
import { getRootPath } from './path-utils';
import { getFileContentFromTag, getTag } from '../git-extension';
import { doesFileExist } from './utils';
import { TextEncoder } from 'util';

interface UriNTag {
  tag: string;
  uri: vscode.Uri;
}

export default abstract class CacheUtils {
  private static cacheDirectory = getRootPath() + "/.git/tmp";

  public static clearCache() {
    const cacheUri = vscode.Uri.file(this.cacheDirectory);
    vscode.workspace.fs.delete(cacheUri, { recursive: true });
  }

  public static openCacheFile(filePath: string) {
    getTempFileUriAndTag(filePath).then((uriTag) => {
      if (uriTag) { vscode.window.showTextDocument(uriTag.uri); }
    });
  }

  public static getUriForCacheFile(file: string, tag: string) {
    return vscode.Uri.file(`${this.cacheDirectory}/${tag}/${file}`);
  }

  public static getFileUriAndTag(file: string) {
    return getTempFileUriAndTag(file);
  }
}

/**
 * Get the file uri and the tag of the file in the cache
 * @param file The file path absolute
 * @returns The uri of the file in the cache and the tag. If the file does not exist in the cache, it will be downloaded.
 */
function getTempFileUriAndTag(file: string): Promise<UriNTag | void> {
  return getTag().then((tag) => {
    const uriNTag = { uri: CacheUtils.getUriForCacheFile(file, tag), tag };
    return doesFileExist(uriNTag.uri).then((fileExist) => {
      if (fileExist) {
        return uriNTag;
      }

      return getFileContentFromTag(uriNTag.tag, file)
        .then((content) => {
          return vscode.workspace.fs.writeFile(uriNTag.uri, new TextEncoder().encode(content)).then(() => {
            return uriNTag;
          }, (err) => {
            vscode.window.showErrorMessage(`Could not create temporary file : ${err}`);
          });
        })
        .catch(err => {
          if (err.message.includes("exists on disk")) {
            vscode.window.showWarningMessage(`File ${file} exists on disk, but not in the current tag.`);
          }
          else {
            vscode.window.showErrorMessage(`${err}`);
          }
        });
    });
  });
}