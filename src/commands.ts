import * as vscode from 'vscode';

import GitDiffTreeItem from "./tree-stuff/GitDiffTreeItem";
import {
  getFileLabelFromTreeItem,
  getFilePathFromTreeItem
} from "./utils/utils";
import { getFiles } from './git-extension';
import CacheUtils from './utils/cache-utils';
import { getFileAbosolutePath } from './utils/path-utils';
import { getUsePreviewWhenOpeningFileFromConfiguration } from './utils/configuration-utils';
import { GitFile } from './GitFile';

/**
 * This function opens the changes of a file in the diff editor.
 * It will open the version of the file from the tag.
 * @param file The file or the tree item to open the changes of
 */
export function openChanges(file: string | GitDiffTreeItem) {
  const fileFullPath = getFilePathFromTreeItem(file);
  const fileLabel = getFileLabelFromTreeItem(file);

  if (fileFullPath !== "") {
    CacheUtils.getFileTagInformation(fileFullPath).then((uriNTag) => {
      if (uriNTag) {
        vscode.commands.executeCommand("vscode.diff",
          uriNTag.uri,
          vscode.Uri.file(getFileAbosolutePath(fileFullPath)),
          `${fileLabel} (Working Tree) ↔ ${fileLabel} (Tag: ${uriNTag.tag})`);
      }
    });
  }
}

/**
 * This function makes a dropdown list of all the files with changes, so the user can select one to open.
 */
export function listFilesAndOpenSelected() {
  getFiles().then((files: GitFile[]) => {
    vscode.window.showQuickPick(files.map((x) => (x.path))).then((file) => {
      if (file) {
        vscode.workspace.openTextDocument(getFileAbosolutePath(file)).then((doc) => {
          vscode.window.showTextDocument(doc, { preview: getUsePreviewWhenOpeningFileFromConfiguration() });
        });
      }
    });
  });
}

/**
 * Function to open a file.
 * @param file The file or the tree item to open
 */
export function openFile(file: string | GitDiffTreeItem) {
  if (file) {
    vscode.workspace.openTextDocument(getFileAbosolutePath(getFilePathFromTreeItem(file))).then((doc) => {
      vscode.window.showTextDocument(doc, { preview: getUsePreviewWhenOpeningFileFromConfiguration() });
    });
  }
}

/**
 * This function opens the cache version of a file. If the file does not exist in the cache, it will be downloaded.
 * @param file The file or the tree item to open the cache version of
 */
export function openCacheFile(file: string | GitDiffTreeItem) {
  CacheUtils.getFileTagInformation(getFilePathFromTreeItem(file)).then((uriNTag) => {
    if (uriNTag) {
      vscode.window.showTextDocument(uriNTag.uri, { preview: getUsePreviewWhenOpeningFileFromConfiguration() });
    }
  });
}

export function clearCache() {
  CacheUtils.clearCache();
}