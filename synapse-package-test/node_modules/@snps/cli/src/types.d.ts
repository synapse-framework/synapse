declare global {
  namespace NodeJS {
    interface Process {
      argv: string[];
      cwd(): string;
      exit(code?: number): never;
    }
  }
  
  const process: NodeJS.Process;
}

export {};