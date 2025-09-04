# Branch management
Independent set of makefile targets exist so that one can run whichever task is most suitable. It assumes that all the projects have been cloned in the same parent directory, i.e. sibling of this repository. The projects are mentioned in `src/code.ts` file. When a new minor or major branch is created the `code.ts` file should be updated. The order of release numbers is important.


## Important note

Ensure that the `src/code.ts` **"releases"** section is up to date to reflect only those branches which should be considered for release / merging.<br/>
**Remove any older invalid releases from there.**


## Available Makefile Commands

The following makefile targets are available. Typically, one would use them in the order presented below.

### help
Display all available make commands with their descriptions.
```
make help
```

### deps
Install npm dependencies required for the project.
```
make deps
```

### all-branches-exist
Check if all branches exist in the origin.
```
make all-branches-exist
```

### create-remote-branches
Create remote branches if they do not exist in the origin, from ancestor one level at a time for a specific project.
```
make create-remote-branches projectName=<project_name>
```
Example: `make create-remote-branches projectName=avni-server`

### create-all-remote-branches
Create remote branches if they do not exist in the origin, from ancestor one level at a time for all projects.
```
make create-all-remote-branches
```

### create-all-remote-branches-from-mainline
Create remote branches if they do not exist in the origin, from the mainline branch for all projects.
```
make create-all-remote-branches-from-mainline
```

### has-local-changes
Check if you have any local uncommitted or unpushed changes. This is required if you want to create local branches, or otherwise.
```
make has-local-changes
```

### create-local-branches
Create local branches for all the projects, if they exist in the origin and are not created locally.
```
make create-local-branches
```

### branch-merge-test
Check in origin branches if the immediate ancestor has been merged.
```
make branch-merge-test
```

### merge-branches
Merge ancestor branch into the descendant one level at a time for a specific project.
```
make merge-branches projectName=<project_name>
```
Example: `make merge-branches projectName=avni-server`

### tag-all-repos-with-release-version
Tag all repositories with a release version.
```
make tag-all-repos-with-release-version releaseBranch=<branch> releaseTag=<tag>
```
Example: `make tag-all-repos-with-release-version releaseBranch=13.0 releaseTag=v13.0.0`

### check-commits
Check commit count between two branches or tags across all repositories.
```
make check-commits fromBranch=<from_branch> toBranch=<to_branch>
```
Example: `make check-commits fromBranch=14.2 toBranch=14.3`

During Auto-merge, if there are merge conflicts, then the response would contain information about files that are pending merge and a message asking for merge conflict resolution. At this point, pause the auto-merge operation by not moving to the next release version merge.
Switch to the repository being merged and resolve the merge-conflicts and push them to origin.
Then resume the auto-merge by inputing "Yes(y)" or otherwise to instruct next release merge action.


