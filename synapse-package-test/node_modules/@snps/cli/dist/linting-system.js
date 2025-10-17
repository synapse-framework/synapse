/**
 * Linting System for Synapse CLI
 * Real linting system with custom rules and auto-fix capabilities
 */

import { promises as fs } from 'fs';
import { join, resolve, dirname, extname } from 'path';

export class LintingSystem {
  constructor(options = {}) {
    this.root = options.root || process.cwd();
    this.srcDir = options.srcDir || 'src';
    this.testDir = options.testDir || 'tests';
    this.verbose = options.verbose || false;
    this.fix = options.fix || false;
    this.strict = options.strict || false;
    
    this.rules = this.initializeRules();
    this.results = {
      errors: 0,
      warnings: 0,
      fixed: 0,
      files: 0
    };
  }

  initializeRules() {
    return {
      // Code style rules
      'no-console': { level: 'warn', fixable: false },
      'no-debugger': { level: 'error', fixable: false },
      'no-unused-vars': { level: 'warn', fixable: true },
      'no-trailing-spaces': { level: 'warn', fixable: true },
      'no-multiple-empty-lines': { level: 'warn', fixable: true },
      'semicolon-required': { level: 'error', fixable: true },
      'quotes-consistency': { level: 'warn', fixable: true },
      'indentation-consistency': { level: 'warn', fixable: true },
      
      // TypeScript specific rules
      'no-any-type': { level: 'warn', fixable: false },
      'explicit-return-type': { level: 'warn', fixable: false },
      'no-implicit-any': { level: 'error', fixable: false },
      
      // Synapse specific rules
      'synapse-imports': { level: 'error', fixable: true },
      'component-naming': { level: 'warn', fixable: false },
      'file-naming': { level: 'warn', fixable: false }
    };
  }

  async lint() {
    console.log('🔍 Running Synapse Linter...');
    
    try {
      // Find all files to lint
      const files = await this.findLintableFiles();
      
      if (files.length === 0) {
        console.log('⚠️  No files found to lint');
        return this.results;
      }
      
      console.log(`📋 Found ${files.length} files to lint`);
      
      // Lint each file
      for (const file of files) {
        await this.lintFile(file);
      }
      
      // Show results
      this.showResults();
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Linting failed:', error.message);
      throw error;
    }
  }

  async findLintableFiles() {
    const files = [];
    
    // Find TypeScript/JavaScript files in src directory
    try {
      files.push(...await this.getFilesByExtension(this.srcDir, ['.ts', '.tsx', '.js', '.jsx']));
    } catch {
      // Directory doesn't exist
    }
    
    // Find test files
    try {
      files.push(...await this.getFilesByExtension(this.testDir, ['.test.ts', '.test.js', '.spec.ts', '.spec.js']));
    } catch {
      // Directory doesn't exist
    }
    
    return files;
  }

  async getFilesByExtension(dir, extensions) {
    const files = [];
    const fullDir = join(this.root, dir);
    
    try {
      const entries = await fs.readdir(fullDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(fullDir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.getFilesByExtension(join(dir, entry.name), extensions));
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }

  async lintFile(filePath) {
    const relativePath = filePath.replace(this.root + '/', '');
    
    if (this.verbose) {
      console.log(`  Linting: ${relativePath}`);
    }
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const issues = await this.analyzeFile(content, filePath);
      
      if (issues.length > 0) {
        this.showFileIssues(relativePath, issues);
        
        // Fix issues if requested
        if (this.fix) {
          const fixedContent = await this.fixIssues(content, issues);
          if (fixedContent !== content) {
            await fs.writeFile(filePath, fixedContent);
            this.results.fixed += issues.filter(i => i.fixable).length;
          }
        }
        
        // Count issues
        this.results.errors += issues.filter(i => i.level === 'error').length;
        this.results.warnings += issues.filter(i => i.level === 'warn').length;
      }
      
      this.results.files++;
      
    } catch (error) {
      console.log(`  ❌ Error linting ${relativePath}: ${error.message}`);
    }
  }

  async analyzeFile(content, filePath) {
    const issues = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // Check each rule
      issues.push(...this.checkNoConsole(line, lineNumber));
      issues.push(...this.checkNoDebugger(line, lineNumber));
      issues.push(...this.checkNoUnusedVars(line, lineNumber, content));
      issues.push(...this.checkTrailingSpaces(line, lineNumber));
      issues.push(...this.checkSemicolonRequired(line, lineNumber));
      issues.push(...this.checkQuotesConsistency(line, lineNumber));
      issues.push(...this.checkIndentationConsistency(line, lineNumber));
      issues.push(...this.checkNoAnyType(line, lineNumber));
      issues.push(...this.checkSynapseImports(line, lineNumber));
      issues.push(...this.checkComponentNaming(line, lineNumber, filePath));
      issues.push(...this.checkFileNaming(filePath));
    }
    
    // Check for multiple empty lines
    issues.push(...this.checkMultipleEmptyLines(content));
    
    return issues;
  }

  checkNoConsole(line, lineNumber) {
    const issues = [];
    if (line.includes('console.log') || line.includes('console.error') || line.includes('console.warn')) {
      issues.push({
        rule: 'no-console',
        level: this.rules['no-console'].level,
        message: 'Avoid console statements in production code',
        line: lineNumber,
        column: line.indexOf('console'),
        fixable: false
      });
    }
    return issues;
  }

  checkNoDebugger(line, lineNumber) {
    const issues = [];
    if (line.includes('debugger')) {
      issues.push({
        rule: 'no-debugger',
        level: this.rules['no-debugger'].level,
        message: 'Remove debugger statements',
        line: lineNumber,
        column: line.indexOf('debugger'),
        fixable: false
      });
    }
    return issues;
  }

  checkNoUnusedVars(line, lineNumber, content) {
    const issues = [];
    // Simple unused variable detection
    const varMatch = line.match(/(?:let|const|var)\s+(\w+)/);
    if (varMatch) {
      const varName = varMatch[1];
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      const matches = content.match(regex) || [];
      if (matches.length === 1) {
        issues.push({
          rule: 'no-unused-vars',
          level: this.rules['no-unused-vars'].level,
          message: `Unused variable '${varName}'`,
          line: lineNumber,
          column: line.indexOf(varName),
          fixable: true
        });
      }
    }
    return issues;
  }

  checkTrailingSpaces(line, lineNumber) {
    const issues = [];
    if (line.endsWith(' ') || line.endsWith('\t')) {
      issues.push({
        rule: 'no-trailing-spaces',
        level: this.rules['no-trailing-spaces'].level,
        message: 'Remove trailing spaces',
        line: lineNumber,
        column: line.length,
        fixable: true
      });
    }
    return issues;
  }

  checkSemicolonRequired(line, lineNumber) {
    const issues = [];
    const trimmed = line.trim();
    if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && 
        !trimmed.startsWith('//') && !trimmed.startsWith('*') && !trimmed.startsWith('import') &&
        !trimmed.startsWith('export') && !trimmed.startsWith('if') && !trimmed.startsWith('for') &&
        !trimmed.startsWith('while') && !trimmed.startsWith('switch') && !trimmed.startsWith('try') &&
        !trimmed.startsWith('catch') && !trimmed.startsWith('finally') && !trimmed.startsWith('function') &&
        !trimmed.startsWith('class') && !trimmed.startsWith('interface') && !trimmed.startsWith('type')) {
      issues.push({
        rule: 'semicolon-required',
        level: this.rules['semicolon-required'].level,
        message: 'Missing semicolon',
        line: lineNumber,
        column: line.length,
        fixable: true
      });
    }
    return issues;
  }

  checkQuotesConsistency(line, lineNumber) {
    const issues = [];
    const singleQuotes = (line.match(/'/g) || []).length;
    const doubleQuotes = (line.match(/"/g) || []).length;
    
    if (singleQuotes > 0 && doubleQuotes > 0) {
      issues.push({
        rule: 'quotes-consistency',
        level: this.rules['quotes-consistency'].level,
        message: 'Inconsistent quote usage',
        line: lineNumber,
        column: 0,
        fixable: true
      });
    }
    return issues;
  }

  checkIndentationConsistency(line, lineNumber) {
    const issues = [];
    if (line.length > 0) {
      const spaces = line.match(/^ +/);
      const tabs = line.match(/^\t+/);
      
      if (spaces && tabs) {
        issues.push({
          rule: 'indentation-consistency',
          level: this.rules['indentation-consistency'].level,
          message: 'Mixed tabs and spaces for indentation',
          line: lineNumber,
          column: 0,
          fixable: true
        });
      }
    }
    return issues;
  }

  checkNoAnyType(line, lineNumber) {
    const issues = [];
    if (line.includes(': any') || line.includes('<any>')) {
      issues.push({
        rule: 'no-any-type',
        level: this.rules['no-any-type'].level,
        message: 'Avoid using any type',
        line: lineNumber,
        column: line.indexOf('any'),
        fixable: false
      });
    }
    return issues;
  }

  checkSynapseImports(line, lineNumber) {
    const issues = [];
    if (line.includes('from \'@snps/core\'')) {
      issues.push({
        rule: 'synapse-imports',
        level: this.rules['synapse-imports'].level,
        message: 'Use relative imports instead of @snps/core',
        line: lineNumber,
        column: line.indexOf('@snps/core'),
        fixable: true
      });
    }
    return issues;
  }

  checkComponentNaming(line, lineNumber, filePath) {
    const issues = [];
    if (filePath.includes('components/') && line.includes('class ')) {
      const classMatch = line.match(/class\s+(\w+)/);
      if (classMatch) {
        const className = classMatch[1];
        if (!className.match(/^[A-Z]/)) {
          issues.push({
            rule: 'component-naming',
            level: this.rules['component-naming'].level,
            message: 'Component class names should start with uppercase letter',
            line: lineNumber,
            column: line.indexOf(className),
            fixable: false
          });
        }
      }
    }
    return issues;
  }

  checkFileNaming(filePath) {
    const issues = [];
    const fileName = filePath.split('/').pop();
    
    if (filePath.includes('components/') && !fileName.match(/^[A-Z]/)) {
      issues.push({
        rule: 'file-naming',
        level: this.rules['file-naming'].level,
        message: 'Component files should start with uppercase letter',
        line: 1,
        column: 0,
        fixable: false
      });
    }
    
    return issues;
  }

  checkMultipleEmptyLines(content) {
    const issues = [];
    const lines = content.split('\n');
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '') {
        emptyLineCount++;
        if (emptyLineCount > 2) {
          issues.push({
            rule: 'no-multiple-empty-lines',
            level: this.rules['no-multiple-empty-lines'].level,
            message: 'Multiple consecutive empty lines',
            line: i + 1,
            column: 0,
            fixable: true
          });
        }
      } else {
        emptyLineCount = 0;
      }
    }
    
    return issues;
  }

  async fixIssues(content, issues) {
    let fixedContent = content;
    const lines = fixedContent.split('\n');
    
    // Sort issues by line number (descending) to avoid line number shifts
    const sortedIssues = issues.filter(i => i.fixable).sort((a, b) => b.line - a.line);
    
    for (const issue of sortedIssues) {
      switch (issue.rule) {
        case 'no-trailing-spaces':
          lines[issue.line - 1] = lines[issue.line - 1].trimEnd();
          break;
        case 'semicolon-required':
          if (!lines[issue.line - 1].trim().endsWith(';')) {
            lines[issue.line - 1] = lines[issue.line - 1].trim() + ';';
          }
          break;
        case 'quotes-consistency':
          // Convert all quotes to single quotes
          lines[issue.line - 1] = lines[issue.line - 1].replace(/"/g, "'");
          break;
        case 'indentation-consistency':
          // Convert tabs to spaces
          lines[issue.line - 1] = lines[issue.line - 1].replace(/^\t+/, match => '  '.repeat(match.length));
          break;
        case 'synapse-imports':
          lines[issue.line - 1] = lines[issue.line - 1].replace("from '@snps/core'", "from './synapse-core.js'");
          break;
        case 'no-multiple-empty-lines':
          // Remove extra empty lines
          let emptyCount = 0;
          for (let i = issue.line - 1; i < lines.length; i++) {
            if (lines[i].trim() === '') {
              emptyCount++;
              if (emptyCount > 2) {
                lines.splice(i, 1);
                i--;
              }
            } else {
              break;
            }
          }
          break;
      }
    }
    
    return lines.join('\n');
  }

  showFileIssues(relativePath, issues) {
    console.log(`  📁 ${relativePath}:`);
    
    for (const issue of issues) {
      const level = issue.level === 'error' ? '❌' : '⚠️';
      const fixable = issue.fixable ? ' (fixable)' : '';
      console.log(`    ${level} Line ${issue.line}:${issue.column} - ${issue.message}${fixable}`);
    }
  }

  showResults() {
    console.log('');
    console.log('📊 Linting Results:');
    console.log(`   Files: ${this.results.files}`);
    console.log(`   Errors: ${this.results.errors}`);
    console.log(`   Warnings: ${this.results.warnings}`);
    console.log(`   Fixed: ${this.results.fixed}`);
    
    if (this.results.errors > 0) {
      console.log('❌ Linting failed with errors');
      if (!this.fix) {
        console.log('💡 Run with --fix to automatically fix issues');
      }
    } else if (this.results.warnings > 0) {
      console.log('⚠️  Linting completed with warnings');
    } else {
      console.log('✅ Linting passed');
    }
  }
}