import {AvniCodebase, Project} from "./AvniCodebase";
import _ from "lodash";
import {GitRepository} from "./GitRepository";

const simpleGit = require("simple-git");

async function allBranchesExist() {
    const projects = AvniCodebase.getProjects();
    const releases = AvniCodebase.getReleases();
    for (const project of projects) {
        const branches = GitRepository.getRemoteBranches(project)

        for (const release of releases) {
            const exists = _.some(branches, (branch: string) => {
                return `origin/${release}` === branch;
            });
            if (!exists) {
                console.log('Release branch missing in ', project.name, release);
            }
        }

        // await checkBranch(project.name, project['main-branch']);
    }
}

async function areAllBranchesMerged() {
    const projects = AvniCodebase.getProjects();
    for (const project of projects) {
        try {
            console.log('\n\n\nChecking project:', project.name);
            const branchesWithAncestors = AvniCodebase.getBranchesWithAncestors(project);
            for (const branch of branchesWithAncestors) {
                console.log('\nChecking merge status for branch:', branch);
                const branchExists = await GitRepository.branchExists(branch, project);
                if (!branchExists) {
                    console.warn(`[WARN] Branch not found:`, branch);
                    continue;
                }
                const ancestorBranch = await GitRepository.getClosestAncestorBranch(branch, project);
                console.info("Checking against nearest ancestor:", ancestorBranch);
                if (ancestorBranch) {
                    const isMerged = await GitRepository.isBranchMerged(branch, ancestorBranch, project);
                    if (isMerged) {
                        console.info('[SUCCESS] Branch merged:', project.name, branch, ancestorBranch);
                    } else {
                        console.error('[ERROR] Branch not merged:', project.name, branch, ancestorBranch);
                    }
                }
            }
        } catch (e: any) {
            console.error(`[ERROR] Project ${project.name} has no branch for last major release`, project.name, e.message);
        }
    }
}

// allBranchesExist().then(() => console.log('done'));
areAllBranchesMerged().then(() => console.log('done'));
