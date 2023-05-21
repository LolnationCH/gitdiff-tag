import * as vscode from "vscode";

export default class GitDiffTreeOptions {
  constructor(
    public readonly children?: {},
    public readonly collapsibleState?: vscode.TreeItemCollapsibleState,
    public readonly isInTreeView?: boolean
  ) {
    this.children = children;
    this.collapsibleState = collapsibleState;
    this.isInTreeView = isInTreeView;
  }
}