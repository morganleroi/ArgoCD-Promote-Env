import { app } from "."
import { fetchArgoCDRepo, createPromotionCommit } from "./git";
import { findFiles, StateOfTheWorld, writeValuesFiles } from "./parser";

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

const promotionEnv = {
    projectName: "MySecondApp",
    fromEnv: 'devci',
    toEnv: 'prd',
    valueFilePath: "prd/values.yaml",
    componentsToPromote: [{
        componentName: "MyFirstComponent",
        newVersion: "1.2.3.4"
    }, {
        componentName: "MySecondComponent",
        newVersion: "5.6.7.8"
    }, {
        componentName: "MyThirdComponent",
        newVersion: "9.10.11.12"
    }]
};

console.log("Writinf files")
writeValuesFiles("repo", promotionEnv);
console.log("Commit ...")
createPromotionCommit(promotionEnv).then(() => console.log("Done"));



const repoURl = "https://github.com/momo3038/Argocd-sample.git";
const port = 8080;
const host = '0.0.0.0';
// app.listen(port, host, () => {
//     console.log(`Now listening on ${port}`);
// });

console.log("Starting Git Fetch");

export let SOTW: StateOfTheWorld = {
    AppProject: [],
    Apps: [],
    Components: []
};

// const computeSotw = () => fetchArgoCDRepo(repoURl)
//     .then(() => findFiles()
//         .then(sotw => {
//             SOTW = sotw}
//             ));


// computeSotw().then(() => {
//     console.log("Starting to rebuild SOTW every minute")
//     setInterval(computeSotw, 60*1000);
// });