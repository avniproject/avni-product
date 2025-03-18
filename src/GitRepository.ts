import simpleGit, {BranchSummary} from "simple-git";
import {AvniCodebase, Project} from "./AvniCodebase";
import _ from "lodash";
import {originBranch} from "./util";

export class GitRepository {
    static async branchExists(branch: string, project: Project) {
        const branches = await this.getRemoteBranches(project);
        return _.some(branches, (b: string) => {
            return originBranch(branch) === b;
        });
    }

    static async getRemoteBranches(project: Project) {
        const git = simpleGit(`../${project.name}`);
        await git.fetch();
        const branches: BranchSummary = await git.branch(['-r']);
        return branches.all;
    }

    static async getLocalBranches(project: Project): Promise<string[]> {
        const git = simpleGit(`../${project.name}`);
        const branchSummary = await git.branchLocal();
        return branchSummary.all;
    }

    static async getClosestAncestorBranch(branch: string, project: Project): Promise<string> {
        const ancestorBranch = AvniCodebase.getAncestorBranch(branch, project);
        if (await this.branchExists(ancestorBranch, project)) {
            return ancestorBranch;
        } else if (ancestorBranch) {
            return await this.getClosestAncestorBranch(ancestorBranch, project);
        }
        throw new Error(`No ancestor branch found for ${branch} and project ${project.name}`);
    }

    static async isBranchMerged(currentBranch: string, targetBranch: string, project: Project) {
        try {
            const git = simpleGit(`../${project.name}`);
            const mergeBase = await git.raw(['merge-base', originBranch(currentBranch), originBranch(targetBranch)]);
            const targetBranchCommit = await git.raw(['rev-parse', originBranch(targetBranch)]);
            return mergeBase.trim() === targetBranchCommit.trim();
        } catch (error) {
            console.error('Error checking branch merge status:', error);
            return false;
        }
    }

    static async createLocalBranch(branch: string, project: Project) {
        const git = simpleGit(`../${project.name}`);
        await git.checkout(['-b', branch, originBranch(branch)]);
    }

    static async hasLocalChanges(project: Project) {
        const git = simpleGit(`../${project.name}`);
        const status = await git.status();
        if (status.modified.length > 0 || status.not_added.length > 0) {
            return true;
        }

        // unstaged changes
        const diff = await git.diff();
        return !!diff;
    }

    static async createBranchFromNearestAncestor(nearestAncestor: string,branch: string, project: Project) {
        const git = simpleGit(`../${project.name}`);
        await git.checkout([ nearestAncestor]);
        await git.pull();
        await git.branch([branch]);
        await git.push(['--set-upstream', 'origin', branch]);
    }
}
