import { exec } from 'child_process';

export const runCommand = (command: string, cwd?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

export const goVersion = async (): Promise<string> => {
  return await runCommand('go version');
};

export const goEnv = async (): Promise<string> => {
  return await runCommand('go env');
};

export const goBuild = async (flags: string, packages: string, projectPath: string): Promise<string> => {
  return await runCommand(`go build ${flags} ${packages}`, projectPath);
};

export const goRun = async (file: string, flags: string = '', projectPath: string): Promise<string> => {
  return await runCommand(`go run ${flags} ${file}`, projectPath);
};

export const goTest = async (flags: string, packages: string, projectPath: string): Promise<string> => {
  return await runCommand(`go test ${flags} ${packages}`, projectPath);
};

export const goModInit = async (moduleName: string, projectPath: string): Promise<string> => {
  return await runCommand(`go mod init ${moduleName}`, projectPath);
};

export const goModTidy = async (projectPath: string): Promise<string> => {
  return await runCommand('go mod tidy', projectPath);
};

export const goModVerify = async (projectPath: string): Promise<string> => {
  return await runCommand('go mod verify', projectPath);
};

export const goFmt = async (packages: string, projectPath: string): Promise<string> => {
  return await runCommand(`go fmt ${packages}`, projectPath);
};

export const goVet = async (packages: string, projectPath: string): Promise<string> => {
  return await runCommand(`go vet ${packages}`, projectPath);
};

export const goDoc = async (symbol: string, projectPath: string): Promise<string> => {
  return await runCommand(`go doc ${symbol}`, projectPath);
};
