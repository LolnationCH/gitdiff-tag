import * as cp from 'child_process';
import * as vscode from 'vscode';

import GitCommands from './utils/GitCommands';
import { getFlattenAndCheckIfFileExist } from './utils/git-utils';
import { getTagToUseFromConfiguration } from './utils/configuration-utils';

/**
 * This functions returns the tag to use. If the user has set a tag in the settings, it will be used.
 * Otherwise, the latest tag will be used.
 * @returns Promise<string> tag The tag to us
 */
export function getTag(): Promise<string> {
  const tagFromConfig = getTagToUseFromConfiguration();
  if (tagFromConfig) {
    return Promise.resolve(tagFromConfig as string);
  }

  return new Promise<string>((resolve, reject) => {
    cp.exec(GitCommands.getTagCommand().command, GitCommands.getTagCommand().options,
      (err, stdout, _) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout.replace('\r', '').replace('\n', ''));
        }
      });
  });
}

/**
 * This function returns the content of a file at a given tag.
 * @param tag The tag to use
 * @param fileName The file to get the content of
 * @returns The content of the file at the given tag
 */
export function getFileContentFromTag(tag: string, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(GitCommands.getFileContentFromTagCommand(tag, fileName).command, GitCommands.getGenericOptions(),
      (err, stdout, _) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
  });
}

/**
 * This function returns the list of files with changes.
 * @returns Promise<string[]> The list of files with changes
 */
function getDiffTrackedFiles(): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    getTag().then((tag) => {
      cp.exec(GitCommands.getDiffTrackedFilesCommand(tag).command, GitCommands.getGenericOptions(),
        (err, stdout, _) => {
          if (err) {
            vscode.window.showErrorMessage(err.message);
            reject([]);
          } else {
            resolve(stdout.split('\n').filter((file: string) => file));
          }
        });
    });
  });
}

/**
 * This function returns the list of untracked files.
 * @returns Promise<string[]> The list of untracked files
 */
function getUntrackedFiles(): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    cp.exec(GitCommands.getUntrackedFilesCommand().command, GitCommands.getGenericOptions(),
      (err, stdout, _) => {
        if (err) {
          vscode.window.showErrorMessage(err.message);
          reject([]);
        } else {
          resolve(stdout.split('\n').filter((file: string) => file));
        }
      });
  });
}

/**
 * This function returns the list of files with changes compared to the tag, includind untracked files.
 * @returns Promise<string[]> The list of files with changes compared to the tag (this includes untracked files)
 */
export function getFiles() {
  return Promise.all([getDiffTrackedFiles(), getUntrackedFiles()]).then((files) => getFlattenAndCheckIfFileExist(files));
}
