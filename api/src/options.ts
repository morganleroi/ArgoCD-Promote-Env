export interface PromoteEnvOptions {
    gitRepoUrl: string,
    appPort: number,
    host: string,
    localRepositoryName: string;
    fileEncoding: 'utf8';
    findYamlFilePattern: string;
    rebuildSOTWAfterMs: number
}

const defaultOptions: PromoteEnvOptions = {
    gitRepoUrl: "https://github.com/momo3038/Argocd-sample.git",
    appPort: 8080,
    host: '0.0.0.0',
    fileEncoding: 'utf8',
    localRepositoryName: 'repo',
    findYamlFilePattern: "**/*.yaml",
    rebuildSOTWAfterMs: 60*1000
}

export const getOptions = (): PromoteEnvOptions => {
    if(process.env.gitRepositoryUrl){
        defaultOptions.gitRepoUrl = process.env.gitRepositoryUrl
    }
    return defaultOptions;
}