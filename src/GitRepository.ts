import simpleGit, {BranchSummary} from "simple-git";
import {AvniCodebase, Project} from "./AvniCodebase";
import _ from "lodash";
import {originBranch} from "./util";

export class GitRepository {
    static async hasUnpushedCommits(project: Project) {
        // Fetch latest remote info
        const git = simpleGit(`../${project.name}`);
        await git.fetch();

        // Get list of unpushed commits
        // Get the name of the current branch
        const status = await git.status();
        const branch = status.current;

        // Get the list of commits present locally but not on remote
        const unpushedCommits = await git.log([`origin/${branch}..${branch}`]);

        // If there are any unpushed commits, the array will not be empty
        return unpushedCommits.total > 0;
    }

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

    static async getClosestDescendantBranch(branch: string, project: Project): Promise<string> {
        const descendantBranch = AvniCodebase.getDescendantBranch(branch, project);
        if (await this.branchExists(descendantBranch, project)) {
            return descendantBranch;
        } else if (descendantBranch) {
            return await this.getClosestDescendantBranch(descendantBranch, project);
        }
        throw new Error(`No descendant branch found for ${branch} and project ${project.name}`);
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

    static async createBranch(fromBranch: string, toBranch: string, project: Project) {
        const git = simpleGit(`../${project.name}`);
        await git.checkout([ fromBranch]);
        await git.pull();
        await git.branch([toBranch]);
        await git.push(['--set-upstream', 'origin', toBranch]);
    }

    static async mergeAncestorIntoDescendant(ancestor: string, descendant: string, project: Project) {
        try {
            const git = simpleGit(`../${project.name}`);
            // Checkout to child-branch
            console.log(`Checking out to branch ${ancestor}`);
            await git.checkout(ancestor);

            // Pull the latest changes from child-branch
            console.log(`Pulling changes from branch ${ancestor}`);
            await git.pull();

            // Checkout to parent-branch
            console.log(`Checking out to branch ${descendant}`);
            await git.checkout(descendant);

            // Pull the latest changes from parent-branch
            console.log(`Pulling changes from branch ${descendant}`);
            await git.pull();

            // Merge child-branch into parent-branch
            console.log(`Merging ${ancestor} branch into ${descendant}`);
            await git.merge([ancestor]);

            // Push changes to origin parent-branch
            console.log(`Pushing changes to origin ${descendant}`);
            await git.push('origin', descendant);

            // Check the status
            console.log(`Checking Git status...`);
            const status = await git.status();
            console.log(status);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
}
