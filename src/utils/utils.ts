import * as vscode from 'vscode';

/**
 * This function is a wrapper to return if the file exists or not.
 * @param fileUri The file uri to check
 * @returns If the file exists or not
 */
export function doesFileExist(fileUri: vscode.Uri) {
  return vscode.workspace.fs.stat(fileUri).then(() => true, () => false);
}

/**
 * This function is a wrapper to return the file path.
 * @param item Either a tree item or a string
 * @returns The file path of the tree item or the string
 */
export function getFilePathFromTreeItem(item: vscode.TreeItem | string): string {
  if (item instanceof vscode.TreeItem) {
    return item.description as string;
  }
  return item;
}

/**
 * This function is a wrapper to return the file name.
 * @param item Either a tree item or a string
 * @returns The file name of the tree item or the string
 */
export function getFileLabelFromTreeItem(item: vscode.TreeItem | string): string {
  if (item instanceof vscode.TreeItem) {
    return item.label as string;
  }
  return item;
}