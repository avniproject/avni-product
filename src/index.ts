import {AvniCodebase, Project} from "./AvniCodebase";
import _ from "lodash";
import {GitRepository} from "./GitRepository";

async function allBranchesExist() {
    const projects = AvniCodebase.getProjects();
    const releases = AvniCodebase.getReleases();
    for (const project of projects) {
        const branches = await GitRepository.getRemoteBranches(project)

        for (const release of releases) {
            const exists = _.some(branches, (branch: string) => {
                return `origin/${release}` === branch;
            });
            if (!exists) {
                console.log('Remote branch missing in ', project.name, release);
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

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askUser(query: string) {
    return new Promise(resolve => {
        readline.question(query, (response: string) => {
            resolve(response.toLowerCase() === 'yes' || response.toLowerCase() === 'y');
        });
    });
}

async function createRemoteBranches(specificProject: string = null, createFromMainline: boolean = false) {
    const projects = AvniCodebase.getProjects();
    const releases = AvniCodebase.getReleases();
    for (const project of projects) {
        try {
            if (specificProject && project.name !== specificProject) {
                continue;
            }
            console.log(`Starting creation of Remote Branches for project ${project.name}`);
            const branches = await GitRepository.getRemoteBranches(project)
            for (const release of releases) {
                const exists = _.some(branches, (branch: string) => {
                    return `origin/${release}` === branch;
                });
                if (!exists) {
                    try {
                        console.log(`Remote Branch ${release} does not exist in ${project.name}.`);
                        const sourceBranch = createFromMainline ? project["main-branch"] : AvniCodebase.getAncestorBranch(release, project);
                        const query = `Do you want to create Remote Branch ${release} from parent branch "${sourceBranch}" in origin? (yes/y to proceed): `;
                        const response = await askUser(query);

                        if (response) {
                            console.log(`Creating branch ${release} in project ${project.name} from parent branch "${sourceBranch}"`);
                            // Fetch the latest changes from the remote
                            await GitRepository.createBranch(sourceBranch, release, project)
                            console.log(`Branch ${release} created and pushed to ${project.name}.`);
                            console.log();
                        }
                    } catch (error) {
                        console.error('Error creating or pushing branch:', error);
                        throw error;
                    }
                } else {
                    console.log(`Remote Branch ${release} already exists in ${project.name}.`);
                }
            }
        } catch (error) {
            console.log(`Not proceeding further for this project ${project.name}`);
        }
    }
}

async function autoMergeBranches(specificProject: string) {
    const projects = AvniCodebase.getProjects();
    const releases = AvniCodebase.getReleases();
    for (const project of projects) {
        try {
            if (specificProject && project.name !== specificProject) {
                continue;
            }
            console.log(`Starting auto-merge of Branches for project ${project.name}`);
            for (const ancestor of releases) {
                try {
                    const descendant = await GitRepository.getClosestDescendantBranch(ancestor, project);
                    const query = `Do you want to merge ${ancestor} branch into "${descendant}" in origin? (yes/y to proceed): `;
                    const response = await askUser(query);
                    if (response) {
                        console.log(`Merging branch "${ancestor}" into "${descendant}"  in project  ${project.name}`);

                        // Fetch the latest changes from the remote
                        await GitRepository.mergeAncestorIntoDescendant(ancestor, descendant, project)
                        console.log(`Branch ${ancestor} merged into "${descendant}" and pushed to ${project.name}.`);
                    }
                } catch (error) {
                    console.error('Error merging branch:', error);
                    throw error;
                }
            }
        } catch (error) {
            console.log(`Not proceeding further for this project ${project.name}`);
        }
    }
}

async function hasUnpushedChanges() {
    const projects = AvniCodebase.getProjects();
    for (const project of projects) {
        if (await GitRepository.hasUnpushedCommits(project)) {
            console.warn('[WARN] Project has unpushed commits: ', project.name);
        } else {
            console.info('Project has no unpushed commits: ', project.name);
        }
    }
}

async function tagAllReposWithReleaseVersion(releaseBranch: string, releaseTag: string) {
    if (!releaseBranch) {
        console.error('Release branch is required');
        process.exit(1);
    }   
    if (!releaseTag) {
        console.error('Release tag is required');
        process.exit(1);
    }
    
    console.log(`Starting to tag all repositories with ${releaseTag} from branch ${releaseBranch || 'main'}`);
    
    const projects = AvniCodebase.getProjects();
    // Filter out ignored repositories
    const ignoredRepos = ['avni-models', 'avni-health-modules', 'rules-config'];
    const filteredProjects = projects.filter(project => !ignoredRepos.includes(project.name));
    console.log(`Ignoring repositories: ${ignoredRepos.join(', ')}`);

    const results = [];
    
    for (const project of filteredProjects) {
        console.log(`\n\nProcessing project: ${project.name}`);
        try {
            const success = await GitRepository.tagRepository(project, releaseTag, releaseBranch);
            results.push({ project: project.name, success });
        } catch (error) {
            console.error(`Error processing project ${project.name}:`, error);
            results.push({ project: project.name, success: false, error: error instanceof Error ? error.message : String(error) });
        }
    }
    
    console.log('\n\n===== Tagging Summary =====');
    let successCount = 0;
    let failureCount = 0;
    
    for (const result of results) {
        if (result.success) {
            console.log(`✅ ${result.project}: Successfully tagged`);
            successCount++;
        } else {
            console.error(`❌ ${result.project}: Failed to tag${result.error ? ` - ${result.error}` : ''}`);
            failureCount++;
        }
    }
    
    console.log(`\nTotal: ${results.length}, Success: ${successCount}, Failed: ${failureCount}`);
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('No command provided.');
        process.exit(1);
    }

    const command = args[0];
    const specificProject = args.length > 1 ? args[1] : null;
    const releaseBranch = args.length > 2 ? args[2] : null;
    const releaseTag = args.length > 3 ? args[3] : null;

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
            await hasUnpushedChanges();
            break;
        case 'createRemoteBranches':
            await createRemoteBranches(specificProject);
            break;
        case 'createAllRemoteBranchesFromMainline':
            await createRemoteBranches(null, true);
            break;
        case 'autoMergeBranches':
            await autoMergeBranches(specificProject);
            break;
        case 'tag-all-repos-with-release-version':
            await tagAllReposWithReleaseVersion(releaseBranch, releaseTag);
            break;
        default:
            console.error(`Unknown command: ${command}`);
            process.exit(1);
    }
}

main().then(() => {
    console.log('done');
    process.exit(0);
});
