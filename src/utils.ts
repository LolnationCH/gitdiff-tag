import path = require('path');
import * as vscode from 'vscode';

export function getRootPath() {
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) { return vscode.workspace.workspaceFolders[0].uri.fsPath; }
  return '';
}

export function getFileAbosolutePath(file: string) {
  return path.join(getRootPath(), file);
}

export function treeFromFilesArray(files: Array<string>) {
  const tree = {};
  files.forEach(file => {
    const parts = file.split(path.sep);
    let node: any = tree;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        node[part] = { fullPath: file };
      } else {
        if (!node[part]) {
          node[part] = {};
        }
        node = node[part];
      }
    });
  });
  return tree;
}