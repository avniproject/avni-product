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

async function isBranchMerged(currentBranch: string, targetBranch: string, project: Project) {
    try {
        const git = simpleGit(`../${project.name}`);
        const mergeBase = await git.raw(['merge-base', currentBranch, targetBranch]);
        const targetBranchCommit = await git.raw(['rev-parse', targetBranch]);
        return mergeBase.trim() === targetBranchCommit.trim();
    } catch (error) {
        console.error('Error checking branch merge status:', error);
        return false;
    }
}

async function areAllBranchesMerged() {
    const projects = AvniCodebase.getProjects();
    for (const project of projects) {
        console.log('\n\nChecking project:', project.name);
        const branchesWithAncestors = AvniCodebase.getBranchesWithAncestors(project);
        for (const branch of branchesWithAncestors) {
            console.log('Checking branch:', branch);
            const branchExists = await GitRepository.branchExists(branch, project);
            if (!branchExists) {
                console.warn(`[WARN] Branch not found:`, branch);
                continue;
            }
            const ancestorBranch = await GitRepository.getClosestAncestorBranch(branch, project);
            console.info("Checking against nearest ancestor:", ancestorBranch);
            if (ancestorBranch) {
                const isMerged = await isBranchMerged(branch, ancestorBranch, project)
                if (isMerged) {
                    console.info('Branch merged:', project.name, branch, ancestorBranch);
                } else {
                    console.error('[ERROR] Branch not merged:', project.name, branch, ancestorBranch);
                }
            }
        }
    }
}

// allBranchesExist().then(() => console.log('done'));
areAllBranchesMerged().then(() => console.log('done'));
