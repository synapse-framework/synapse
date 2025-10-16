#!/usr/bin/env node

/**
 * Simple build script for Synapse CLI
 * Compiles Rust binary and prepares for npm publishing
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildRust() {
  console.log('🦀 Building Rust CLI...');
  
  return new Promise((resolve, reject) => {
    const child = spawn('cargo', ['build', '--release'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Rust CLI built successfully');
        resolve();
      } else {
        reject(new Error(`Rust build failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function copyRustBinary() {
  console.log('📦 Copying Rust binary...');
  
  const sourcePath = join(__dirname, 'target', 'release', 'synapse');
  const destPath = join(__dirname, 'dist', 'synapse-cli');
  
  try {
    await fs.copyFile(sourcePath, destPath);
    console.log('✅ Rust binary copied to dist/');
  } catch (error) {
    console.error('❌ Failed to copy Rust binary:', error.message);
    throw error;
  }
}

async function makeBinaryExecutable() {
  console.log('🔧 Making binary executable...');
  
  const binaryPath = join(__dirname, 'dist', 'synapse-cli');
  
  try {
    await fs.chmod(binaryPath, 0o755);
    console.log('✅ Binary made executable');
  } catch (error) {
    console.error('❌ Failed to make binary executable:', error.message);
    throw error;
  }
}

async function createDistDirectory() {
  console.log('📁 Creating dist directory...');
  
  try {
    await fs.mkdir(join(__dirname, 'dist'), { recursive: true });
    console.log('✅ Dist directory created');
  } catch (error) {
    console.error('❌ Failed to create dist directory:', error.message);
    throw error;
  }
}

async function buildTypeScript() {
  console.log('⚡ Compiling TypeScript with esbuild...');
  try {
    await esbuild.build({
      entryPoints: [
        join(__dirname, 'src', 'index.ts'),
        join(__dirname, 'src', 'synapse-cli.ts'),
      ],
      outdir: join(__dirname, 'dist'),
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      external: [],
    });
    console.log('✅ TypeScript compiled successfully');
  } catch (error) {
    console.error('❌ Failed to compile TypeScript:', error.message);
    throw error;
  }
}

async function generateTypes() {
  console.log('📋 Generating type definitions with tsc...');
  return new Promise((resolve, reject) => {
    const child = spawn('tsc', ['--emitDeclarationOnly', '--outDir', 'dist'], {
      cwd: __dirname,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Type definitions generated successfully');
        resolve();
      } else {
        reject(new Error(`tsc failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function copyPackageJson() {
  console.log('📄 Copying package.json...');
  
  try {
    const packageJson = JSON.parse(
      await fs.readFile(join(__dirname, 'package.json'), 'utf-8')
    );
    
    // Update package.json for distribution
    const distPackageJson = {
      ...packageJson,
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      bin: {
        synapse: 'dist/index.js'
      },
      files: [
        'dist',
        'src',
        'Cargo.toml',
        'README.md',
        'LICENSE'
      ]
    };
    
    await fs.writeFile(
      join(__dirname, 'dist', 'package.json'),
      JSON.stringify(distPackageJson, null, 2)
    );
    
    console.log('✅ Package.json copied and updated');
  } catch (error) {
    console.error('❌ Failed to copy package.json:', error.message);
    throw error;
  }
}

async function copyReadme() {
  console.log('📖 Copying README...');
  
  try {
    await fs.copyFile(
      join(__dirname, 'README.md'),
      join(__dirname, 'dist', 'README.md')
    );
    console.log('✅ README copied');
  } catch (error) {
    console.error('❌ Failed to copy README:', error.message);
    throw error;
  }
}

async function validateBuild() {
  console.log('🔍 Validating build...');
  
  try {
    // Check if all required files exist
    const requiredFiles = [
      'dist/index.js',
      'dist/index.d.ts',
      'dist/synapse-cli.js',
      'dist/synapse-cli.d.ts',
      'dist/types.d.ts',
      'dist/synapse-cli',
      'dist/package.json'
    ];
    
    for (const file of requiredFiles) {
      await fs.access(join(__dirname, file));
    }
    
    console.log('✅ Build validation passed');
  } catch (error) {
    console.error('❌ Build validation failed:', error.message);
    throw error;
  }
}

async function main() {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting Synapse CLI build process...\n');
    
    await createDistDirectory();
    await buildRust();
    await copyRustBinary();
    await makeBinaryExecutable();
    await buildTypeScript();
    await generateTypes();
    await copyPackageJson();
    await copyReadme();
    await validateBuild();
    
    const buildTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Build completed successfully in ${buildTime}s!`);
    console.log('📦 Ready for npm publishing');
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

main();