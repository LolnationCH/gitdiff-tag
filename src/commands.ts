import * as vscode from 'vscode';

import GitDiffTreeItem from "./tree-stuff/GitDiffTreeItem";
import {
  getFilePathFromTreeItem,
  getFileLabelFromTreeItem
} from "./utils/utils";
import { getFiles } from './git-extension';
import CacheUtils from './utils/cache-utils';
import { getFileAbosolutePath } from './utils/path-utils';
import { getUsePreviewWhenOpeningFileFromConfiguration } from './utils/configuration-utils';
import { GitFile, GitFileState } from './GitFile';

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
        const workingTreeStr = vscode.l10n.t("(Working Tree)");
        vscode.commands.executeCommand("vscode.diff",
          uriNTag.uri,
          vscode.Uri.file(getFileAbosolutePath(fileFullPath)),
          `${fileLabel} ${workingTreeStr} ↔ ${fileLabel} (Tag: ${uriNTag.tag})`);
      }
    });
  }
}

/**
 * This function makes a dropdown list of all the files with changes, so the user can select one to open.
 */
export function listFilesAndOpenSelected() {
  getFiles().then((files: GitFile[]) => {
    vscode.window.showQuickPick(files.filter(x => x.state !== GitFileState.deleted).map((x) => (x.path))).then((file) => {
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

export function revertFileToTag(file: string | GitDiffTreeItem): any {
  const fileFullPath = getFilePathFromTreeItem(file);

  const question = vscode.l10n.t("Are you sure you want to revert the file to the tag?");
  const answerYes = vscode.l10n.t("Yes");

  vscode.window.showInformationMessage(question, { modal: true }, answerYes).then((answer) => {
    if (answer === answerYes) {
      CacheUtils.revertFileToTag(fileFullPath);
    }
  });
}
