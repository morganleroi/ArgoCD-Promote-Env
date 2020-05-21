import glob from 'glob'
import YAML from 'yaml'
import fs from 'fs';
import { app } from '.';

export type StateOfTheWorld = {
    AppProject: any[];
    Apps: any[];
    Components: any[];
}

// options is optional
export const findFiles = (): Promise<StateOfTheWorld> => {

    const apps: any[] = [];
    const appProject: any[] = [];
    const components: any[] = [];

    return new Promise<StateOfTheWorld>(function (resolve, reject) {
        glob("**/*.yaml", (er: Error | null, files: string[]) => {
            console.log("Found yaml files", files);
            files.forEach(e => {
                const file = fs.readFileSync(e, 'utf8');
                const yamls = YAML.parseAllDocuments(file);
                yamls.forEach(yaml => {
                    const yamlParsed = yaml.toJSON();
                    if (yamlParsed.kind !== undefined && yamlParsed.kind === 'AppProject') {
                        if(appProject.findIndex((e: { Name: string; }) => e.Name === yamlParsed.metadata.name) === -1){
                            console.log("push")
                            appProject.push({
                                Name: yamlParsed.metadata.name,
                                Description: yamlParsed.spec.description
                            });
                        } else {
                            console.log("oupss")
                        }
                    }

                    if (yamlParsed.kind !== undefined && yamlParsed.kind === 'Application') {
                        apps.push({
                            Project: yamlParsed.spec.project,
                            Name: yamlParsed.metadata.name,
                            Description: yamlParsed.spec.description,
                            Environment: yamlParsed.spec.environment,
                            ValueFilePath: yamlParsed.spec.source.helm.valueFiles
                        });

                        const valuesFile = fs.readFileSync("repo/" + yamlParsed.spec.source.path + "/" + yamlParsed.spec.source.helm.valueFiles, 'utf8');
                        const yaml = YAML.parse(valuesFile);
                        yaml.components.forEach((component: any) => {
                            components.push({
                                Name: component.name,
                                DeployedVersion: component.version,
                                App: yamlParsed.metadata.name
                            })
                        });
                    }
                });
            });

            resolve({
                AppProject: appProject,
                Apps: apps,
                Components: components
            });
        });
    });
};