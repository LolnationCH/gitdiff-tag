import * as vscode from "vscode";
import { getFileAbosolutePath } from "../utils/path-utils";
import { getTreeShouldAlwaysAutoOpen, getUsePreviewWhenOpeningFileFromConfiguration } from "../utils/configuration-utils";
import { GitFile } from "../GitFile";

export default class GitDiffTreeItem extends vscode.TreeItem {
  private _children: {} = {};
  private _absolutePath: vscode.Uri;

  constructor(
    public readonly gitFile: GitFile,
    public readonly children: {} = {},
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super("label", collapsibleState);
    this.description = this.gitFile.path;
    this.label = this.gitFile.getLabel();
    this.tooltip = "Open File";
    this._children = children;
    this.resourceUri = vscode.Uri.file(this.gitFile.filename); // We need to set this so that the icon for the file is displayed
    this._absolutePath = vscode.Uri.file(getFileAbosolutePath(this.gitFile.path));

    if (this.gitFile.isFolder) {
      this.contextValue = "folder";
      this.collapsibleState = getTreeShouldAlwaysAutoOpen();
    }
    else if (this.gitFile.exists) {
      this.command = {
        command: "vscode.open",
        title: "Open File",
        arguments: [this._absolutePath, {
          preview: getUsePreviewWhenOpeningFileFromConfiguration()
        }]
      };
      this.contextValue = "file";
    }
    else {
      this.contextValue = "file_deleted";
    }
  }

  getChildren(): any[] {
    return Object.keys(this._children).map((key: any) => {
      const child = this._children[key as keyof Object] as any;

      if (typeof child === "object" && child.hasOwnProperty("gitFile")) {
        return new GitDiffTreeItem(child.gitFile);
      }

      return new GitDiffTreeItem(this.gitFile, child, vscode.TreeItemCollapsibleState.Collapsed);
    });
  }

  contextValue = "file";
}