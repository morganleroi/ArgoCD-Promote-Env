import fs from 'fs';
import git from 'simple-git/promise';
const repoFolderName = "repo";

export const fetchArgoCDRepo = (argoCdGitRepo: string) => {

    if (fs.existsSync(repoFolderName)) {
        console.log("Repo already exist");
        return git(repoFolderName)
            .silent(true)
            .pull('origin', 'master', { '--force': null })
            .then(() => console.log("Finished fetch"))
            .catch((err) => console.error('failed to fetch: ', err));
    }
    else {
        console.log("Repo do not exist");
        return git()
            .silent(true)
            .clone(argoCdGitRepo, repoFolderName)
            .then(() => console.log("Finished"))
            .catch((err) => console.error('failed to clone: ', err));
    }
}