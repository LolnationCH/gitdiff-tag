import { doesFileExist } from "./utils/path-utils";

export enum GitFileState {
  unmodified,
  modified,
  added,
  deleted,
  renamed,
  copied,
  untracked,
  ignored,
  conflicted,
  none
}

export class GitFile {
  path: string;
  filename: string;
  exists: boolean;
  state: GitFileState;
  isFolder: boolean;

  constructor(path: string, filename: string, exists: boolean, isFolder: boolean, state: GitFileState) {
    this.path = path;
    this.filename = filename;
    this.exists = exists;
    this.state = state;
    this.isFolder = isFolder;
  }

  public getLabel(): string {
    return `${this.getIcon()} ${this.filename}`;
  }

  private getIcon(): string {
    switch (this.state) {
      case GitFileState.modified:
        return "Ⓜ️";
      case GitFileState.added:
        return "✅";
      case GitFileState.deleted:
        return "❌";
      case GitFileState.renamed:
        return "🔄";
      case GitFileState.copied:
        return "📝";
      case GitFileState.untracked:
        return "❓";
      case GitFileState.ignored:
        return "🙈";
      case GitFileState.conflicted:
        return "💔";
      default:
        return "";
    }
  }
}

function getFileState(input: string): GitFileState {
  switch (input) {
    case "M":
      return GitFileState.modified;
    case "A":
      return GitFileState.added;
    case "D":
      return GitFileState.deleted;
    case "R":
      return GitFileState.renamed;
    case "C":
      return GitFileState.copied;
    case "U":
      return GitFileState.untracked;
    case "I":
      return GitFileState.ignored;
    case "?":
      return GitFileState.untracked;
    case "!":
      return GitFileState.ignored;
    case "X":
      return GitFileState.conflicted;
    default:
      return GitFileState.unmodified;
  }
}

export function getGitFile(input: string, stateInput: GitFileState | undefined = undefined): GitFile {
  var path = input;
  var state;
  if (stateInput !== undefined) {
    state = stateInput;
  }
  else {
    state = getFileState(input[0]);
    path = input.substring(1);
  }
  path = path.trim();
  var filename = path.split("/").pop();
  if (filename === undefined) {
    filename = path;
  }
  const exists = doesFileExist(path);
  const isFolder = !exists;
  return new GitFile(path, filename, exists, isFolder, state);
}