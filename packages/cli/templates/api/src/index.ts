import { SynapseFramework } from '@snps/core';

class {{projectName}}API {
  private port = {{port || 3000}};
  
  constructor() {
    console.log('🚀 {{projectName}} API Server starting...');
  }
  
  async start() {
    console.log(`✅ API Server running on port ${this.port}`);
  }
}

const api = new {{projectName}}API();
await api.start();
