import simpleGit, {BranchSummary} from "simple-git";
import {AvniCodebase, Project} from "./AvniCodebase";
import _ from "lodash";
import {originBranch} from "./util";

export class GitRepository {
    static async branchExists(branch: string, project: Project) {
        const branches = await this.getRemoteBranches(project);
        return _.some(branches, (b: string) => {
            return `origin/${branch}` === b;
        });
    }

    static async getRemoteBranches(project: Project) {
        const git = simpleGit(`../${project.name}`);
        await git.fetch();
        const branches: BranchSummary = await git.branch(['-r']);
        return branches.all;
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
}
