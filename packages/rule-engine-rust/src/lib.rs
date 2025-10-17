use napi_derive::napi;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
// use chrono::{DateTime, Utc};
use uuid::Uuid;

#[napi]
pub struct RuleEngine {
    rules: Vec<Rule>,
    data_sources: HashMap<String, DataSource>,
    cache: HashMap<String, CacheEntry>,
}

#[napi(object)]
#[derive(Serialize, Deserialize, Clone)]
pub struct Rule {
    pub id: String,
    pub category: Option<String>,
    pub severity: String,
    pub title: String,
    pub description: String,
    pub remediation: String,
    pub pattern: Option<String>,
    pub logic: String,
    pub tags: Vec<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[napi(object)]
#[derive(Serialize, Deserialize, Clone)]
pub struct Violation {
    pub id: String,
    pub rule_id: String,
    pub file_path: String,
    pub line_number: Option<u32>,
    pub column_number: Option<u32>,
    pub message: String,
    pub severity: String,
    pub category: String,
    pub auto_fixable: bool,
    pub suggested_fix: Option<String>,
    pub created_at: String,
}

#[napi(object)]
#[derive(Serialize, Deserialize, Clone)]
pub struct DataSource {
    pub id: String,
    pub name: String,
    pub url: String,
    pub last_checked: Option<String>,
    pub last_updated: Option<String>,
    pub data: serde_json::Value,
}

#[napi(object)]
#[derive(Serialize, Deserialize, Clone)]
pub struct CacheEntry {
    pub key: String,
    pub data: serde_json::Value,
    pub expires_at: String,
    pub created_at: String,
}

#[napi(object)]
#[derive(Serialize, Deserialize, Clone)]
pub struct RuleResult {
    pub violations: Vec<Violation>,
    pub summary: RuleSummary,
    pub execution_time_ms: u32,
}

#[napi(object)]
#[derive(Serialize, Deserialize, Clone)]
pub struct RuleSummary {
    pub total_violations: u32,
    pub critical_count: u32,
    pub high_count: u32,
    pub medium_count: u32,
    pub low_count: u32,
    pub auto_fixable_count: u32,
    pub categories: HashMap<String, u32>,
}

#[napi]
impl RuleEngine {
    #[napi(constructor)]
    pub fn new() -> Self {
        Self {
            rules: Vec::new(),
            data_sources: HashMap::new(),
            cache: HashMap::new(),
        }
    }

    #[napi]
    pub fn add_rule(&mut self, rule: Rule) {
        self.rules.push(rule);
    }

    #[napi]
    pub fn add_rules(&mut self, rules: Vec<Rule>) {
        self.rules.extend(rules);
    }

    #[napi]
    pub fn add_data_source(&mut self, source: DataSource) {
        self.data_sources.insert(source.id.clone(), source);
    }

    #[napi]
    pub fn load_rules_from_file(&mut self, file_path: String) -> napi::Result<()> {
        let content = fs::read_to_string(&file_path)
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Failed to read rules file: {}", e)))?;
        
        let rules: Vec<Rule> = serde_json::from_str(&content)
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Failed to parse rules: {}", e)))?;
        
        self.add_rules(rules);
        Ok(())
    }

    #[napi]
    pub fn check_file(&self, file_path: String) -> napi::Result<RuleResult> {
        let start_time = std::time::Instant::now();
        let mut violations = Vec::new();

        if !Path::new(&file_path).exists() {
            return Err(napi::Error::new(napi::Status::InvalidArg, "File does not exist"));
        }

        let content = fs::read_to_string(&file_path)
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Failed to read file: {}", e)))?;

        for rule in &self.rules {
            let rule_violations = self.check_rule_against_file(&rule, &file_path, &content);
            violations.extend(rule_violations);
        }

        let execution_time = start_time.elapsed().as_millis() as u32;
        let summary = self.create_summary(&violations);

        Ok(RuleResult {
            violations,
            summary,
            execution_time_ms: execution_time,
        })
    }

    #[napi]
    pub fn check_directory(&self, dir_path: String) -> napi::Result<RuleResult> {
        let start_time = std::time::Instant::now();
        let mut all_violations = Vec::new();

        if !Path::new(&dir_path).is_dir() {
            return Err(napi::Error::new(napi::Status::InvalidArg, "Directory does not exist"));
        }

        self.scan_directory(&dir_path, &mut all_violations)?;

        let execution_time = start_time.elapsed().as_millis() as u32;
        let summary = self.create_summary(&all_violations);

        Ok(RuleResult {
            violations: all_violations,
            summary,
            execution_time_ms: execution_time,
        })
    }

    #[napi]
    pub fn get_rules(&self) -> Vec<Rule> {
        self.rules.clone()
    }

    #[napi]
    pub fn get_rule_by_id(&self, rule_id: String) -> Option<Rule> {
        self.rules.iter().find(|r| r.id == rule_id).cloned()
    }

    #[napi]
    pub fn update_rule(&mut self, rule_id: String, updated_rule: Rule) -> bool {
        if let Some(index) = self.rules.iter().position(|r| r.id == rule_id) {
            self.rules[index] = updated_rule;
            true
        } else {
            false
        }
    }

    #[napi]
    pub fn delete_rule(&mut self, rule_id: String) -> bool {
        if let Some(index) = self.rules.iter().position(|r| r.id == rule_id) {
            self.rules.remove(index);
            true
        } else {
            false
        }
    }

    #[napi]
    pub fn clear_cache(&mut self) {
        self.cache.clear();
    }

    #[napi]
    pub fn get_cache_stats(&self) -> HashMap<String, u32> {
        let mut stats = HashMap::new();
        stats.insert("total_entries".to_string(), self.cache.len() as u32);
        stats.insert("expired_entries".to_string(), self.count_expired_entries());
        stats
    }

    fn check_rule_against_file(&self, rule: &Rule, file_path: &str, content: &str) -> Vec<Violation> {
        let mut violations = Vec::new();
        let lines: Vec<&str> = content.lines().collect();

        match rule.logic.as_str() {
            "regex" => {
                if let Some(pattern) = &rule.pattern {
                    if let Ok(regex) = Regex::new(pattern) {
                        for (line_num, line) in lines.iter().enumerate() {
                            if regex.is_match(line) {
                                violations.push(Violation {
                                    id: Uuid::new_v4().to_string(),
                                    rule_id: rule.id.clone(),
                                    file_path: file_path.to_string(),
                                    line_number: Some((line_num + 1) as u32),
                                    column_number: None,
                                    message: format!("{}: {}", rule.title, rule.description),
                                    severity: rule.severity.clone(),
                                    category: rule.category.clone().unwrap_or_else(|| "default".to_string()),
                                    auto_fixable: self.is_auto_fixable(rule),
                                    suggested_fix: self.generate_suggested_fix(rule, line),
                                    created_at: chrono::Utc::now().to_rfc3339(),
                                });
                            }
                        }
                    }
                }
            }
            "contains" => {
                if let Some(pattern) = &rule.pattern {
                    for (line_num, line) in lines.iter().enumerate() {
                        if line.contains(pattern) {
                            violations.push(Violation {
                                id: Uuid::new_v4().to_string(),
                                rule_id: rule.id.clone(),
                                file_path: file_path.to_string(),
                                line_number: Some((line_num + 1) as u32),
                                column_number: None,
                                message: format!("{}: {}", rule.title, rule.description),
                                severity: rule.severity.clone(),
                                category: rule.category.clone().unwrap_or_else(|| "default".to_string()),
                                auto_fixable: self.is_auto_fixable(rule),
                                suggested_fix: self.generate_suggested_fix(rule, line),
                                created_at: chrono::Utc::now().to_rfc3339(),
                            });
                        }
                    }
                }
            }
            "not_contains" => {
                if let Some(pattern) = &rule.pattern {
                    if !content.contains(pattern) {
                        violations.push(Violation {
                            id: Uuid::new_v4().to_string(),
                            rule_id: rule.id.clone(),
                            file_path: file_path.to_string(),
                            line_number: None,
                            column_number: None,
                            message: format!("{}: {}", rule.title, rule.description),
                            severity: rule.severity.clone(),
                            category: rule.category.clone().unwrap_or_else(|| "default".to_string()),
                            auto_fixable: self.is_auto_fixable(rule),
                            suggested_fix: Some(rule.remediation.clone()),
                            created_at: chrono::Utc::now().to_rfc3339(),
                        });
                    }
                }
            }
            "file_exists" => {
                if let Some(pattern) = &rule.pattern {
                    let target_path = Path::new(file_path).parent().unwrap().join(pattern);
                    if !target_path.exists() {
                        violations.push(Violation {
                            id: Uuid::new_v4().to_string(),
                            rule_id: rule.id.clone(),
                            file_path: file_path.to_string(),
                            line_number: None,
                            column_number: None,
                            message: format!("{}: {}", rule.title, rule.description),
                            severity: rule.severity.clone(),
                            category: rule.category.clone().unwrap_or_else(|| "default".to_string()),
                            auto_fixable: self.is_auto_fixable(rule),
                            suggested_fix: Some(rule.remediation.clone()),
                            created_at: chrono::Utc::now().to_rfc3339(),
                        });
                    }
                }
            }
            _ => {}
        }

        violations
    }

    fn scan_directory(&self, dir_path: &str, violations: &mut Vec<Violation>) -> napi::Result<()> {
        let entries = fs::read_dir(dir_path)
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Failed to read directory: {}", e)))?;

        for entry in entries {
            let entry = entry.map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Failed to read entry: {}", e)))?;
            let path = entry.path();
            let path_str = path.to_string_lossy().to_string();

            if path.is_dir() {
                // Skip node_modules, target, dist, etc.
                if !self.should_skip_directory(&path_str) {
                    self.scan_directory(&path_str, violations)?;
                }
            } else if self.should_check_file(&path_str) {
                if let Ok(content) = fs::read_to_string(&path) {
                    for rule in &self.rules {
                        let rule_violations = self.check_rule_against_file(rule, &path_str, &content);
                        violations.extend(rule_violations);
                    }
                }
            }
        }

        Ok(())
    }

    fn should_skip_directory(&self, path: &str) -> bool {
        let skip_dirs = ["node_modules", "target", "dist", "build", ".git", "coverage"];
        skip_dirs.iter().any(|dir| path.contains(dir))
    }

    fn should_check_file(&self, path: &str) -> bool {
        let extensions = [".ts", ".js", ".tsx", ".jsx", ".rs", ".toml", ".json", ".md"];
        extensions.iter().any(|ext| path.ends_with(ext))
    }

    fn is_auto_fixable(&self, rule: &Rule) -> bool {
        rule.tags.contains(&"auto-fixable".to_string())
    }

    fn generate_suggested_fix(&self, rule: &Rule, line: &str) -> Option<String> {
        if !self.is_auto_fixable(rule) {
            return None;
        }

        match rule.logic.as_str() {
            "contains" => {
                if let Some(pattern) = &rule.pattern {
                    Some(line.replace(pattern, ""))
                } else {
                    None
                }
            }
            _ => Some(rule.remediation.clone()),
        }
    }

    fn create_summary(&self, violations: &[Violation]) -> RuleSummary {
        let mut summary = RuleSummary {
            total_violations: violations.len() as u32,
            critical_count: 0,
            high_count: 0,
            medium_count: 0,
            low_count: 0,
            auto_fixable_count: 0,
            categories: HashMap::new(),
        };

        for violation in violations {
            match violation.severity.as_str() {
                "Critical" => summary.critical_count += 1,
                "High" => summary.high_count += 1,
                "Medium" => summary.medium_count += 1,
                "Low" => summary.low_count += 1,
                _ => {}
            }

            if violation.auto_fixable {
                summary.auto_fixable_count += 1;
            }

            *summary.categories.entry(violation.category.clone()).or_insert(0) += 1;
        }

        summary
    }

    fn count_expired_entries(&self) -> u32 {
        let now = chrono::Utc::now().to_rfc3339();
        self.cache.values().filter(|entry| entry.expires_at < now).count() as u32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rule_engine_creation() {
        let engine = RuleEngine::new();
        assert_eq!(engine.rules.len(), 0);
        assert_eq!(engine.data_sources.len(), 0);
    }

    #[test]
    fn test_add_rule() {
        let mut engine = RuleEngine::new();
        let rule = Rule {
            id: "TEST-001".to_string(),
            category: Some("Security".to_string()),
            severity: "High".to_string(),
            title: "Test Rule".to_string(),
            description: "A test rule".to_string(),
            remediation: "Fix the issue".to_string(),
            pattern: Some("test".to_string()),
            logic: "contains".to_string(),
            tags: vec!["test".to_string()],
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
        };

        engine.add_rule(rule);
        assert_eq!(engine.rules.len(), 1);
    }

    #[test]
    fn test_should_skip_directory() {
        let engine = RuleEngine::new();
        assert!(engine.should_skip_directory("/path/to/node_modules"));
        assert!(engine.should_skip_directory("/path/to/target"));
        assert!(!engine.should_skip_directory("/path/to/src"));
    }

    #[test]
    fn test_should_check_file() {
        let engine = RuleEngine::new();
        assert!(engine.should_check_file("test.ts"));
        assert!(engine.should_check_file("test.js"));
        assert!(engine.should_check_file("test.rs"));
        assert!(!engine.should_check_file("test.txt"));
    }
}