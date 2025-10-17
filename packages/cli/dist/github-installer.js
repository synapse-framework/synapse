/**
 * GitHub Template Installer
 * Handles installation of templates from GitHub repositories
 */

import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

export class GitHubTemplateInstaller {
  constructor() {
    this.userTemplatesDir = join(process.env.HOME || process.env.USERPROFILE || '', '.synapse', 'templates');
    this.tempDir = join(process.env.HOME || process.env.USERPROFILE || '', '.synapse', 'temp');
  }

  async installTemplate(githubRepo, templateName = null) {
    try {
      // Parse GitHub repository
      const { owner, repo, branch } = this.parseGitHubRepo(githubRepo);
      const repoUrl = `https://github.com/${owner}/${repo}.git`;
      
      // Generate template name if not provided
      const finalTemplateName = templateName || repo;
      
      console.log(`📦 Installing template from ${owner}/${repo}...`);
      
      // Create temp directory
      await fs.mkdir(this.tempDir, { recursive: true });
      
      // Clone repository
      const tempPath = join(this.tempDir, `template-${Date.now()}`);
      await this.cloneRepository(repoUrl, tempPath, branch);
      
      // Validate template
      await this.validateTemplate(tempPath);
      
      // Install template
      const templatePath = join(this.userTemplatesDir, finalTemplateName);
      await this.installTemplateFiles(tempPath, templatePath);
      
      // Clean up temp directory
      await fs.rm(tempPath, { recursive: true, force: true });
      
      console.log(`✅ Template '${finalTemplateName}' installed successfully`);
      return { name: finalTemplateName, path: templatePath };
      
    } catch (error) {
      console.error(`❌ Failed to install template: ${error.message}`);
      throw error;
    }
  }

  parseGitHubRepo(githubRepo) {
    // Support formats:
    // user/repo
    // user/repo#branch
    // https://github.com/user/repo
    // https://github.com/user/repo#branch
    
    let owner, repo, branch = 'main';
    
    if (githubRepo.startsWith('https://github.com/')) {
      const urlParts = githubRepo.replace('https://github.com/', '').split('/');
      owner = urlParts[0];
      repo = urlParts[1].replace('.git', '');
    } else if (githubRepo.includes('/')) {
      const parts = githubRepo.split('/');
      owner = parts[0];
      repo = parts[1];
    } else {
      throw new Error('Invalid GitHub repository format. Use: user/repo or https://github.com/user/repo');
    }
    
    // Check for branch specification
    if (repo.includes('#')) {
      const repoParts = repo.split('#');
      repo = repoParts[0];
      branch = repoParts[1];
    }
    
    return { owner, repo, branch };
  }

  async cloneRepository(repoUrl, targetPath, branch = 'main') {
    try {
      // Use git clone with specific branch
      execSync(`git clone --depth 1 --branch ${branch} ${repoUrl} "${targetPath}"`, {
        stdio: 'pipe'
      });
    } catch (error) {
      // Try with main branch if specified branch fails
      if (branch !== 'main') {
        console.log(`⚠️  Branch '${branch}' not found, trying 'main'...`);
        execSync(`git clone --depth 1 --branch main ${repoUrl} "${targetPath}"`, {
          stdio: 'pipe'
        });
      } else {
        throw new Error(`Failed to clone repository: ${error.message}`);
      }
    }
  }

  async validateTemplate(templatePath) {
    // Check for template.json
    const templateJsonPath = join(templatePath, 'template.json');
    try {
      await fs.access(templateJsonPath);
    } catch {
      throw new Error('Template must contain a template.json file');
    }
    
    // Validate template.json structure
    const templateConfig = JSON.parse(await fs.readFile(templateJsonPath, 'utf-8'));
    
    if (!templateConfig.name) {
      throw new Error('Template must have a name field in template.json');
    }
    
    if (!templateConfig.files || typeof templateConfig.files !== 'object') {
      throw new Error('Template must have a files object in template.json');
    }
    
    // Check if template files exist
    for (const filePath of Object.keys(templateConfig.files)) {
      const fullPath = join(templatePath, filePath);
      try {
        await fs.access(fullPath);
      } catch {
        throw new Error(`Template file '${filePath}' not found`);
      }
    }
    
    return templateConfig;
  }

  async installTemplateFiles(sourcePath, targetPath) {
    // Remove existing template if it exists
    await fs.rm(targetPath, { recursive: true, force: true });
    
    // Copy template files
    await this.copyDirectory(sourcePath, targetPath);
  }

  async copyDirectory(source, target) {
    await fs.mkdir(target, { recursive: true });
    
    const entries = await fs.readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = join(source, entry.name);
      const targetPath = join(target, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  }

  async listInstalledTemplates() {
    const templates = [];
    
    try {
      const userTemplates = await fs.readdir(this.userTemplatesDir);
      
      for (const template of userTemplates) {
        try {
          const configPath = join(this.userTemplatesDir, template, 'template.json');
          const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
          templates.push({
            name: template,
            ...config,
            type: 'user',
            source: 'github'
          });
        } catch (error) {
          // Skip invalid templates
          console.warn(`⚠️  Skipping invalid template: ${template}`);
        }
      }
    } catch (error) {
      // User templates directory doesn't exist
    }
    
    return templates;
  }

  async removeTemplate(templateName) {
    const templatePath = join(this.userTemplatesDir, templateName);
    
    try {
      await fs.access(templatePath);
      await fs.rm(templatePath, { recursive: true, force: true });
      console.log(`✅ Template '${templateName}' removed successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Template '${templateName}' not found`);
      return false;
    }
  }

  async updateTemplate(templateName) {
    // This would require storing the original GitHub URL
    // For now, we'll just reinstall the template
    console.log(`🔄 Updating template '${templateName}'...`);
    console.log('⚠️  Template update requires manual reinstallation');
    console.log(`   Use: synapse template install <github-repo> ${templateName}`);
  }

  async searchTemplates(query) {
    // This would integrate with GitHub API to search for templates
    // For now, return a placeholder
    console.log(`🔍 Searching for templates matching '${query}'...`);
    console.log('💡 Search GitHub for "synapse-template" repositories');
    console.log('   Or browse: https://github.com/topics/synapse-template');
    
    return [];
  }
}