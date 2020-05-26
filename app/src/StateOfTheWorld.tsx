export type StateOfTheWorld = {
    AppProject: Project[];
    Apps: AppProject[];
    Components: ComponentApp[];
}

export type Project = {
    Name: string;
    Description: string;
}

export type AppProject = {
    Project: string;
    Name: string;
    Environment: string;
    ValueFilePath: string;
}

export type ComponentApp = {
    Name: string;
    DeployedVersion: string;
    App: string;
}
