import { exec } from 'child_process';

export const runCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
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

export const goBuild = async (flags: string, packages: string): Promise<string> => {
  return await runCommand(`go build ${flags} ${packages}`);
};

export const goRun = async (file: string, flags: string = ''): Promise<string> => {
  return await runCommand(`go run ${flags} ${file}`);
};

export const goTest = async (flags: string, packages: string): Promise<string> => {
  return await runCommand(`go test ${flags} ${packages}`);
};

export const goModInit = async (moduleName: string): Promise<string> => {
  return await runCommand(`go mod init ${moduleName}`);
};

export const goModTidy = async (): Promise<string> => {
  return await runCommand('go mod tidy');
};

export const goModVerify = async (): Promise<string> => {
  return await runCommand('go mod verify');
};

export const goFmt = async (packages: string): Promise<string> => {
  return await runCommand(`go fmt ${packages}`);
};

export const goVet = async (packages: string): Promise<string> => {
  return await runCommand(`go vet ${packages}`);
};

export const goDoc = async (symbol: string): Promise<string> => {
  return await runCommand(`go doc ${symbol}`);
};