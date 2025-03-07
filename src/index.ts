import {AvniCodebase, Project} from "./AvniCodebase";
import _ from "lodash";
import {GitRepository} from "./GitRepository";

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
                console.log('Remove branch missing in ', project.name, release);
            }
        }
    }
}

async function areAllBranchesMerged() {
    const projects = AvniCodebase.getProjects();
    for (const project of projects) {
        console.log('\n\n\nChecking project:', project.name);
        const branchesWithAncestors = AvniCodebase.getBranchesWithAncestors(project);
        try {
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
                        console.info('[SUCCESS] Branch is already merged:', project.name, branch, ancestorBranch);
                    } else {
                        console.error('[ERROR] Branch is not merged:', project.name, branch, ancestorBranch);
                    }
                }
            }
        } catch (e: any) {
            console.error(`[ERROR] Project ${project.name} has no branch for last major release`, project.name, e.message);
        }
    }
}

async function createLocalBranches() {
    const projects = AvniCodebase.getProjects();
    for (const project of projects) {
        console.log('\n\n\nChecking project:', project.name);
        const branchesWithAncestors = AvniCodebase.getBranchesWithAncestors(project);
        const localBranches = await GitRepository.getLocalBranches(project);
        for (const branch of branchesWithAncestors) {
            if (await GitRepository.branchExists(branch, project) && !localBranches.includes(branch)) {
                console.info('Creating local branch:', branch);
                await GitRepository.createLocalBranch(branch, project);
            }
        }
    }
}

async function hasLocalChanges() {
    const projects = AvniCodebase.getProjects();
    for (const project of projects) {
        if (await GitRepository.hasLocalChanges(project)) {
            console.warn('[WARN] Project has local changes:', project.name);
        } else {
            console.info('Project has no local changes:', project.name);
        }
    }
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('No command provided.');
        process.exit(1);
    }

    const command = args[0];

    switch (command) {
        case 'allBranchesExist':
            await allBranchesExist();
            break;
        case 'areAllBranchesMerged':
            await areAllBranchesMerged();
            break;
        case 'createLocalBranches':
            await createLocalBranches();
            break;
        case 'hasLocalChanges':
            await hasLocalChanges();
            break;
        default:
            console.error(`Unknown command: ${command}`);
            process.exit(1);
    }
}

main().then(() => console.log('done'));
