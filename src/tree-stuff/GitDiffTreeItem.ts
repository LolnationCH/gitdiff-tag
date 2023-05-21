import * as vscode from "vscode";
import { getFileAbosolutePath } from "../utils/path-utils";
import { getTreeShouldAlwaysAutoOpen, getUsePreviewWhenOpeningFileFromConfiguration } from "../utils/configuration-utils";
import { GitFile, GitFileState } from "../GitFile";

export default class GitDiffTreeItem extends vscode.TreeItem {
  private _children: {} = {};
  private _absolutePath: vscode.Uri;

  constructor(
    public readonly gitFile: GitFile,
    public readonly children: {} = {},
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
    public readonly isInTreeView: boolean = true
  ) {
    super("label", collapsibleState);
    if (!this.isInTreeView) { this.description = this.gitFile.path; }
    this.label = this.gitFile.getLabel();
    this.tooltip = this.gitFile.getToolTip();
    this._children = children;
    this.resourceUri = vscode.Uri.file(this.gitFile.filename); // We need to set this so that the icon for the file is displayed
    this._absolutePath = vscode.Uri.file(getFileAbosolutePath(this.gitFile.path));
    this.contextValue = this.gitFile.getContext();

    if (this.gitFile.isFolder) {
      this.collapsibleState = getTreeShouldAlwaysAutoOpen();
    }
    this.command = this.getCommand();
  }

  getCommand(): vscode.Command | undefined {
    if (this.gitFile.isFolder) {
      return undefined;
    }
    else if (this.gitFile.exists) {
      return {
        command: "vscode.open",
        title: "Open File",
        arguments: [this._absolutePath, {
          preview: getUsePreviewWhenOpeningFileFromConfiguration()
        }]
      };
    }
    return undefined;
  }

  getChildren(): any[] {
    return Object.keys(this._children).map((key: any) => {
      const child = this._children[key as keyof Object] as any;

      if (typeof child === "object" && child.hasOwnProperty("gitFile")) {
        return new GitDiffTreeItem(child.gitFile);
      }

      return new GitDiffTreeItem(new GitFile("", key, false, true, GitFileState.none), child, vscode.TreeItemCollapsibleState.Collapsed);
    });
  }

  contextValue = "file";
}