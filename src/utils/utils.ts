import * as vscode from 'vscode';

export function doesFileExist(fileUri: vscode.Uri) {
  return vscode.workspace.fs.stat(fileUri).then(() => true, () => false);
}

export function getFilePathFromTreeItem(item: vscode.TreeItem | string): string {
  if (item instanceof vscode.TreeItem) {
    return item.description as string;
  }
  return item;
}

export function getFileLabelFromTreeItem(item: vscode.TreeItem | string): string {
  if (item instanceof vscode.TreeItem) {
    return item.label as string;
  }
  return item;
}