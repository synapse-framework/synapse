// Test direct initProject call
import { SynapseCLI } from '@snps/cli';

async function testDirectInit() {
  console.log('🔍 Testing direct initProject call...');
  
  const cli = new SynapseCLI();
  
  try {
    console.log('Current working directory:', process.cwd());
    console.log('Calling initProject directly...');
    
    // Call the initProject method directly (now public)
    await cli.initProject('test-project-direct');
    
    console.log('✅ initProject completed');
    
    // Check if directory was created
    const fs = await import('fs');
    const path = await import('path');
    
    const projectPath = path.resolve(process.cwd(), 'test-project-direct');
    console.log('Project path:', projectPath);
    
    try {
      const stats = fs.statSync(projectPath);
      console.log('✅ Directory exists:', stats.isDirectory());
      
      // List contents
      const contents = fs.readdirSync(projectPath);
      console.log('Directory contents:', contents);
      
      // Check for key files
      const packageJsonPath = path.join(projectPath, 'package.json');
      const srcPath = path.join(projectPath, 'src');
      const readmePath = path.join(projectPath, 'README.md');
      
      console.log('package.json exists:', fs.existsSync(packageJsonPath));
      console.log('src directory exists:', fs.existsSync(srcPath));
      console.log('README.md exists:', fs.existsSync(readmePath));
      
    } catch (error) {
      console.log('❌ Directory does not exist:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDirectInit();
