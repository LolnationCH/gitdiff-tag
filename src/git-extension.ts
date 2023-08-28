import * as cp from 'child_process';
import * as vscode from 'vscode';

import GitCommands from './utils/GitCommands';
import { getTagToUseFromConfiguration } from './utils/configuration-utils';

import { GitFile, GitFileState, getGitFile } from './GitFile';

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

export function launchDiffToolCommand(tag: string, fileName: string) {
  cp.exec(GitCommands.launchDiffToolCommand(tag, fileName).command, GitCommands.getGenericOptions());
}

function getDiffTrackedFiles(): Promise<GitFile[]> {
  return new Promise<GitFile[]>((resolve, reject) => {
    getTag().then((tag) => {
      cp.exec(GitCommands.getDiffTrackedFilesCommand(tag).command, GitCommands.getGenericOptions(),
        (err, stdout, _) => {
          if (err) {
            vscode.window.showErrorMessage(err.message);
            reject([]);
          } else {
            resolve(stdout.split('\n').filter((file: string) => file)
              .map((file: string) => getGitFile(file)));
          }
        });
    });
  });
}


function getUntrackedFiles(): Promise<GitFile[]> {
  return new Promise<GitFile[]>((resolve, reject) => {
    cp.exec(GitCommands.getUntrackedFilesCommand().command, GitCommands.getGenericOptions(),
      (err, stdout, _) => {
        if (err) {
          vscode.window.showErrorMessage(err.message);
          reject([]);
        } else {
          resolve(stdout.split('\n').filter((file: string) => file)
            .map((file: string) => getGitFile(file, GitFileState.added)));
        }
      });
  });
}

function getFlatten(filesArray: GitFile[][]) {
  var flatten = ([] as GitFile[]).concat(...filesArray);
  // Sort by state, then by path
  flatten.sort((a, b) => {
    if (a.state === b.state) {
      return a.path.localeCompare(b.path);
    }
    return a.state - b.state;
  });
  return flatten;
}

export function getFiles(): Promise<GitFile[]> {
  return Promise.all([getDiffTrackedFiles(), getUntrackedFiles()]).then((files) => getFlatten(files));
}
