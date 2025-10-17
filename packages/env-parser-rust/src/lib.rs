use napi_derive::napi;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use url::Url;

#[napi]
pub struct EnvParser;

#[napi]
#[derive(Serialize, Deserialize)]
pub struct ValidationResult {
    pub valid: bool,
    pub errors: Vec<String>,
    pub data: HashMap<String, serde_json::Value>,
}

#[napi]
#[derive(Serialize, Deserialize)]
pub struct Validator {
    pub validator_type: String,
    pub required: Option<bool>,
    pub default_value: Option<serde_json::Value>,
    pub min: Option<f64>,
    pub max: Option<f64>,
    pub pattern: Option<String>,
}

#[napi]
impl EnvParser {
    #[napi]
    pub fn load(path: Option<String>) -> HashMap<String, String> {
        let env_path = path.unwrap_or_else(|| ".env".to_string());
        Self::parse_file(&env_path)
    }

    #[napi]
    pub fn parse(content: String) -> HashMap<String, String> {
        Self::parse_content(&content)
    }

    #[napi]
    pub fn validate(schema: serde_json::Value) -> ValidationResult {
        // Parse the schema from JSON
        let schema_map: HashMap<String, Validator> = serde_json::from_value(schema)
            .unwrap_or_else(|_| HashMap::new());
        Self::validate_schema(&schema_map)
    }

    fn parse_file(path: &str) -> HashMap<String, String> {
        if !Path::new(path).exists() {
            return HashMap::new();
        }

        match fs::read_to_string(path) {
            Ok(content) => Self::parse_content(&content),
            Err(_) => HashMap::new(),
        }
    }

    fn parse_content(content: &str) -> HashMap<String, String> {
        let mut env = HashMap::new();
        let lines: Vec<&str> = content.lines().collect();

        for line in lines {
            let trimmed = line.trim();
            
            // Skip empty lines and comments
            if trimmed.is_empty() || trimmed.starts_with('#') {
                continue;
            }

            if let Some((key, value)) = Self::parse_line(trimmed) {
                let expanded_value = Self::expand_variables(&value, &env);
                env.insert(key, expanded_value);
            }
        }

        env
    }

    fn parse_line(line: &str) -> Option<(String, String)> {
        if let Some(equal_pos) = line.find('=') {
            let key = line[..equal_pos].trim().to_string();
            let value = line[equal_pos + 1..].trim().to_string();
            
            if key.is_empty() {
                return None;
            }

            // Remove quotes if present
            let value = if (value.starts_with('"') && value.ends_with('"')) ||
                        (value.starts_with('\'') && value.ends_with('\'')) {
                value[1..value.len() - 1].to_string()
            } else {
                value
            };

            Some((key, value))
        } else {
            None
        }
    }

    fn expand_variables(value: &str, env: &HashMap<String, String>) -> String {
        let re = Regex::new(r"\$\{([^}]+)\}").unwrap();
        let mut result = value.to_string();

        for caps in re.captures_iter(value) {
            let full_match = &caps[0];
            let var_name = &caps[1];

            let replacement = if let Some(val) = env.get(var_name) {
                val.clone()
            } else if let Ok(val) = std::env::var(var_name) {
                val
            } else {
                continue;
            };

            result = result.replace(full_match, &replacement);
        }

        result
    }

    fn validate_schema(schema: &HashMap<String, Validator>) -> ValidationResult {
        let mut errors = Vec::new();
        let mut data = HashMap::new();

        for (key, validator) in schema {
            let value = std::env::var(key).ok();

            if validator.required.unwrap_or(false) && value.is_none() {
                errors.push(format!("Required environment variable '{}' is missing", key));
                continue;
            }

            let value = value.unwrap_or_else(|| {
                validator.default_value.as_ref()
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string()
            });

            if value.is_empty() && !validator.required.unwrap_or(false) {
                if let Some(default) = &validator.default_value {
                    data.insert(key.clone(), default.clone());
                }
                continue;
            }

            match Self::validate_value(&value, validator) {
                Ok(parsed_value) => {
                    data.insert(key.clone(), parsed_value);
                }
                Err(error) => {
                    errors.push(format!("Validation error for '{}': {}", key, error));
                }
            }
        }

        ValidationResult {
            valid: errors.is_empty(),
            errors,
            data,
        }
    }

    fn validate_value(value: &str, validator: &Validator) -> Result<serde_json::Value, String> {
        match validator.validator_type.as_str() {
            "string" => {
                if let Some(min) = validator.min {
                    if value.len() < min as usize {
                        return Err(format!("String must be at least {} characters long", min));
                    }
                }
                if let Some(max) = validator.max {
                    if value.len() > max as usize {
                        return Err(format!("String must be at most {} characters long", max));
                    }
                }
                if let Some(pattern) = &validator.pattern {
                    let re = Regex::new(pattern)
                        .map_err(|e| format!("Invalid regex pattern: {}", e))?;
                    if !re.is_match(value) {
                        return Err("String does not match required pattern".to_string());
                    }
                }
                Ok(serde_json::Value::String(value.to_string()))
            }
            "number" => {
                let num: f64 = value.parse()
                    .map_err(|_| "Value must be a valid number".to_string())?;
                
                if let Some(min) = validator.min {
                    if num < min {
                        return Err(format!("Number must be at least {}", min));
                    }
                }
                if let Some(max) = validator.max {
                    if num > max {
                        return Err(format!("Number must be at most {}", max));
                    }
                }
                Ok(serde_json::Value::Number(serde_json::Number::from_f64(num).unwrap()))
            }
            "boolean" => {
                let bool_val = match value.to_lowercase().as_str() {
                    "true" | "1" | "yes" | "on" => true,
                    "false" | "0" | "no" | "off" => false,
                    _ => return Err("Value must be a boolean (true/false, 1/0, yes/no, on/off)".to_string()),
                };
                Ok(serde_json::Value::Bool(bool_val))
            }
            "url" => {
                Url::parse(value)
                    .map_err(|_| "Value must be a valid URL".to_string())?;
                Ok(serde_json::Value::String(value.to_string()))
            }
            _ => Err(format!("Unknown validator type: {}", validator.validator_type)),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn test_parse_content() {
        let content = r#"
# This is a comment
FOO=bar
BAZ="quoted value"
EMPTY=
# Another comment
MULTILINE="line1\nline2"
"#;
        
        let result = EnvParser::parse_content(content);
        assert_eq!(result.get("FOO"), Some(&"bar".to_string()));
        assert_eq!(result.get("BAZ"), Some(&"quoted value".to_string()));
        assert_eq!(result.get("EMPTY"), Some(&"".to_string()));
        assert_eq!(result.get("MULTILINE"), Some(&"line1\nline2".to_string()));
    }

    #[test]
    fn test_parse_line() {
        let (key, value) = EnvParser::parse_line("FOO=bar").unwrap();
        assert_eq!(key, "FOO");
        assert_eq!(value, "bar");
    }

    #[test]
    fn test_parse_line_with_quotes() {
        let (key, value) = EnvParser::parse_line("FOO=\"quoted value\"").unwrap();
        assert_eq!(key, "FOO");
        assert_eq!(value, "quoted value");
    }

    #[test]
    fn test_expand_variables() {
        let mut env = HashMap::new();
        env.insert("FOO".to_string(), "bar".to_string());
        env.insert("BAZ".to_string(), "qux".to_string());
        
        let result = EnvParser::expand_variables("Hello ${FOO} and ${BAZ}", &env);
        assert_eq!(result, "Hello bar and qux");
    }

    #[test]
    fn test_validate_schema() {
        let mut schema = HashMap::new();
        schema.insert("PORT".to_string(), Validator {
            validator_type: "number".to_string(),
            required: Some(true),
            default_value: None,
            min: Some(1.0),
            max: Some(65535.0),
            pattern: None,
        });
        
        std::env::set_var("PORT", "8080");
        let result = EnvParser::validate(schema);
        assert!(result.valid);
        assert_eq!(result.data.get("PORT").unwrap().as_f64().unwrap(), 8080.0);
    }
}