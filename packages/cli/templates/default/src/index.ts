import { SynapseFramework } from '@snps/core';

const app = new SynapseFramework();
await app.initialize();

console.log('🚀 {{projectName}} is running!');
