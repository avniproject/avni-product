labelName:= "On+Hold"
githubAPI:= https://api.github.com/repos/avniproject
color:= $(if $(color),$(color),1d76db)

label = \
    curl -X DELETE $(githubAPI)/$(1)/labels/$(labelName) \
    -H "Authorization: token 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" \

create_release_label:
ifndef labelName
	@echo "Please provide label name"
	exit 1
else
	make create_label token=$(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) labelName=$(labelName) color=$(color)
endif

delete_label:
	$(call label,avni-product)
	$(call label,avni-client)
	$(call label,avni-server)
	$(call label,avni-webapp)
	$(call label,rules-config)
	$(call label,avni-models)
	$(call label,rules-server)
	$(call label,avni-canned-reports)

deps:
	npm install

branch-merge-test:
	npx ts-node src/index.ts areAllBranchesMerged

all-branches-exist:
	npx ts-node src/index.ts allBranchesExist

create-local-branches:
	npx ts-node src/index.ts createLocalBranches

has-local-changes:
	npx ts-node src/index.ts hasLocalChanges

create-remote-branches:
ifndef projectName
	@echo "Please provide project name \"projectName\""
	exit 1
else
	npx ts-node src/index.ts createRemoteBranches $(projectName)
endif

create-all-remote-branches-from-mainline:
	npx ts-node src/index.ts createAllRemoteBranchesFromMainline

auto-merge-branches:
ifndef projectName
	@echo "Please provide project name \"projectName\""
	exit 1
else
	npx ts-node src/index.ts autoMergeBranches $(projectName)
endif
