import { app } from "."
import { fetchArgoCDRepo } from "./git";
import { findFiles, StateOfTheWorld } from "./parser";
import { getOptions } from "./options";

export type AppPromotion = {
    projectName: string;
    fromEnv: string,
    toEnv: string,
    valueFilePath: string;
    componentsToPromote: ComponentToPromote[]
}

export type ComponentToPromote = {
    componentName: string;
    newVersion: string;
};

const options = getOptions();

console.log("Repo URL " + options.gitRepoUrl)

app.listen(options.appPort, options.host, () => {
    console.log(`Now listening on ${options.appPort}`);
});

console.log("Starting Git Fetch");

export let SOTW: StateOfTheWorld = {
    AppProject: [],
    Apps: [],
    Components: []
};



const computeSotw = () => fetchArgoCDRepo(options.gitRepoUrl)
    .then(() => findFiles(options)
        .then(sotw => {
            SOTW = sotw}
            ));


computeSotw().then(() => {
    console.log(`Starting to rebuild SOTW every ${options.rebuildSOTWAfterMs} ms`)
    setInterval(computeSotw, options.rebuildSOTWAfterMs);
});