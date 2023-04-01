import * as vscode from 'vscode';

import GitDiffTreeItem from "./gitDiffTreeItem";
import {
  getFileAbosolutePath,
  getFileLabelFromTreeItem,
  getFilePathFromTreeItem,
  getTempFileUriAndTag,
  clearCache as _clearCache
} from "./utils";
import { getFiles } from './git-extension';


export function openChanges(file: string | GitDiffTreeItem) {
  const fileFullPath = getFilePathFromTreeItem(file);
  const fileLabel = getFileLabelFromTreeItem(file);

  if (fileFullPath !== "") {
    getTempFileUriAndTag(fileFullPath).then((uriNTag) => {
      if (uriNTag) {
        vscode.commands.executeCommand("vscode.diff",
          vscode.Uri.file(getFileAbosolutePath(fileFullPath)),
          uriNTag.uri,
          `${fileLabel} (Working Tree) ↔ ${fileLabel} (Tag: ${uriNTag.tag})`);
      }
    });
  }
}

export function listFiles() {
  getFiles().then((files: any) => {
    vscode.window.showQuickPick(files).then((file) => {
      if (file) {
        vscode.workspace.openTextDocument(getFileAbosolutePath(file)).then((doc) => {
          vscode.window.showTextDocument(doc);
        });
      }
    });
  });
}

export function openFile(file: string | GitDiffTreeItem) {
  if (file) {
    vscode.workspace.openTextDocument(getFileAbosolutePath(getFilePathFromTreeItem(file))).then((doc) => {
      vscode.window.showTextDocument(doc);
    });
  }
}

export function clearCache() {
  _clearCache();
}

export function openCacheFile(file: string | GitDiffTreeItem) {
  getTempFileUriAndTag(getFilePathFromTreeItem(file)).then((uriNTag) => {
    if (uriNTag) {
      vscode.window.showTextDocument(uriNTag.uri);
    }
  });
}