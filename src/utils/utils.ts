import * as vscode from 'vscode';
import * as fs from 'fs';
import { getRootPath, hideFolderInVscode } from './path-utils';
import GitDiffTreeItem from '../tree-stuff/GitDiffTreeItem';
import path = require('path');

export function doesFileExist(fileUri: vscode.Uri) {
  return vscode.workspace.fs.stat(fileUri).then(() => true, () => false);
}

export function getFilePathFromTreeItem(item: GitDiffTreeItem | string): string {
  if (item instanceof GitDiffTreeItem) {
    return item.absolutePath.fsPath.replace(getRootPath(), "").replace(path.sep, "");
  }
  return item;
}

export function getFileLabelFromTreeItem(item: GitDiffTreeItem | string): string {
  if (item instanceof GitDiffTreeItem) {
    return item.gitFile.filename;
  }
  return item;
}

export function createHidenFolder(folder: string) {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
      hideFolderInVscode(folder);
    }
  }
  catch (err) {
    console.log("Could not set cache directory as hidden");
  }
}