import path = require('path');
import * as vscode from 'vscode';

export function getRootPath() {
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) { return vscode.workspace.workspaceFolders[0].uri.fsPath; }
  return '';
}

export function getFileAbosolutePath(file: string) {
  return path.join(getRootPath(), file);
}