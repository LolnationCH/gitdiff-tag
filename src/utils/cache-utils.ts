import * as vscode from 'vscode';
import { getRootPath, doesUriExist, getFileAbosolutePath } from './path-utils';
import { getFileContentFromTag, getTag } from '../git-extension';
import { createHidenFolder } from './utils';

interface FileTagInformation {
  tag: string;
  uri: vscode.Uri;
}

export default abstract class CacheUtils {
  private static cacheDirectory = getRootPath() + "/.cache-ext";

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
            const errorMessage = "File \"{file}\" exists on disk, but not in the current tag. This is generally due that it is a new file.";
            const l10nmsg = vscode.l10n.t(errorMessage, { file });
            vscode.window.showWarningMessage(l10nmsg);
          }
          else {
            vscode.window.showErrorMessage(`${err}`);
          }
        });
    });
  }

  private static downloadFile(tag: string, file: string) {
    createHidenFolder(this.cacheDirectory);

    const dest = CacheUtils.getUriForCacheFile(file, tag);
    return getFileContentFromTag(tag, file, dest);
  }

  public static revertFileToTag(fileFullPath: string) {
    if (fileFullPath === "") {
      return;
    }

    this.getFileTagInformation(fileFullPath).then((uriNTag) => {
      if (uriNTag) {
        vscode.workspace.fs.readFile(uriNTag.uri).then((buffer) => {
          vscode.workspace.fs.writeFile(vscode.Uri.file(getFileAbosolutePath(fileFullPath)), buffer);
        });
      }
    });
  }
}