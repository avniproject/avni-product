export function originBranch(branch: string) {
    if (branch.startsWith('origin/')) {
        return branch;
    }
    return `origin/${branch}`;
}
