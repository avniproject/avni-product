import {AvniCodebase} from "../src/AvniCodebase";
import _ from "lodash";

it('should get ancestor branch', function () {
    const project = {name: "avni-server", "main-branch": "master"};
    expect(AvniCodebase.getAncestorBranch("12.1", project)).toBe("12.0");
    expect(AvniCodebase.getAncestorBranch("12.2", project)).toBe("12.1");
    expect(AvniCodebase.getAncestorBranch("master", project)).toBe(_.last(AvniCodebase.getReleases()));
});


it('should get ancestor branch', function () {
    const project = {name: "rules-config", "main-branch": "master"};
    expect(AvniCodebase.getAncestorBranch("12.0", project)).toBe("master");
    expect(AvniCodebase.getAncestorBranch("12.1", project)).toBe("12.0");
    expect(AvniCodebase.getAncestorBranch("12.2", project)).toBe("12.1");
    expect(AvniCodebase.getAncestorBranch("master", project)).toBe(_.last(AvniCodebase.getReleases()));
});