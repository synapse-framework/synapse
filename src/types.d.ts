// Type declarations for Node.js globals
declare global {
  var process: {
    argv: string[];
    version: string;
    platform: string;
    arch: string;
    exit(code?: number): never;
  };
}

export {};
