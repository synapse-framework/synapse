import { SynapseFramework } from '@snps/core';

class {{projectName}}Server {
  constructor() {
    console.log('🖥️ {{projectName}} Server initialized');
  }
  
  async start() {
    console.log('✅ Fullstack application started');
  }
}

const server = new {{projectName}}Server();
await server.start();
