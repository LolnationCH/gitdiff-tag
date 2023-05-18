import { doesFileExist } from "./utils/path-utils";

export enum GitFileState {
  unmodified = "Unmodified",
  modified = "Modified",
  added = "Added",
  deleted = "Deleted",
  renamed = "Renamed",
  copied = "Copied",
  untracked = "Untracked",
  ignored = "Ignored",
  conflicted = "Conflicted"
}

export class GitFile {
  path: string;
  filename: string;
  exists: boolean;
  state: GitFileState;

  constructor(path: string, filename: string, exists: boolean, state: GitFileState) {
    this.path = path;
    this.filename = filename;
    this.exists = exists;
    this.state = state;
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
  return new GitFile(path, filename, exists, state);
}