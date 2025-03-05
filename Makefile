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

branch-merge-test:
	npx ts-node src/index.ts
