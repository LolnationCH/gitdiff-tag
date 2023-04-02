import * as vscode from 'vscode';

import GitDiffTreeItem from "./tree-stuff/GitDiffTreeItem";
import {
  getFileLabelFromTreeItem,
  getFilePathFromTreeItem
} from "./utils/utils";
import { getFiles } from './git-extension';
import CacheUtils from './utils/cache-utils';
import { getFileAbosolutePath } from './utils/path-utils';


export function openChanges(file: string | GitDiffTreeItem) {
  const fileFullPath = getFilePathFromTreeItem(file);
  const fileLabel = getFileLabelFromTreeItem(file);

  if (fileFullPath !== "") {
    CacheUtils.getFileUriAndTag(fileFullPath).then((uriNTag) => {
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
  CacheUtils.clearCache();
}

export function openCacheFile(file: string | GitDiffTreeItem) {
  CacheUtils.getFileUriAndTag(getFilePathFromTreeItem(file)).then((uriNTag) => {
    if (uriNTag) {
      vscode.window.showTextDocument(uriNTag.uri);
    }
  });
}