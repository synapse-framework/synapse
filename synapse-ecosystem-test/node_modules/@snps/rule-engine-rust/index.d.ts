export interface Rule {
  id: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  remediation: string;
  pattern?: string;
  logic: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Violation {
  id: string;
  rule_id: string;
  file_path: string;
  line_number?: number;
  column_number?: number;
  message: string;
  severity: string;
  category: string;
  auto_fixable: boolean;
  suggested_fix?: string;
  created_at: string;
}

export interface DataSource {
  id: string;
  name: string;
  url: string;
  last_checked?: string;
  last_updated?: string;
  data: any;
}

export interface CacheEntry {
  key: string;
  data: any;
  expires_at: string;
  created_at: string;
}

export interface RuleResult {
  violations: Violation[];
  summary: RuleSummary;
  execution_time_ms: number;
}

export interface RuleSummary {
  total_violations: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  auto_fixable_count: number;
  categories: Record<string, number>;
}

export class RuleEngine {
  constructor();
  addRule(rule: Rule): void;
  addRules(rules: Rule[]): void;
  addDataSource(source: DataSource): void;
  loadRulesFromFile(filePath: string): void;
  checkFile(filePath: string): RuleResult;
  checkDirectory(dirPath: string): RuleResult;
  getRules(): Rule[];
  getRuleById(ruleId: string): Rule | null;
  updateRule(ruleId: string, updatedRule: Rule): boolean;
  deleteRule(ruleId: string): boolean;
  clearCache(): void;
  getCacheStats(): Record<string, number>;
}