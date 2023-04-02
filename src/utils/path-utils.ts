import path = require('path');
import * as fs from 'fs';
import * as vscode from 'vscode';

export function getRootPath() {
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) { return vscode.workspace.workspaceFolders[0].uri.fsPath; }
  return '';
}

export function doesFileExist(file: string) {
  try {
    return fs.existsSync(path.join(getRootPath(), file));
  } catch (e) {
    return false;
  }
}

export function getFileAbosolutePath(file: string) {
  return path.join(getRootPath(), file);
}

export function getFileRelativePath(file: string) {
  return path.relative(getRootPath(), getFileAbosolutePath(file));
}