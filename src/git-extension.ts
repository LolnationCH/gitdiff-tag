import * as cp from 'child_process';
import path = require('path');
import { getRootPath } from './utils';

function getTag() {
  return new Promise<string>((resolve, reject) => {
    cp.exec(`git describe --abbrev=0 --tags`, { cwd: getRootPath() }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

function getDiffTrackedFiles() {
  return new Promise((resolve, reject) => {
    getTag().then((tag) => {
      cp.exec(`git diff --name-only ${tag}`, { cwd: getRootPath() }, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout.split('\n').filter((file: string) => file));
        }
      });
    });
  });
}

function getUntrackedFiles() {
  return new Promise((resolve, reject) => {
    cp.exec(`git ls-files --others --exclude-standard`, { cwd: getRootPath() }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.split('\n').filter((file: string) => file));
      }
    });
  });
}

export function getFiles() {
  return Promise.all([getDiffTrackedFiles(), getUntrackedFiles()]).then((files: any) => {
    let totalFiles = files[0].concat(files[1]);
    totalFiles = totalFiles.filter((file: string) => {
      try {
        return require('fs').existsSync(path.join(getRootPath(), file));
      } catch (e) {
        return false;
      }
    });
    return totalFiles;
  });
}