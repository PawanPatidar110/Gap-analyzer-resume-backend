import { Injectable } from "@nestjs/common";
import { extractSkills } from "./skill-analyzer";
import * as fs from "fs";
import * as path from "path";
import { calculateSimilarity } from "./ml-similarity";

export interface JobRole {
  role: string;
  required_skills: string[];
  optional_skills: string[];
  tools: string[];
}

const datasetPath = path.join(
  __dirname,
  "../Dataset/job_roles.json"
);

const roles: JobRole[] = JSON.parse(
  fs.readFileSync(datasetPath, "utf8")
);

@Injectable()
export class ResumeService {

  private generateJobText(role: JobRole) {
    return [
      ...role.required_skills,
      ...role.optional_skills,
      ...role.tools
    ].join(" ");
  }

  analyzeResume(resumeText: string, roleName: string) {

    const userSkills = extractSkills(resumeText);

    const role = roles.find(
      (r) => r.role.toLowerCase() === roleName.toLowerCase()
    );

    if (!role) {
      throw new Error("Role not found");
    }

    const requiredSkills = role.required_skills;

    const matchedSkills = requiredSkills.filter((skill) =>
      userSkills.includes(skill)
    );

    const missingSkills = requiredSkills.filter((skill) =>
      !userSkills.includes(skill)
    );

    const matchScore =
      (matchedSkills.length / requiredSkills.length) * 100;

    const jobText = this.generateJobText(role);

    const similarityScore = calculateSimilarity(
      resumeText.toLowerCase(),
      jobText.toLowerCase()
    );

    return {
      role: roleName,
      matchScore: Math.round(matchScore),
      similarityScore: Number(similarityScore.toFixed(2)),
      matchedSkills,
      missingSkills,
      detectedSkills: userSkills
    };
  }

  getRoleDetails(roleName: string) {
  const role = roles.find(
    r => r.role.toLowerCase() === roleName.toLowerCase()
  );

  if (!role) {
    throw new Error("Role not found");
  }

  return role;
}

getAllRoles() {
  return roles.map(r => r.role);
}
}