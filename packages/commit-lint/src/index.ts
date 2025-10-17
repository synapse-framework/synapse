import { readFileSync } from 'node:fs';

export class CommitLinter {
  private rules: CommitRule[] = [
    new TypeEnumRule(),
    new ScopeEnumRule(),
    new SubjectLengthRule(),
    new CaseRule(),
    new EmptyLineRule(),
    new FooterFormatRule(),
  ];

  lint(commitMessage: string): LintResult {
    const lines = commitMessage.split('\n');
    const header = lines[0];
    const body = lines.slice(1);

    const errors: string[] = [];
    const warnings: string[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(header, body);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateScore(errors, warnings),
    };
  }

  lintFile(filePath: string): LintResult {
    const content = readFileSync(filePath, 'utf-8');
    return this.lint(content);
  }

  private calculateScore(errors: string[], warnings: string[]): number {
    const totalIssues = errors.length + warnings.length;
    return totalIssues === 0 ? 100 : Math.max(0, 100 - (errors.length * 10) - (warnings.length * 5));
  }
}

export interface LintResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export abstract class CommitRule {
  abstract validate(header: string, body: string[]): RuleResult;
}

export interface RuleResult {
  errors: string[];
  warnings: string[];
}

// Built-in rules
class TypeEnumRule extends CommitRule {
  private validTypes = [
    'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'
  ];

  validate(header: string, body: string[]): RuleResult {
    const match = header.match(/^(\w+)(?:\(([^)]+)\))?:/);
    if (!match) {
      return { errors: ['Commit message must start with type:'], warnings: [] };
    }

    const type = match[1];
    if (!this.validTypes.includes(type)) {
      return { 
        errors: [`Invalid type "${type}". Must be one of: ${this.validTypes.join(', ')}`], 
        warnings: [] 
      };
    }

    return { errors: [], warnings: [] };
  }
}

class ScopeEnumRule extends CommitRule {
  validate(header: string, body: string[]): RuleResult {
    const match = header.match(/^(\w+)(?:\(([^)]+)\))?:/);
    if (!match) {
      return { errors: [], warnings: [] };
    }

    const scope = match[2];
    if (scope && scope.length > 20) {
      return { 
        warnings: ['Scope should be 20 characters or less'], 
        errors: [] 
      };
    }

    return { errors: [], warnings: [] };
  }
}

class SubjectLengthRule extends CommitRule {
  validate(header: string, body: string[]): RuleResult {
    const match = header.match(/^[^:]+:\s*(.+)/);
    if (!match) {
      return { errors: [], warnings: [] };
    }

    const subject = match[1];
    if (subject.length < 10) {
      return { errors: ['Subject must be at least 10 characters long'], warnings: [] };
    }

    if (subject.length > 50) {
      return { warnings: ['Subject should be 50 characters or less'], errors: [] };
    }

    return { errors: [], warnings: [] };
  }
}

class CaseRule extends CommitRule {
  validate(header: string, body: string[]): RuleResult {
    const match = header.match(/^[^:]+:\s*(.+)/);
    if (!match) {
      return { errors: [], warnings: [] };
    }

    const subject = match[1];
    if (subject[0] !== subject[0].toLowerCase()) {
      return { errors: ['Subject must start with lowercase letter'], warnings: [] };
    }

    if (subject.endsWith('.')) {
      return { errors: ['Subject must not end with period'], warnings: [] };
    }

    return { errors: [], warnings: [] };
  }
}

class EmptyLineRule extends CommitRule {
  validate(header: string, body: string[]): RuleResult {
    if (body.length > 0 && body[0] !== '') {
      return { warnings: ['Body must be separated from header by empty line'], errors: [] };
    }

    return { errors: [], warnings: [] };
  }
}

class FooterFormatRule extends CommitRule {
  validate(header: string, body: string[]): RuleResult {
    const warnings: string[] = [];
    
    for (let i = 0; i < body.length; i++) {
      const line = body[i];
      
      // Check for breaking change footer
      if (line.startsWith('BREAKING CHANGE:')) {
        if (line.length < 20) {
          warnings.push('Breaking change description should be more detailed');
        }
        continue;
      }
      
      // Check for issue references
      if (line.match(/^(Closes|Fixes|Resolves):\s*#?\d+/)) {
        continue;
      }
      
      // Check for other footer lines
      if (line.includes(':') && line.length > 0) {
        const [key, value] = line.split(':', 2);
        if (key.length < 3 || value.trim().length < 3) {
          warnings.push(`Footer line "${line}" should have more descriptive content`);
        }
      }
    }

    return { errors: [], warnings };
  }
}

// CLI interface
export function lintCommitMessage(commitMessage: string): void {
  const linter = new CommitLinter();
  const result = linter.lint(commitMessage);

  if (!result.valid) {
    console.error('❌ Commit message validation failed:');
    result.errors.forEach(error => console.error(`  - ${error}`));
    if (result.warnings.length > 0) {
      console.warn('\n⚠️  Warnings:');
      result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  Commit message warnings:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  console.log(`✅ Commit message is valid! (Score: ${result.score}/100)`);
}

// Export for compatibility
export default CommitLinter;