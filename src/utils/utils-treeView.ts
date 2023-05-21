import path = require("path");
import GitDiffTreeItem from "../tree-stuff/GitDiffTreeItem";
import { TreeItemCollapsibleState } from "vscode";
import { GitFile, GitFileState } from "../GitFile";
import GitDiffTreeOptions from "../tree-stuff/GitDiffTreeOptions";

type GitFileTree = { gitFile: GitFile };
type Tree = { [key: string]: Tree | GitFileTree };

function getGitDiffList(files: GitFile[]): GitDiffTreeItem[] {
  const options = new GitDiffTreeOptions({}, TreeItemCollapsibleState.None, false);
  return files.map((file: GitFile) => new GitDiffTreeItem(file, options));
}

function getGitDiffTree(files: GitFile[]) {
  var tree = treeFromFilesArray(files);
  return sortTreeKeysByFolderThanByState(Object.keys(tree), tree).map((key: string) => {
    const child = tree[key as keyof Object] as any;
    if (typeof child === "object" && child.hasOwnProperty("gitFile")) {
      return new GitDiffTreeItem(child.gitFile, new GitDiffTreeOptions({}, undefined, true));
    }

    const gitFile = new GitFile("", key, false, true, GitFileState.none);
    const options = new GitDiffTreeOptions(tree[key as keyof Object], TreeItemCollapsibleState.Collapsed, true);
    return new GitDiffTreeItem(gitFile, options);
  });
}

function sortTreeKeysByFolderThanByState(keys: string[], tree: Tree) {
  return keys.sort((a, b) => {
    const aIsFolder = !tree[a as keyof Object].hasOwnProperty("gitFile");
    const bIsFolder = !tree[b as keyof Object].hasOwnProperty("gitFile");
    if (aIsFolder && !bIsFolder) {
      return -1;
    }
    if (!aIsFolder && bIsFolder) {
      return 1;
    }
    return a.localeCompare(b);
  });
}

function treeFromFilesArray(files: Array<GitFile>) {
  const tree = {};
  files.forEach(file => {
    let parts = file.path.split(path.sep);

    if (parts.length === 1) {
      parts = file.path.split('/');
    }

    let node: any = tree;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        node[part] = { gitFile: file };
      } else {
        if (!node[part]) {
          node[part] = {};
        }
        node = node[part];
      }
    });
  });
  return tree;
}

export default function getGitDiffTreeItem(useTreeView: boolean, files: GitFile[]) {
  if (useTreeView) {
    return getGitDiffTree(files);
  }
  else {
    return getGitDiffList(files);
  }
}