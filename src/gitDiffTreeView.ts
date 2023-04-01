import * as vscode from 'vscode';

import { getFiles } from './git-extension';

import GitDiffTreeItem from './gitDiffTreeItem';
import { treeFromFilesArray } from './utils';

export default class GitDiffTreeView implements vscode.TreeDataProvider<GitDiffTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<GitDiffTreeItem | undefined> = new vscode.EventEmitter<GitDiffTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<GitDiffTreeItem | undefined> = this._onDidChangeTreeData.event;

  private isTreeView: boolean = false;
  private _files: Array<string> = [];

  constructor(private context: vscode.ExtensionContext) {
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  refreshData() {
    getFiles().then((files: any) => {
      this._files = files;
      this.refresh();
    });
  }

  getTreeItem(element: GitDiffTreeItem): vscode.TreeItem {
    return element;
  }

  toggleTree() {
    this.isTreeView = !this.isTreeView;
    this.refresh();
  }

  getGitDiffList() {
    return this._files.map((file: string) => {
      const fileName = file.split('/').pop();
      if (fileName) { return new GitDiffTreeItem(fileName, file); }
      else { return new GitDiffTreeItem(file, file); }
    });
  }

  getGitDiffTree() {
    var tree = treeFromFilesArray(this._files);
    return Object.keys(tree).map((key: string) => {
      const child = tree[key as keyof Object] as any;
      if (typeof child === "object" && child.hasOwnProperty("fullPath")) {
        return new GitDiffTreeItem(key, child.fullPath);
      }
      return new GitDiffTreeItem(key, "", tree[key as keyof Object], vscode.TreeItemCollapsibleState.Collapsed);
    });
  }

  getGitDiffTreeItem() {
    if (this.isTreeView) {
      return this.getGitDiffTree();
    }
    else {
      return this.getGitDiffList();
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