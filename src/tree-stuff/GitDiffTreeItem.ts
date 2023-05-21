import * as vscode from "vscode";
import { getFileAbosolutePath } from "../utils/path-utils";
import { getTreeShouldAlwaysAutoOpen, getUsePreviewWhenOpeningFileFromConfiguration } from "../utils/configuration-utils";
import { GitFile, GitFileState } from "../GitFile";
import GitDiffTreeOptions from "./GitDiffTreeOptions";

export default class GitDiffTreeItem extends vscode.TreeItem {
  public children: {} = {};
  private _children: {} = {};
  public absolutePath: vscode.Uri;

  constructor(
    public readonly gitFile: GitFile,
    public readonly options?: GitDiffTreeOptions
  ) {
    const collapsibleState = options?.collapsibleState || vscode.TreeItemCollapsibleState.None;
    super("label", collapsibleState);
    if (this.gitFile.isFolder) {
      this.collapsibleState = getTreeShouldAlwaysAutoOpen();
    }
    else {
      this.collapsibleState = collapsibleState;
    }

    this.contextValue = this.gitFile.getContext();
    this.label = this.gitFile.getLabel();
    this.tooltip = this.gitFile.getToolTip();
    this.resourceUri = vscode.Uri.file(this.gitFile.filename); // We need to set this so that the icon for the file is displayed
    if (!options?.isInTreeView) { this.description = this.gitFile.path; }

    this.children = options?.children || {};
    this._children = this.children;
    this.absolutePath = vscode.Uri.file(getFileAbosolutePath(this.gitFile.path));
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
        arguments: [this.absolutePath, {
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
        return new GitDiffTreeItem(child.gitFile, new GitDiffTreeOptions({}, undefined, true));
      }

      const gitFile = new GitFile("", key, false, true, GitFileState.none);
      const options = new GitDiffTreeOptions(child, vscode.TreeItemCollapsibleState.Collapsed, true);
      return new GitDiffTreeItem(gitFile, options);
    });
  }

}