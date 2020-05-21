export class StateOfTheWorld {
    AppProject: any[] = []
    Apps: any[] = []
    Components: any[] = [] 
}

export class Application {
    Name?: string;
    Envs?: Env[];
}

export class Env {
    Name?: string;
    Url: string = "http://google.fr";
    Components?: ComponentApp[];
}

export class ComponentApp {
    Name?: string;
    DeployedVersion?: string;
}
