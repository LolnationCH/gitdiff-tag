import path = require('path');
import * as fs from 'fs';
import * as vscode from 'vscode';

/**
 * This function returns the root path of the workspace.
 * @returns The root path of the workspace
 */
export function getRootPath() {
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) { return vscode.workspace.workspaceFolders[0].uri.fsPath; }
  return '';
}

/**
 * This function is a wrapper to return if the file exists or not.
 * @param file The file to check
 * @returns if the file exists or not
 */
export function doesFileExist(file: string) {
  try {
    return fs.existsSync(path.join(getRootPath(), file));
  } catch (e) {
    return false;
  }
}

/**
 * This function returns the absolute path of the file. It uses the root path of the workspace as a base.
 * @param file The file to get the absolute path
 * @returns the absolute path of the file
 * @example
 * // returns
 * // "mnt/c/program/folder1/file1"
 * getFileAbosolutePath("folder1/file1");
 */
export function getFileAbosolutePath(file: string) {
  return path.join(getRootPath(), file);
}

/**
 * This function returns the relative path of the file. It uses the root path of the workspace as a base.
 * @param file The file to get the relative path
 * @returns the relative path of the file
 * @example
 * // returns
 * // "folder1/file1"
 * getFileRelativePath("folder1/file1");
 * @example
 * // returns
 * // "folder1/file1"
 * getFileRelativePath("mnt/c/program/folder1/file1");
 */
export function getFileRelativePath(file: string) {
  return path.relative(getRootPath(), getFileAbosolutePath(file));
}