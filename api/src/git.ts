import fs from 'fs';
import git from 'simple-git/promise';
import { AppPromotion } from './server';
const repoFolderName = "repo";

export const fetchArgoCDRepo = (argoCdGitRepo: string) => {
    if (fs.existsSync(repoFolderName)) {
        return git(repoFolderName)
            .silent(true)
            .pull('origin', 'master', { '--force': null })
            .then(() => console.log("Finished fetch"), (error) => console.log(`Pull rejected : ${error}`))
    }
    else {
        return git()
            .silent(true)
            .clone(argoCdGitRepo, repoFolderName)
            .then(() => console.log("Finished"), (error) => console.log(`Clone error : ${error}`))
    }
}

export const createPromotionCommit = async (promoteRequest: AppPromotion) => {
    const gitI = await git(repoFolderName).silent(true);
    await gitI.add("*").then(() => console.log("Added files"), (error) => console.log(`Git Add rejected: ${error}`));
    await gitI.addConfig('user.name', 'promote-env-bot');
    await gitI.addConfig('user.email', 'promote-env-bot@bot.com');
    await gitI.commit(`Promote ${promoteRequest.projectName} from ${promoteRequest.fromEnv} to ${promoteRequest.toEnv}`).then((commit) => console.log(`Commit created : ${commit.commit}`), (error) => console.log(`Commit rejected: ${error}`));
    await gitI.push().then(() => console.log("Push completed"), (error) => console.log(`Push rejected : ${error}`));
}