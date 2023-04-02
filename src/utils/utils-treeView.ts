import path = require("path");
import GitDiffTreeItem from "../tree-stuff/GitDiffTreeItem";
import { TreeItemCollapsibleState } from "vscode";

/**
 * This function returns a list of files as a GitDiffTreeItem[].
 * @param files List of files to return as a GitDiffTreeItem[]
 * @returns The list of files as a GitDiffTreeItem[]
 */
function getGitDiffList(files: string[]): GitDiffTreeItem[] {
  return files.map((file: string) => {
    const fileName = file.split('/').pop();
    if (fileName) { return new GitDiffTreeItem(fileName, file); }
    else { return new GitDiffTreeItem(file, file); }
  });
}

/**
 * This function returns a list of files as a GitDiffTreeItem[], grouped by folder. This is used for the tree view.
 * @param files List of files to return as a GitDiffTreeItem[], grouped by folder
 * @returns The list of files as a GitDiffTreeItem[], grouped by folder
 */
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

/**
 * This function returns a tree of files.
 * @param files List of files to return as a tree
 * @returns The list of files as a tree
 * @example
 * // returns
 * {
 *  "folder1": {
 *    "file1": {
 *      "fullPath": "folder1/file1"
 *    },
 *    "file2": {
 *      "fullPath": "folder1/file2"
 *    }
 *  },
 * "folder2": {
 *    "file3": {
 *      "fullPath": "folder2/file3"
 *    }
 *  },
 * "file4": {
 *   "fullPath": "file4"
 *  }
 * }
 * treeFromFilesArray(["folder1/file1", "folder1/file2", "folder2/file3"]);
 */
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

/**
 * This function returns a list of files as a GitDiffTreeItem[] or a GitDiffTreeItem[], grouped by folder.
 * @param useTreeView Whether to use the tree view or not
 * @param files List of files to return as a GitDiffTreeItem[] or a GitDiffTreeItem[], grouped by folder
 * @returns The list of files as a GitDiffTreeItem[] or a GitDiffTreeItem[], grouped by folder
 */
export default function getGitDiffTreeItem(useTreeView: boolean, files: string[]) {
  if (useTreeView) {
    return getGitDiffTree(files);
  }
  else {
    return getGitDiffList(files);
  }
}