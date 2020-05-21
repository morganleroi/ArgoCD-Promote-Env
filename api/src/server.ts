import { app } from "."
import { fetchArgoCDRepo } from "./git";
import { findFiles, StateOfTheWorld } from "./parser";

const repoURl = "https://github.com/momo3038/Argocd-sample.git";
const port = 8080;
const host = '0.0.0.0';
app.listen(port, host, () => {
    console.log(`Now listening on ${port}`);
});

console.log("Starting Git Fetch");

export let SOTW: StateOfTheWorld = {
    AppProject: [],
    Apps: [],
    Components: []
};

const computeSotw = () => fetchArgoCDRepo(repoURl)
    .then(() => findFiles()
        .then(sotw => {
            SOTW = sotw}
            ));


computeSotw().then(() => {
    console.log("Starting to rebuild SOTW every minute")
    setInterval(computeSotw, 60*1000);
});