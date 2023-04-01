import path = require('path');
import * as vscode from 'vscode';
import { getFileContentFromTag, getTag } from './git-extension';
import { TextEncoder } from 'util';


export function getRootPath() {
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) { return vscode.workspace.workspaceFolders[0].uri.fsPath; }
  return '';
}

const cacheDirectory = getRootPath() + "/.git/tmp";

function fileExist(fileUri: vscode.Uri) {
  return vscode.workspace.fs.stat(fileUri).then(() => true, () => false);
}

export function getFileAbosolutePath(file: string) {
  return path.join(getRootPath(), file);
}

export function getFileRelativePath(file: string) {
  return path.relative(getRootPath(), getFileAbosolutePath(file));
}

export function treeFromFilesArray(files: Array<string>) {
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

export function clearCache() {
  const cacheUri = vscode.Uri.file(cacheDirectory);
  vscode.workspace.fs.delete(cacheUri, { recursive: true });
}

export function downloadFileOfTag(file: string): Promise<(string | vscode.Uri)[] | void> {
  return getTag().then((tag) => {
    const tempUri = vscode.Uri.file(`${cacheDirectory}/${tag}/${file}`);
    return fileExist(tempUri).then((fileExist) => {
      if (fileExist) {
        return [tempUri, tag];
      }

      return getFileContentFromTag(tag, file).then((content) => {
        return getLanguageIdentifierBasedOnExtension(file).then((lang) => {
          return vscode.workspace.fs.writeFile(tempUri, new TextEncoder().encode(content)).then(() => {
            return [tempUri, tag];
          }, (err) => {
            vscode.window.showErrorMessage(`Could not create temporary file : ${err}`);
          });
        });
      });
    });
  })
    .catch(err => {
      if (err.message.includes("exists on disk")) {
        vscode.window.showWarningMessage(`File ${file} exists on disk, but not in the current tag.`);
      }
      else {
        vscode.window.showErrorMessage(`${err}`);
      }
    });
}

function getLanguageIdentifierBasedOnExtension(file: string) {
  const extension = path.extname(file).replace(".", "");
  return vscode.languages.getLanguages().then((ls: string[]) => {
    if (ls.find(lang => lang.includes(extension))) {
      return extension;
    }

    return ls.find(lang => vscode.extensions.all.some(ext => ext.packageJSON.contributes &&
      ext.packageJSON.contributes.languages &&
      ext.packageJSON.contributes.languages.find((l: any) => l.id === lang && l.extensions && l.extensions.includes(extension))));
  });
}

export function getFilePathFromTreeItem(item: vscode.TreeItem | string): string {
  if (item instanceof vscode.TreeItem) {
    return item.description as string;
  }
  return item;
}

export function getFileLabelFromTreeItem(item: vscode.TreeItem | string): string {
  if (item instanceof vscode.TreeItem) {
    return item.label as string;
  }
  return item;
}