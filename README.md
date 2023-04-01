# GitDiff - Difference from last tag

This extension adds a new view to see all the files that have difference compared to the last tag.

This is useful to see what files have changed since the last release.

## Features

* View all the files that have difference compared to the last tag.
  * The panel is located in the view SCM (Source Control Management) and is called "GitDiff - Diff from Tag".
    * The panel is updated automatically when you change the focus to another file.
    * The panel can be move to the secondary side bar.
  * The panel can switch from list view to tree view.
* Command to quickly open a file modified.
  * The command is called "GitDiff-tag: List Files changed since last tag", from the command palette.

* In the panel, you can click on a file to open it.
  * You can also right-click to open the context menu to access the command "Open File".
  * You can also right-click to open the context menu to access the command "Open Changes", to open the diff comparing the current file and the tag file.
  * You can also right-click to open the context menu to access the command "View file at tag state", to view the file at the state of the tag.


## Requirements

* Git must be installed.
* The repository must be a Git repository.
