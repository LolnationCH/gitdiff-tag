import * as vscode from 'vscode';

import { getFiles } from './git-extension';

import { GitDiffTreeItem } from './giDiffTreeItem';

function getGitDiffTreeItem() {
  return getFiles().then((files: any) => {
    return files.map((file: string) => {
      // Get the file name
      const fileName = file.split('/').pop();
      if (fileName) { return new GitDiffTreeItem(fileName, file); }
      else { return new GitDiffTreeItem(file, file); }
    });
  });
}

export class GitDiffTreeView implements vscode.TreeDataProvider<GitDiffTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<GitDiffTreeItem | undefined> = new vscode.EventEmitter<GitDiffTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<GitDiffTreeItem | undefined> = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: GitDiffTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: GitDiffTreeItem): Thenable<GitDiffTreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(getGitDiffTreeItem());
    }
  }
}