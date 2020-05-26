import glob from 'glob'
import YAML from 'yaml'
import fs from 'fs';
import { app } from '.';
import { AppPromotion } from './server';

export type StateOfTheWorld = {
    AppProject: any[];
    Apps: any[];
    Components: any[];
}

export const writeValuesFiles = async (gitFolder: string, appPromotion: AppPromotion) => {
    const filePath = gitFolder + "/" + appPromotion.projectName.toLowerCase() + "/" + appPromotion.valueFilePath;
    const encoding = 'utf8';
    const valuesFile = fs.readFileSync(filePath, encoding);
    const yaml = YAML.parseDocument(valuesFile);


    console.log("Document parsed")
    yaml.get("components").items.forEach((yamlComponentItem: any) => {
        const yamlComponentName = yamlComponentItem.get("name");
        const foundComponent = appPromotion.componentsToPromote.find(c => c.componentName === yamlComponentName)
        if (foundComponent) {
            yamlComponentItem.set('version', foundComponent.newVersion);
        }
    });

    console.log("Document written")

    fs.writeFileSync(filePath, yaml.toString(), encoding);
};


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
                        if (appProject.findIndex((e: { Name: string; }) => e.Name === yamlParsed.metadata.name) === -1) {
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