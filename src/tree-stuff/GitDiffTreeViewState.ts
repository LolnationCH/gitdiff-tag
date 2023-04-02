import * as vscode from 'vscode';

/**
 * This class is used to store the state of the tree view.
 * @class
 * @function isTreeView - Get/Set if the tree view is enabled or not.
 * @function files - Get/Set the list of files that the tree view should use.
 */
export default class GitDiffTreeViewState {
  private _isTreeView: boolean;
  private _files: Array<string> = [];
  private _context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
    this._isTreeView = this._context.workspaceState.get('isTreeView', false);
  }

  set isTreeView(value: boolean) {
    this._isTreeView = value;
    this._context.workspaceState.update('isTreeView', value);
  }

  get isTreeView(): boolean {
    return this._isTreeView;
  }

  get files(): Array<string> {
    return this._files;
  }

  set files(value: Array<string>) {
    this._files = value;
  }
}