// order in which releases are mentioned is required for knowing the base branch for another branch

export default {
    "releases": [
        "18.0",
        "18.1",
        "18.1.1",
        "18.2",
        "18.3"
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
