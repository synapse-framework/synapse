import { SynapseFramework } from '@snps/core';

class {{projectName}}Client {
  constructor() {
    console.log('🌐 {{projectName}} Client initialized');
  }
  
  async render() {
    document.getElementById('app')!.innerHTML = `
      <div class="app">
        <h1>{{projectName}}</h1>
        <p>{{description}}</p>
      </div>
    `;
  }
}

const client = new {{projectName}}Client();
await client.render();
