import * as vscode from 'vscode';
import { getFiles } from './git-extension';
import { GitDiffTreeItem } from './gitDiffTreeItem';

import { GitDiffTreeView } from './gitDiffTreeView';
import { clearCache, downloadFileOfTag, getFileAbosolutePath, getFileLabelFromTreeItem, getFilePathFromTreeItem } from './utils';

export function activate(context: vscode.ExtensionContext) {

  // Command that opens the file in the editor from the tree view
  let disposable = vscode.commands.registerCommand('gitdiff-tag.openFile', (file) => {
    if (file) {
      vscode.workspace.openTextDocument(getFileAbosolutePath(getFilePathFromTreeItem(file))).then((doc) => {
        vscode.window.showTextDocument(doc);
      });
    }
  });
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand('gitdiff-tag.clearCache', () => clearCache());
  context.subscriptions.push(disposable);

  // Command that opens the file in the diff view from the tree view
  disposable = vscode.commands.registerCommand('gitdiff-tag.openChanges', (file: string | GitDiffTreeItem) => {
    const fileFullPath = getFilePathFromTreeItem(file);
    const fileLabel = getFileLabelFromTreeItem(file);

    if (fileFullPath !== "") {
      downloadFileOfTag(fileFullPath).then((result) => {
        const tempFileUri = result ? result[0] as vscode.Uri : undefined;
        const tag = result ? result[1] as string : undefined;
        if (tempFileUri) {
          vscode.commands.executeCommand("vscode.diff",
            vscode.Uri.file(getFileAbosolutePath(fileFullPath)),
            tempFileUri,
            `${fileLabel} (Working Tree) ↔ ${fileLabel} (Tag: ${tag})`);
        }
      });
    }
  });
  context.subscriptions.push(disposable);

  // Register the tree view
  let treeDataProvider = new GitDiffTreeView(context);
  vscode.window.registerTreeDataProvider('gitdiff-tag', treeDataProvider);
  treeDataProvider.refreshData();

  // Command that refreshes the tree view
  disposable = vscode.commands.registerCommand('gitdiff-tag.refresh', () => {
    treeDataProvider.refreshData();
  });
  context.subscriptions.push(disposable);

  // Command that shows the users all the files that have been changed since the last tag
  disposable = vscode.commands.registerCommand('gitdiff-tag.listFiles', () => {
    getFiles().then((files: any) => {
      vscode.window.showQuickPick(files).then((file) => {
        if (file) {
          vscode.workspace.openTextDocument(getFileAbosolutePath(file)).then((doc) => {
            vscode.window.showTextDocument(doc);
          });
        }
      });
    });
  });
  context.subscriptions.push(disposable);


  disposable = vscode.commands.registerCommand('gitdiff-tag.toggleTree', () => {
    treeDataProvider.toggleTree();
  });
  context.subscriptions.push(disposable);

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      treeDataProvider.refreshData();
    }
  });
}

export function deactivate() { }
