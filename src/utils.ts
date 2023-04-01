import path = require('path');
import * as vscode from 'vscode';
import { getFileContentFromTag, getTag } from './git-extension';
import { TextEncoder } from 'util';

export interface UriNTag {
  tag: string;
  uri: vscode.Uri;
}


export function getRootPath() {
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) { return vscode.workspace.workspaceFolders[0].uri.fsPath; }
  return '';
}

const cacheDirectory = getRootPath() + "/.git/tmp";

function fileExist(fileUri: vscode.Uri) {
  return vscode.workspace.fs.stat(fileUri).then(() => true, () => false);
}

export function getFileAbosolutePath(file: string) {
  return path.join(getRootPath(), file);
}

export function getFileRelativePath(file: string) {
  return path.relative(getRootPath(), getFileAbosolutePath(file));
}

export function clearCache() {
  const cacheUri = vscode.Uri.file(cacheDirectory);
  vscode.workspace.fs.delete(cacheUri, { recursive: true });
}

export function openCacheFile(filePath: string) {
  getTempFileUriAndTag(filePath).then((uriTag) => {
    if (uriTag) { vscode.window.showTextDocument(uriTag.uri); }
  });
}

/**
 * Get the file uri and the tag of the file in the cache
 * @param file The file path absolute
 * @returns The uri of the file in the cache and the tag. If the file does not exist in the cache, it will be downloaded.
 */
export function getTempFileUriAndTag(file: string): Promise<UriNTag | void> {
  return getTag().then((tag) => {
    const uriNTag = { uri: vscode.Uri.file(`${cacheDirectory}/${tag}/${file}`), tag };
    return fileExist(uriNTag.uri).then((fileExist) => {
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

export function getFilePathFromTreeItem(item: vscode.TreeItem | string): string {
  if (item instanceof vscode.TreeItem) {
    return item.description as string;
  }
  return item;
}

export function getFileLabelFromTreeItem(item: vscode.TreeItem | string): string {
  if (item instanceof vscode.TreeItem) {
    return item.label as string;
  }
  return item;
}