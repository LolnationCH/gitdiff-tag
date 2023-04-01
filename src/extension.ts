import * as vscode from 'vscode';
import * as commands from './commands';
import GitDiffTreeView from './gitDiffTreeView';

export function activate(context: vscode.ExtensionContext) {
  // Register the tree view
  let treeDataProvider = new GitDiffTreeView(context);
  vscode.window.registerTreeDataProvider('gitdiff-tag', treeDataProvider);
  treeDataProvider.refreshData();

  // Commands registering
  {
    // Command that opens the file in the editor from the tree view
    let disposable = vscode.commands.registerCommand('gitdiff-tag.openFile', (file) => commands.openFile(file));
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('gitdiff-tag.clearCache', () => commands.clearCache());
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('gitdiff-tag.viewTagFile', (file) => commands.openCacheFile(file));
    context.subscriptions.push(disposable);

    // Command that opens the file in the diff view from the tree view
    disposable = vscode.commands.registerCommand('gitdiff-tag.openChanges', file => commands.openChanges(file));
    context.subscriptions.push(disposable);

    // Command that refreshes the tree view
    disposable = vscode.commands.registerCommand('gitdiff-tag.refresh', () => treeDataProvider.refreshData());
    context.subscriptions.push(disposable);

    // Command that shows the users all the files that have been changed since the last tag
    disposable = vscode.commands.registerCommand('gitdiff-tag.listFiles', () => commands.listFiles());
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('gitdiff-tag.toggleTree', () => treeDataProvider.toggleTree());
    context.subscriptions.push(disposable);
  }

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      treeDataProvider.refreshData();
    }
  });
}

export function deactivate() { }
