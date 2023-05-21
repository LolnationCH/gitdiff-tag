import { MarkdownString } from "vscode";
import { doesFileExist, isFile } from "./utils/path-utils";
import { getShowStateIconInLabel } from "./utils/configuration-utils";

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

const colorGitFileState = {
  [GitFileState.unmodified]: "#999",
  [GitFileState.modified]: "#5394c3",
  [GitFileState.added]: "#32b16d",
  [GitFileState.deleted]: "#eb664e",
  [GitFileState.renamed]: "#000",
  [GitFileState.copied]: "#000",
  [GitFileState.untracked]: "#32b16d",
  [GitFileState.ignored]: "#000",
  [GitFileState.conflicted]: "#000",
  [GitFileState.none]: "#000"
};

const emojiGitFileState = {
  [GitFileState.unmodified]: "📄 ",
  [GitFileState.modified]: "Ⓜ️ ",
  [GitFileState.added]: "✅ ",
  [GitFileState.deleted]: "❌ ",
  [GitFileState.renamed]: "🔄 ",
  [GitFileState.copied]: "📝 ",
  [GitFileState.untracked]: "❓ ",
  [GitFileState.ignored]: "🙈 ",
  [GitFileState.conflicted]: "💔 ",
  [GitFileState.none]: ""
};

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
    return `${this.getIcon()}${this.filename}`;
  }

  public getToolTip(): MarkdownString {
    const status = GitFileState[this.state][0].toUpperCase();
    const color = colorGitFileState[this.state];

    var mark = new MarkdownString(`**${this.path}** - ${this.getColoredState()}`);
    mark.isTrusted = true;
    return mark;
  }

  private getColoredState(): string {
    const status = GitFileState[this.state];
    const color = colorGitFileState[this.state];
    return `**<span style="color:${color};">${status}</span>**`;
  }

  private getIcon(): string {
    if (getShowStateIconInLabel() === false) { return ""; }

    return `${emojiGitFileState[this.state]}`;
  }

  public getContext(): string {
    if (this.isFolder) { return "folder"; }
    switch (this.state) {
      case GitFileState.deleted:
        return "file_deleted";
      case GitFileState.untracked:
      case GitFileState.added:
        return "file_added";
      default:
        return "file";
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
  const isFolder = !isFile(path);
  return new GitFile(path, filename, exists, isFolder, state);
}