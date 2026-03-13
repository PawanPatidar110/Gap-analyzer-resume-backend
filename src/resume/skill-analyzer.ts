import * as fs from "fs";
import * as path from "path";

interface JobRole {
    role:string,
    required_skills: string[],
    optional_skills:string[],
    tools:string[];
}


const dataPath =  path.join(
    __dirname,
    "../dataset/job_roles.json"
);


const roles: JobRole[] = JSON.parse(fs.readFileSync(dataPath,"utf8"));


export function extractSkills(resumeText:string){
    const normalizedText =  resumeText.toLowerCase();

    const DetectedSkills =  new Set<String>();

    roles.forEach((role) =>{
        const AllSkills = [
            ...role.required_skills,
            ...role.optional_skills,
            ...role.tools
        ];

        AllSkills.forEach((skill) =>{
            if(normalizedText.includes(skill.toLowerCase())){
                DetectedSkills.add(skill);
            }
        });
    });

    return  Array.from(DetectedSkills);
}