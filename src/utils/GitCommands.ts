import * as cp from 'child_process';
import { getRootPath } from './path-utils';

interface GitCommand {
  command: string;
  options: cp.ExecOptions;
}

export default abstract class GitCommands {
  static getTagCommand(): GitCommand {
    return {
      command: `git describe --abbrev=0 --tags`,
      options: { cwd: getRootPath() },
    };
  }

  static getDiffTrackedFilesCommand(tag: string): GitCommand {
    return {
      command: `git diff --name-status ${tag}`,
      options: { cwd: getRootPath() },
    };
  }

  static getUntrackedFilesCommand(): GitCommand {
    return {
      command: `git ls-files --others --exclude-standard`,
      options: { cwd: getRootPath() },
    };
  }

  static getFileContentFromTagCommand(tag: string, file: string): GitCommand {
    return {
      command: `git show ${tag}:${file}`,
      options: { cwd: getRootPath() },
    };
  }

  static getGenericOptions(): cp.ExecOptions {
    return { cwd: getRootPath() };
  }
}