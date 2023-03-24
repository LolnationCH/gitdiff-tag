import * as vscode from 'vscode';

import { getFiles } from './git-extension';

import { GitDiffTreeItem } from './gitDiffTreeItem';
import { treeFromFilesArray } from './utils';

function getGitDiffList() {
  return getFiles().then((files: any) => {
    return files.map((file: string) => {
      const fileName = file.split('/').pop();
      if (fileName) { return new GitDiffTreeItem(fileName, file); }
      else { return new GitDiffTreeItem(file, file); }
    });
  });
}

function getGitDiffTree() {
  return getFiles().then((files: any) => {
    var tree = treeFromFilesArray(files);
    return Object.keys(tree).map((key: string) => {
      const child = tree[key as keyof Object] as any;
      if (typeof child === "object" && child.hasOwnProperty("fullPath")) {
        return new GitDiffTreeItem(key, child.fullPath);
      }
      return new GitDiffTreeItem(key, "", tree[key as keyof Object], vscode.TreeItemCollapsibleState.Collapsed);
    });
  });
}

export class GitDiffTreeView implements vscode.TreeDataProvider<GitDiffTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<GitDiffTreeItem | undefined> = new vscode.EventEmitter<GitDiffTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<GitDiffTreeItem | undefined> = this._onDidChangeTreeData.event;

  private isTreeView: boolean = false;

  constructor(private context: vscode.ExtensionContext) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: GitDiffTreeItem): vscode.TreeItem {
    return element;
  }

  toggleTree() {
    this.isTreeView = !this.isTreeView;
    this.refresh();
  }

  getGitDiffTreeItem() {
    if (this.isTreeView) {
      return getGitDiffTree();
    }
    else {
      return getGitDiffList();
    }
  }

  getChildren(element?: GitDiffTreeItem): Thenable<GitDiffTreeItem[]> {
    if (element) {
      return Promise.resolve(element.getChildren());
    } else {
      return Promise.resolve(this.getGitDiffTreeItem());
    }
  }
}