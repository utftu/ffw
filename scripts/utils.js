import childProcess from 'child_process';

export const exec = (cmd, options) => {
  return childProcess.execSync(cmd, {
    stdio: 'inherit',
    shell: true,
    ...options,
  });
};

export const execAsync = (cmd, options) => {
  return childProcess.exec(cmd, {stdio: 'inherit', shell: true, ...options});
};
