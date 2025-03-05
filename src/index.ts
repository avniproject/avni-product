import {BranchSummary} from "simple-git";
import {AvniCodebase} from "./AvniCodebase";
import _ from "lodash";

const simpleGit = require("simple-git");

async function allBranchesExist() {
    const projects = AvniCodebase.getProjects();
    const releases = AvniCodebase.getReleases();
    for (const project of projects) {
        const git = simpleGit(`../${project.name}`);
        await git.fetch();
        const branches: BranchSummary = await git.branch(['-r']);

        for (const release of releases) {
            const exists = _.some(branches.all, (branch: string) => {
                return `origin/${release}` === branch;
            });
            if (!exists) {
                console.log('Release branch missing in ', project.name, release);
            }
        }

        // await checkBranch(project.name, project['main-branch']);
    }
}

allBranchesExist().then(() => console.log('done'));
