import {execSync} from 'child_process';
import * as fs from 'node:fs';

const packageDirectories = [
  'packages/ffw',
  'packages/ffw-svelte',
  'packages/ffw-solid',
  'packages/ffw-nanostores',
];

execSync('npx nx run-many -t build --projects=ffw,ffw-\\*');

for (const packageDir of packageDirectories) {
  const packageJsonPath = `${packageDir}/package.json`;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  if (packageJson.private !== true) {
    const packageName = packageJson.name;
    console.log(`Checking for changes in ${packageName}...`);

    // Run the git status command to check for changes in the package directory
    try {
      const gitStatus = execSync(`git -C ${packageDir} status --porcelain`, {
        encoding: 'utf-8',
      });

      // If there are changes, update the package version
      if (gitStatus.length > 0) {
        const currentVersion = packageJson.version;
        const newVersion = incrementVersion(currentVersion);
        packageJson.version = newVersion;

        // Save the updated package.json file
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(`${packageName} version updated to ${newVersion}.`);
      } else {
        console.log(`${packageName} has no changes.`);
      }

      // Run the publish command using either Yarn or npm
      console.log(`Publishing ${packageName}...`);
      try {
        execSync(`cd ${packageDir} && pnpm publish --no-git-checks`, {
          stdio: 'inherit',
        });
      } catch (error) {
        console.error(`Failed to publish ${packageName}:`, error);
      }
      console.log(`${packageName} published successfully.`);
    } catch (error) {
      console.error(`Failed to check changes for ${packageName}:`, error);
    }
  }
}

// Function to increment the package version
function incrementVersion(version) {
  const versionParts = version.split('.');
  const lastPart = versionParts.pop();
  const newLastPart = parseInt(lastPart, 10) + 1;
  versionParts.push(newLastPart.toString());
  return versionParts.join('.');
}
