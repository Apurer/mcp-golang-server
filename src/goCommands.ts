// goCommands.ts
import { exec } from 'child_process';

export const runCommand = (
  command: string,
  cwd?: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { cwd, env: { ...process.env, ...envVars } },
      (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${stderr}`);
        } else {
          resolve(stdout);
        }
      }
    );
  });
};

export const goVersion = async (envVars?: Record<string, string>): Promise<string> => {
  return await runCommand('go version', undefined, envVars);
};

export const goEnv = async (envVars?: Record<string, string>): Promise<string> => {
  return await runCommand('go env', undefined, envVars);
};

export const goBuild = async (
  flags: string,
  packages: string,
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand(`go build ${flags} ${packages}`, projectPath, envVars);
};

export const goRun = async (
  file: string,
  flags: string = '',
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand(`go run ${flags} ${file}`, projectPath, envVars);
};

export const goTest = async (
  flags: string,
  packages: string,
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand(`go test ${flags} ${packages}`, projectPath, envVars);
};

export const goModInit = async (
  moduleName: string,
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand(`go mod init ${moduleName}`, projectPath, envVars);
};

export const goModTidy = async (
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand('go mod tidy', projectPath, envVars);
};

export const goModVerify = async (
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand('go mod verify', projectPath, envVars);
};

export const goFmt = async (
  packages: string,
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand(`go fmt ${packages}`, projectPath, envVars);
};

export const goVet = async (
  packages: string,
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand(`go vet ${packages}`, projectPath, envVars);
};

export const goDoc = async (
  symbol: string,
  projectPath: string,
  envVars?: Record<string, string>
): Promise<string> => {
  return await runCommand(`go doc ${symbol}`, projectPath, envVars);
};
