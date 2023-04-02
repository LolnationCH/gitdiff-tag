import path = require("path");
import GitDiffTreeItem from "../tree-stuff/GitDiffTreeItem";
import { TreeItemCollapsibleState } from "vscode";

function getGitDiffList(files: string[]) {
  return files.map((file: string) => {
    const fileName = file.split('/').pop();
    if (fileName) { return new GitDiffTreeItem(fileName, file); }
    else { return new GitDiffTreeItem(file, file); }
  });
}

function getGitDiffTree(files: string[]) {
  var tree = treeFromFilesArray(files);
  return Object.keys(tree).map((key: string) => {
    const child = tree[key as keyof Object] as any;
    if (typeof child === "object" && child.hasOwnProperty("fullPath")) {
      return new GitDiffTreeItem(key, child.fullPath);
    }
    return new GitDiffTreeItem(key, "", tree[key as keyof Object], TreeItemCollapsibleState.Collapsed);
  });
}

function treeFromFilesArray(files: Array<string>) {
  const tree = {};
  files.forEach(file => {
    let parts = file.split(path.sep);

    if (parts.length === 1) {
      parts = file.split('/');
    }

    let node: any = tree;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        node[part] = { fullPath: file };
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

export default function getGitDiffTreeItem(useTreeView: boolean, files: string[]) {
  if (useTreeView) {
    return getGitDiffTree(files);
  }
  else {
    return getGitDiffList(files);
  }
}
