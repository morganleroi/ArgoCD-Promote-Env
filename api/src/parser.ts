import glob from 'glob'
import YAML from 'yaml'
import fs from 'fs';
import { AppPromotion } from './server';
import { PromoteEnvOptions, getOptions } from './options';
import { isArray, isNullOrUndefined } from 'util';

export type StateOfTheWorld = {
    AppProject: any[];
    Apps: any[];
    Components: any[];
}

const addAppProject = (appProjects: any[], yamlParsed: any) => {
    if (appProjects.findIndex((e: { Name: string; }) => e.Name === yamlParsed.metadata.name) === -1) {
        appProjects.push({
            Name: yamlParsed.metadata.name,
            Description: yamlParsed.spec.description
        });
    }
}

const AddApplication = (apps: any[], components: any[], yamlParsed: any, options: PromoteEnvOptions) => {
    apps.push({
        Project: yamlParsed.spec.project,
        Name: yamlParsed.metadata.name,
        Description: yamlParsed.spec.description,
        Environment: yamlParsed.spec.environment,
        ValueFilePath: yamlParsed.spec.source.helm.valueFiles
    });

    const valuesFile = fs.readFileSync(`${options.localRepositoryName}/${yamlParsed.spec.source.path}/${yamlParsed.spec.source.helm.valueFiles}`, options.fileEncoding);
    const yaml = YAML.parse(valuesFile);
    if (yaml?.components !== undefined) {
        yaml.components.forEach((component: any) => {
            components.push({
                Name: component.name,
                DeployedVersion: component.version,
                App: yamlParsed.metadata.name,
                ComponentType: "Back"
            })
        });
    }
    if (yaml?.front !== undefined) {
        if (isArray(yaml.front)) {
            yaml.front.forEach((component: any) => {
                components.push({
                    Name: component.name,
                    DeployedVersion: component.version,
                    App: yamlParsed.metadata.name,
                    ComponentType: "Front"
                })
            });
        }
        else {
            components.push({
                Name: "Front",
                DeployedVersion: yaml.front.version,
                App: yamlParsed.metadata.name,
                ComponentType: "Front"
            })
        }


    }
}

export const findFiles = (options: PromoteEnvOptions): Promise<StateOfTheWorld> => {
    const apps: any[] = [];
    const appProject: any[] = [];
    const components: any[] = [];

    return new Promise<StateOfTheWorld>(function (resolve, reject) {
        glob(options.findYamlFilePattern, (er: Error | null, files: string[]) => {
            console.log("Found yaml files", files);
            files.forEach(e => {
                const file = fs.readFileSync(e, options.fileEncoding);
                const yamls = YAML.parseAllDocuments(file);
                yamls.forEach(yaml => {
                    const yamlParsed = yaml.toJSON();
                    if (yamlParsed?.kind === 'AppProject') {
                        addAppProject(appProject, yamlParsed);
                    }

                    if (yamlParsed?.kind === 'Application') {
                        AddApplication(apps, components, yamlParsed, options);
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

export const writeValuesFiles = async (appPromotion: AppPromotion) => {
    const options = getOptions();
    const filePath = `${options.localRepositoryName}/${appPromotion.projectName.toLowerCase()}/${appPromotion.valueFilePath}`;
    const valuesFile = fs.readFileSync(filePath, 'utf8');
    const yaml = YAML.parseDocument(valuesFile);

    console.log(yaml.toString());

    yaml.get("components").items.forEach((yamlComponentItem: any) => {
        const yamlComponentName = yamlComponentItem.get("name");
        const foundComponent = appPromotion.componentsToPromote.find(c => c.componentName === yamlComponentName)
        if (foundComponent) {
            console.log("change version back...")
            yamlComponentItem.set('version', foundComponent.newVersion);
        }
    });

    if (appPromotion.componentsToPromote.some(c => c.componentType === "Front")) {
        var getVersion = yaml.get("front").get("version");
        if (isNullOrUndefined(getVersion)) {
            yaml.get("front").items.forEach((yamlComponentItem: any) => {
                const yamlComponentName = yamlComponentItem.get("name");
                const foundComponent = appPromotion.componentsToPromote.find(c => c.componentType === "Front" && c.componentName === yamlComponentName)
                if (foundComponent) {
                    console.log("change version front...")
                    yamlComponentItem.set('version', foundComponent.newVersion);
                }
            });
        }
        else {
            console.log("change version front...")
            yaml.get("front").set('version', appPromotion.componentsToPromote.find(c => c.componentType === "Front")?.newVersion);
        }
    }

    fs.writeFileSync(filePath, yaml.toString(), options.fileEncoding);
};