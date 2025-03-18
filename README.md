# Branch management
Independent set of makefile targets exist so that one can run whichever task is most suitable. It assumes that all the projects have been cloned in the same parent directory, i.e. sibling of this repository. The projects are mentioned in `src/code.ts` file. When a new minor or major branch is created the `code.ts` file should be updated. The order of release numbers is important.


## Important note

Ensure that the `src/code.ts` **"releases"** section is up to date to reflect only those branches which should be considered for release / merging.<br/>
**Remove any older invalid releases from there.**


Six makefile targets are available. Typically one may use them in this order.

### all-branches-exist
Check if all branches exist in the origin.

### create-remote-branches
Create remote branches if it does not exist in the origin, from ancestor one level at a time for a specific project.<br/>
Command Params: projectName=<project_name><br/>
Ex: projectName=avni-server

### has-local-changes
Check if you have any local changes. This is required if you want to create local branches, or otherwise.

### create-local-branches
Create local branches for all the projects, if it exists in the origin and not created locally

### branch-merge-test
It checks in origin branches if the immediate ancestor has been merged.

### auto-merge-branches
It auto merges ancestor branch into the descendant one level at a time for a specific project.<br/>
Command Params: projectName=<project_name><br/>
Ex: projectName=avni-server


