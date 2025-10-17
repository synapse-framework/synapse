// Debug handleInit method
import { SynapseCLI } from '@snps/cli';

async function debugHandleInit() {
  console.log('🔍 Testing handleInit method...');
  
  const cli = new SynapseCLI();
  
  try {
    console.log('Current working directory:', process.cwd());
    console.log('Calling handleInit...');
    
    // Call the handleInit method
    await cli.handleInit('debug-project-2');
    
    console.log('✅ handleInit completed');
    
    // Check if directory was created
    const fs = await import('fs');
    const path = await import('path');
    
    const projectPath = path.resolve(process.cwd(), 'debug-project-2');
    console.log('Project path:', projectPath);
    
    try {
      const stats = fs.statSync(projectPath);
      console.log('✅ Directory exists:', stats.isDirectory());
      
      // List contents
      const contents = fs.readdirSync(projectPath);
      console.log('Directory contents:', contents);
    } catch (error) {
      console.log('❌ Directory does not exist:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugHandleInit();
