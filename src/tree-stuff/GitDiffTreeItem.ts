import * as vscode from "vscode";
import { getFileAbosolutePath } from "../utils/path-utils";

export default class GitDiffTreeItem extends vscode.TreeItem {
  private _children: {} = {};

  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly children: {} = {},
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super("label", collapsibleState);
    description = description;
    this.tooltip = "Open File";
    this._children = children;
    this.resourceUri = vscode.Uri.file(this.label); // We need to set this so that the icon for the file is displayed
    this.command = {
      command: "vscode.open",
      title: "Open File",
      arguments: [vscode.Uri.file(getFileAbosolutePath(this.description)), { preview: false }]
    };
  }

  getChildren(): any[] {
    return Object.keys(this._children).map((key: any) => {
      const child = this._children[key as keyof Object] as any;

      if (typeof child === "object" && child.hasOwnProperty("fullPath")) {
        return new GitDiffTreeItem(key, child.fullPath);
      }
      else if (typeof child === "string") {
        return new GitDiffTreeItem(key, child);
      }

      return new GitDiffTreeItem(key, "", child, vscode.TreeItemCollapsibleState.Collapsed);
    });
  }

  contextValue = "file";
}