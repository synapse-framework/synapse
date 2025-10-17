use napi_derive::napi;
use regex::Regex;
use serde::{Deserialize, Serialize};

#[napi]
pub struct CommitLinter {
    rules: Vec<Box<dyn CommitRule + Send + Sync>>,
}

#[napi]
#[derive(Serialize, Deserialize)]
pub struct LintResult {
    pub valid: bool,
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
    pub score: u8,
}

#[napi]
#[derive(Serialize, Deserialize)]
pub struct RuleResult {
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
}

trait CommitRule {
    fn validate(&self, header: &str, body: &[String]) -> RuleResult;
}

struct TypeEnumRule;
struct ScopeEnumRule;
struct SubjectLengthRule;
struct CaseRule;
struct EmptyLineRule;
struct FooterFormatRule;

#[napi]
impl CommitLinter {
    #[napi(constructor)]
    pub fn new() -> Self {
        let rules: Vec<Box<dyn CommitRule + Send + Sync>> = vec![
            Box::new(TypeEnumRule),
            Box::new(ScopeEnumRule),
            Box::new(SubjectLengthRule),
            Box::new(CaseRule),
            Box::new(EmptyLineRule),
            Box::new(FooterFormatRule),
        ];

        Self { rules }
    }

    #[napi]
    pub fn lint(&self, commit_message: String) -> LintResult {
        let lines: Vec<&str> = commit_message.lines().collect();
        let header = lines.first().unwrap_or(&"");
        let body: Vec<String> = lines.iter().skip(1).map(|s| s.to_string()).collect();

        let mut errors = Vec::new();
        let mut warnings = Vec::new();

        for rule in &self.rules {
            let result = rule.validate(header, &body);
            errors.extend(result.errors);
            warnings.extend(result.warnings);
        }

        let score = self.calculate_score(&errors, &warnings);

        LintResult {
            valid: errors.is_empty(),
            errors,
            warnings,
            score,
        }
    }

    #[napi]
    pub fn lint_file(&self, file_path: String) -> napi::Result<LintResult> {
        let content = std::fs::read_to_string(&file_path)
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Failed to read file: {}", e)))?;
        
        Ok(self.lint(content))
    }

    fn calculate_score(&self, errors: &[String], warnings: &[String]) -> u8 {
        let total_issues = errors.len() + warnings.len();
        if total_issues == 0 {
            100
        } else {
            (100 as i32 - (errors.len() as i32 * 10) - (warnings.len() as i32 * 5)).max(0) as u8
        }
    }
}

impl Default for CommitLinter {
    fn default() -> Self {
        Self::new()
    }
}

// Rule implementations
impl CommitRule for TypeEnumRule {
    fn validate(&self, header: &str, _body: &[String]) -> RuleResult {
        let valid_types = vec![
            "feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"
        ];

        let re = Regex::new(r"^(\w+)(?:\(([^)]+)\))?:").unwrap();
        if let Some(caps) = re.captures(header) {
            let commit_type = &caps[1];
            if !valid_types.contains(&commit_type) {
                return RuleResult {
                    errors: vec![format!(
                        "Invalid type \"{}\". Must be one of: {}",
                        commit_type,
                        valid_types.join(", ")
                    )],
                    warnings: vec![],
                };
            }
        } else {
            return RuleResult {
                errors: vec!["Commit message must start with type:".to_string()],
                warnings: vec![],
            };
        }

        RuleResult {
            errors: vec![],
            warnings: vec![],
        }
    }
}

impl CommitRule for ScopeEnumRule {
    fn validate(&self, header: &str, _body: &[String]) -> RuleResult {
        let re = Regex::new(r"^(\w+)(?:\(([^)]+)\))?:").unwrap();
        if let Some(caps) = re.captures(header) {
            if let Some(scope) = caps.get(2) {
                let scope = scope.as_str();
                if scope.len() > 20 {
                    return RuleResult {
                        errors: vec![],
                        warnings: vec!["Scope should be 20 characters or less".to_string()],
                    };
                }
            }
        }

        RuleResult {
            errors: vec![],
            warnings: vec![],
        }
    }
}

impl CommitRule for SubjectLengthRule {
    fn validate(&self, header: &str, _body: &[String]) -> RuleResult {
        let re = Regex::new(r"^[^:]+:\s*(.+)").unwrap();
        if let Some(caps) = re.captures(header) {
            let subject = &caps[1];
            if subject.len() < 10 {
                return RuleResult {
                    errors: vec!["Subject must be at least 10 characters long".to_string()],
                    warnings: vec![],
                };
            }
            if subject.len() > 50 {
                return RuleResult {
                    errors: vec![],
                    warnings: vec!["Subject should be 50 characters or less".to_string()],
                };
            }
        }

        RuleResult {
            errors: vec![],
            warnings: vec![],
        }
    }
}

impl CommitRule for CaseRule {
    fn validate(&self, header: &str, _body: &[String]) -> RuleResult {
        let re = Regex::new(r"^[^:]+:\s*(.+)").unwrap();
        if let Some(caps) = re.captures(header) {
            let subject = &caps[1];
            if !subject.is_empty() && subject.chars().next().unwrap().is_uppercase() {
                return RuleResult {
                    errors: vec!["Subject must start with lowercase letter".to_string()],
                    warnings: vec![],
                };
            }
            if subject.ends_with('.') {
                return RuleResult {
                    errors: vec!["Subject must not end with period".to_string()],
                    warnings: vec![],
                };
            }
        }

        RuleResult {
            errors: vec![],
            warnings: vec![],
        }
    }
}

impl CommitRule for EmptyLineRule {
    fn validate(&self, _header: &str, body: &[String]) -> RuleResult {
        if !body.is_empty() && !body[0].is_empty() {
            return RuleResult {
                errors: vec![],
                warnings: vec!["Body must be separated from header by empty line".to_string()],
            };
        }

        RuleResult {
            errors: vec![],
            warnings: vec![],
        }
    }
}

impl CommitRule for FooterFormatRule {
    fn validate(&self, _header: &str, body: &[String]) -> RuleResult {
        let mut warnings = Vec::new();

        for line in body {
            if line.starts_with("BREAKING CHANGE:") {
                if line.len() < 20 {
                    warnings.push("Breaking change description should be more detailed".to_string());
                }
                continue;
            }

            if Regex::new(r"^(Closes|Fixes|Resolves):\s*#?\d+").unwrap().is_match(line) {
                continue;
            }

            if line.contains(':') && !line.is_empty() {
                let parts: Vec<&str> = line.splitn(2, ':').collect();
                if parts.len() == 2 {
                    let key = parts[0].trim();
                    let value = parts[1].trim();
                    if key.len() < 3 || value.len() < 3 {
                        warnings.push(format!("Footer line \"{}\" should have more descriptive content", line));
                    }
                }
            }
        }

        RuleResult {
            errors: vec![],
            warnings,
        }
    }
}

#[napi]
pub fn lint_commit_message(commit_message: String) -> napi::Result<()> {
    let linter = CommitLinter::new();
    let result = linter.lint(commit_message);

    if !result.valid {
        eprintln!("❌ Commit message validation failed:");
        for error in &result.errors {
            eprintln!("  - {}", error);
        }
        if !result.warnings.is_empty() {
            eprintln!("\n⚠️  Warnings:");
            for warning in &result.warnings {
                eprintln!("  - {}", warning);
            }
        }
        return Err(napi::Error::new(napi::Status::GenericFailure, "Commit message validation failed"));
    }

    if !result.warnings.is_empty() {
        eprintln!("⚠️  Commit message warnings:");
        for warning in &result.warnings {
            eprintln!("  - {}", warning);
        }
    }

    println!("✅ Commit message is valid! (Score: {}/100)", result.score);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_type_enum_rule() {
        let rule = TypeEnumRule;
        let result = rule.validate("feat: add new feature", &[]);
        assert!(result.errors.is_empty());

        let result = rule.validate("invalid: add new feature", &[]);
        assert!(!result.errors.is_empty());
    }

    #[test]
    fn test_subject_length_rule() {
        let rule = SubjectLengthRule;
        let result = rule.validate("feat: add new feature", &[]);
        assert!(result.errors.is_empty());

        let result = rule.validate("feat: short", &[]);
        assert!(!result.errors.is_empty());
    }

    #[test]
    fn test_case_rule() {
        let rule = CaseRule;
        let result = rule.validate("feat: add new feature", &[]);
        assert!(result.errors.is_empty());

        let result = rule.validate("feat: Add new feature", &[]);
        assert!(!result.errors.is_empty());
    }

    #[test]
    fn test_commit_linter() {
        let linter = CommitLinter::new();
        let result = linter.lint("feat: add new feature".to_string());
        assert!(result.valid);
        assert_eq!(result.score, 100);

        let result = linter.lint("invalid commit message".to_string());
        assert!(!result.valid);
        assert!(result.score < 100);
    }
}