import fs from 'fs';
import git from 'simple-git/promise';
import { AppPromotion } from './server';
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
    const commitMessage: string[] = [];
    commitMessage.push(`Promote ${promoteRequest.projectName} from ${promoteRequest.fromEnv} to ${promoteRequest.toEnv}`);
    commitMessage.push(`Component modified:`);
    commitMessage.push(...promoteRequest.componentsToPromote.map(x => x.componentName));

    await git(repoFolderName)
        .silent(false)
        .add("*")
        .then(() => console.log("Added files"));
    await git(repoFolderName)
        .silent(true)
        .commit(commitMessage)
        .then(() => console.log("Commit created"));
    await git(repoFolderName)
        .silent(true)
        .push()
        .then(() => console.log("Pushed"));
}