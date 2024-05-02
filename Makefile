# Delete Label Makefile

# Default labelName
labelName := "On+Hold"
# GitHub API endpoint
githubAPI := https://api.github.com/repos/avniproject
# Default color for the label
color := $(if $(color),$(color),1d76db)
# GitHub token
token := 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

# Function to delete label
define label
	curl -X DELETE $(githubAPI)/$(1)/labels/$(labelName) \
	-H "Authorization: token $(token)"
endef

# Target to create a release label
create_release_label:
ifndef labelName
	@echo "Please provide label name"
	exit 1
else
	make create_label token=$(token) labelName=$(labelName) color=$(color)
endif

# Target to delete labels
delete_label:
	$(call label,avni-product)
	$(call label,avni-client)
	$(call label,avni-server)
	$(call label,avni-webapp)
	$(call label,rules-config)
	$(call label,avni-models)
	$(call label,rules-server)
	$(call label,avni-canned-reports)
