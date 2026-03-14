const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const stagingPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagingPath); //This going to read all the files in the staging area! cz, we can commit all the files at once.
    for (const file of files) {
      // Staging area theke files commitdir te copy ho66e!
      await fs.copyFile(path.join(stagingPath, file), path.join(commitDir,file));
    }
    await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify({message, date: new Date().toISOString()}));


  console.log(`Commit ${commitID} created with message ${message}`);
  } catch (err) {
  console.log("Error commiting files : ", err);
  }
}

module.exports = { commitRepo };
