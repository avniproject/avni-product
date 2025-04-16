import codeConfig from "./code";
import _ from "lodash";
import {Maybe} from "simple-git/dist/src/lib/types";

export interface Project {
    name: string;
    "main-branch": string;
}

export class AvniCodebase {
    static getProject(projectName: string): Maybe<Project> {
        return _.find(this.getProjects(), (project: Project) => project.name === projectName);
    }

    static getProjects(): Project[] {
        return codeConfig.projects;
    }

    static getReleases() {
        return codeConfig.releases;
    }

    static getBranchesWithAncestors(project: Project) {
        const branchNames = _.drop(this.getReleases());
        return [...branchNames, project["main-branch"]]
    }

    static getAncestorBranch(branch: string, project: Project): string {
        if (project["main-branch"] === branch) {
            return _.last(this.getReleases());
        }
        const index = _.indexOf(this.getReleases(), branch);
        if (index == 0) {
            throw new Error(`Ancestor branch does not exist for ${branch}`);
        }
        return this.getReleases()[index - 1];
    }

    static getDescendantBranch(branch: string, project: Project): string {
        if (_.last(this.getReleases()) === branch) {
            return project["main-branch"];
        }
        const index = _.indexOf(this.getReleases(), branch);
        return this.getReleases()[index + 1];
    }
}
