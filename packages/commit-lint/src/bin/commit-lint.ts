#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { lintCommitMessage } from '../index.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: commit-lint <commit-message-file>');
  console.error('Example: commit-lint .git/COMMIT_EDITMSG');
  process.exit(1);
}

const commitFile = args[0];

try {
  const commitMessage = readFileSync(commitFile, 'utf-8');
  lintCommitMessage(commitMessage);
} catch (error) {
  console.error(`❌ Error reading commit file: ${error}`);
  process.exit(1);
}