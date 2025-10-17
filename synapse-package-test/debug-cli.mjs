// Debug CLI project creation
import { SynapseCLI } from '@snps/cli';

async function debugCLI() {
  console.log('🔍 Debugging CLI project creation...');
  
  const cli = new SynapseCLI();
  
  try {
    console.log('Current working directory:', process.cwd());
    console.log('Attempting to create project...');
    
    // Call the initProject method directly
    await cli.initProject('debug-project');
    
    console.log('✅ Project creation completed');
    
    // Check if directory was created
    const fs = await import('fs');
    const path = await import('path');
    
    const projectPath = path.resolve(process.cwd(), 'debug-project');
    console.log('Project path:', projectPath);
    
    try {
      const stats = fs.statSync(projectPath);
      console.log('✅ Directory exists:', stats.isDirectory());
    } catch (error) {
      console.log('❌ Directory does not exist:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugCLI();
