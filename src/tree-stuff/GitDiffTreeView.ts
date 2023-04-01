import * as vscode from 'vscode';

import { getFiles } from '../git-extension';
import GitDiffTreeItem from './GitDiffTreeItem';
import GitDiffTreeViewState from './GitDiffTreeViewState';
import getGitDiffTreeItem from './utils-treeItem';

export default class GitDiffTreeView implements vscode.TreeDataProvider<GitDiffTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<GitDiffTreeItem | undefined> = new vscode.EventEmitter<GitDiffTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<GitDiffTreeItem | undefined> = this._onDidChangeTreeData.event;

  private state: GitDiffTreeViewState;

  constructor(private context: vscode.ExtensionContext) {
    this.state = new GitDiffTreeViewState(context);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  refreshData() {
    getFiles().then((files: any) => {
      this.state.files = files;
      this.refresh();
    });
  }

  getTreeItem(element: GitDiffTreeItem): vscode.TreeItem {
    return element;
  }

  toggleTree() {
    this.state.isTreeView = !this.state.isTreeView;
    this.refresh();
  }

  getChildren(element?: GitDiffTreeItem): Thenable<GitDiffTreeItem[]> {
    if (element) {
      return Promise.resolve(element.getChildren());
    } else {
      return Promise.resolve(getGitDiffTreeItem(this.state.isTreeView, this.state.files));
    }
  }
}