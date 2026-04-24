// order in which releases are mentioned is required for knowing the base branch for another branch

export default {
    "releases": [

        // "16.9",
        // "16.10",
        "16.11",
        "16.12",
        "16.13",
    ],
    "projects": [
        {
            "name": "avni-server",
            "main-branch": "master"
        },
        {
            "name": "avni-client",
            "main-branch": "master"
        },
        {
            "name": "avni-webapp",
            "main-branch": "master"
        },
        {
            "name": "avni-etl",
            "main-branch": "main"
        },
        {
            "name": "avni-media",
            "main-branch": "main"
        },
        {
            "name": "avni-models",
            "main-branch": "master"
        },
        // {
        //     "name": "avni-health-modules",
        //     "main-branch": "master"
        // },
        // {
        //     "name": "rules-config",
        //     "main-branch": "master"
        // },
        {
            "name": "rules-server",
            "main-branch": "master"
        }
    ]
};
