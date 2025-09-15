help:
	@IFS=$$'\n' ; \
	help_lines=(`fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//'`); \
	for help_line in $${help_lines[@]}; do \
	    IFS=$$'#' ; \
	    help_split=($$help_line) ; \
	    help_command=`echo $${help_split[0]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
	    help_info=`echo $${help_split[2]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
	    printf "%-30s %s\n" $$help_command $$help_info ; \
	done

deps: ## install npm dependencies
	npm install

branch-merge-test: ## checks in origin branches if the immediate ancestor has been merged
	npx ts-node src/index.ts areAllBranchesMerged

all-branches-exist: ## Check if all branches exist in the origin.
	npx ts-node src/index.ts allBranchesExist

create-local-branches: ## Create local branches for all the projects, if it exists in the origin and not created locally
	npx ts-node src/index.ts createLocalBranches

has-local-changes: ## Check if you have any local uncommited or unpushed changes
	npx ts-node src/index.ts hasLocalChanges

create-remote-branches: ## Create remote branches if it does not exist in the origin
ifndef projectName
	@echo "Please provide project name \"projectName\""
	exit 1
else
	npx ts-node src/index.ts createRemoteBranches $(projectName)
endif

create-all-remote-branches: ## Create remote branches if it does not exist in the origin, from ancestor one level at a time for all projects
	npx ts-node src/index.ts createAllRemoteBranches

create-all-remote-branches-from-mainline: ## Create remote branches if it does not exist in the origin, from mainline for all projects
	npx ts-node src/index.ts createAllRemoteBranchesFromMainline

merge-branches: ## merge branches with their immediate ancestor
ifndef projectName
	@echo "Please provide project name \"projectName\""
	exit 1
else
	npx ts-node src/index.ts autoMergeBranches $(projectName)
endif

tag-all-repos-with-release-version: ## tag all repositories with a release version (e.g. make tag-all-repos-with-release-version releaseBranch=13.0 releaseTag=v13.0.0)
ifndef releaseBranch
	@echo "Please provide release branch \"releaseBranch\""
	exit 1
else ifndef releaseTag
	@echo "Please provide release tag \"releaseTag\""
	exit 1
else
	npx ts-node src/index.ts tag-all-repos-with-release-version "" "$(releaseBranch)" "$(releaseTag)"
endif

check-commits: ## check commit count between two branches or tags (e.g. make check-commits fromBranch=main toBranch=feature-branch)
ifndef fromBranch
	@echo "Please provide from branch \"fromBranch\""
	exit 1
else ifndef toBranch
	@echo "Please provide to branch \"toBranch\""
	exit 1
else
	npx ts-node src/index.ts checkCommits $(fromBranch) $(toBranch)
endif
