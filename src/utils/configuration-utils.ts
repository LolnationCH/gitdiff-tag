import * as vscode from 'vscode';

function getConfiguration(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration('gitdiff-tag');
}

/**
 * This function returns if we should use the preview when opening a file
 * @returns if we should use the preview when opening a file
 * @default true
 */
export function getUsePreviewWhenOpeningFileFromConfiguration(): boolean {
  return getConfiguration().get('usePreviewWhenOpeningFile', true);
}
/**
 * This function returns the tag to use from the configuration.
 * @returns The tag to use from the configuration
 * @default undefined
 */
export function getTagToUseFromConfiguration(): string | undefined {
  return getConfiguration().get('useTag');
}

export function getTreeShouldAlwaysAutoOpen(): vscode.TreeItemCollapsibleState {
  var value = getConfiguration().get('treeShouldAlwaysAutoOpen', true);
  return value ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
}

export function getShowStateIconInLabel(): boolean {
  return getConfiguration().get('showStateIconInLabel', true);
}