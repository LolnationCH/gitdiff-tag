import * as vscode from "vscode";

export class GitDiffTreeItem extends vscode.TreeItem {

  command?: vscode.Command = { command: "gitdiff-tag.openFile", title: "Open File", arguments: [this.description] };

  constructor(
    public readonly label: string,
    public readonly description: string
  ) {
    super("label", vscode.TreeItemCollapsibleState.None);
    description = description;
    this.tooltip = "Open File";
  }


  contextValue = "file";
}