import fs from 'fs';
import git from 'simple-git/promise';
import { SOTW, AppPromotion } from './server';
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

export const createPromotionCommit = async (promoteRequest: AppPromotion) => {
    await git()
        .silent(true)
        .add("./*")
        .then(() => console.log("Added files"));
    await git()
        .silent(true)
        .commit(`Promote ${promoteRequest.projectName} from ${promoteRequest.fromEnv} to ${promoteRequest.toEnv} \
        \
        Component updated : \
        `)
        .then(() => console.log("Commit created"));
}