import codeConfig from "./code";

export class AvniCodebase {
    static getProjects() {
        return codeConfig.projects;
    }

    static getReleases() {
        return codeConfig.releases;
    }
}
