import execa from 'execa';

import { formattedBranchName } from './branchName';


(async () => {
  const [,, npmToken = process.env.NPM_TOKEN] = process.argv;
  if (!npmToken) throw new Error('No NPM_TOKEN configured');

  const isCI = Boolean(process.env.CI);
  if (!isCI) throw new Error('Do not run this command in a non CI environment');

  const branch = await formattedBranchName();
  console.log(`Publishing to ${branch}`);

  const subprocess = execa('yarn', [
    'lerna',
    'publish',
    '-y',
    '--canary',
    `--preid=${branch}`,
    `--npm-tag=${branch}`,
    '--force-publish=*',
    `--registry="https://npm.pkg.github.com/:_authToken=${npmToken}"`
  ]);
  subprocess.stdout!.pipe(process.stdout);

  const { exitCode } = await subprocess;
  if (exitCode) process.exit(exitCode);

})();