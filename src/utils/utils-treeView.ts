import path = require("path");
import GitDiffTreeItem from "../tree-stuff/GitDiffTreeItem";
import { TreeItemCollapsibleState } from "vscode";
import { GitFile, GitFileState } from "../GitFile";

type GitFileTree = { gitFile: GitFile };
type Tree = { [key: string]: Tree | GitFileTree };

/**
 * This function returns a list of files as a GitDiffTreeItem[].
 * @param files List of files to return as a GitDiffTreeItem[]
 * @returns The list of files as a GitDiffTreeItem[]
 */
function getGitDiffList(files: GitFile[]): GitDiffTreeItem[] {
  return files.map((file: GitFile) => new GitDiffTreeItem(file));
}

/**
 * This function returns a list of files as a GitDiffTreeItem[], grouped by folder. This is used for the tree view.
 * @param files List of files to return as a GitDiffTreeItem[], grouped by folder
 * @returns The list of files as a GitDiffTreeItem[], grouped by folder
 */
function getGitDiffTree(files: GitFile[]) {
  var tree = treeFromFilesArray(files);
  return sortTreeKeysByFolderThanByState(Object.keys(tree), tree).map((key: string) => {
    const child = tree[key as keyof Object] as any;
    if (typeof child === "object" && child.hasOwnProperty("gitFile")) {
      return new GitDiffTreeItem(child.gitFile);
    }
    return new GitDiffTreeItem(new GitFile("", key, false, true, GitFileState.none), tree[key as keyof Object], TreeItemCollapsibleState.Collapsed);
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

/**
 * This function returns a list of files as a GitDiffTreeItem[] or a GitDiffTreeItem[], grouped by folder.
 * @param useTreeView Whether to use the tree view or not
 * @param files List of files to return as a GitDiffTreeItem[] or a GitDiffTreeItem[], grouped by folder
 * @returns The list of files as a GitDiffTreeItem[] or a GitDiffTreeItem[], grouped by folder
 */
export default function getGitDiffTreeItem(useTreeView: boolean, files: GitFile[]) {
  if (useTreeView) {
    return getGitDiffTree(files);
  }
  else {
    return getGitDiffList(files);
  }
}