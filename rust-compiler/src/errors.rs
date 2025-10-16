/**
 * Error handling system for the Synapse compiler
 * Provides comprehensive error types and handling
 */

use std::fmt;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use thiserror::Error;

/// Main compiler error type
#[derive(Debug, Error, Clone, Serialize, Deserialize)]
pub enum CompilerError {
    #[error("Parse error: {message}")]
    ParseError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Type error: {message}")]
    TypeError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Semantic error: {message}")]
    SemanticError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Transform error: {message}")]
    TransformError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Codegen error: {message}")]
    CodegenError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Bundle error: {message}")]
    BundleError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Cache error: {message}")]
    CacheError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("File system error: {message}")]
    FileSystemError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Configuration error: {message}")]
    ConfigurationError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Plugin error: {message}")]
    PluginError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Validation error: {message}")]
    ValidationError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Performance error: {message}")]
    PerformanceError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Security error: {message}")]
    SecurityError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Accessibility error: {message}")]
    AccessibilityError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Testing error: {message}")]
    TestingError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Linting error: {message}")]
    LintingError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Formatting error: {message}")]
    FormattingError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
    
    #[error("Internal error: {message}")]
    InternalError {
        message: String,
        file: String,
        line: u32,
        column: u32,
    },
}

impl CompilerError {
    /// Create a new compiler error
    pub fn new(code: &str, message: &str, file: &str, line: u32, column: u32) -> Self {
        match code {
            "PARSE_ERROR" => Self::ParseError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "TYPE_ERROR" => Self::TypeError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "SEMANTIC_ERROR" => Self::SemanticError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "TRANSFORM_ERROR" => Self::TransformError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "CODEGEN_ERROR" => Self::CodegenError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "BUNDLE_ERROR" => Self::BundleError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "CACHE_ERROR" => Self::CacheError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "FILE_SYSTEM_ERROR" => Self::FileSystemError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "CONFIGURATION_ERROR" => Self::ConfigurationError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "PLUGIN_ERROR" => Self::PluginError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "VALIDATION_ERROR" => Self::ValidationError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "PERFORMANCE_ERROR" => Self::PerformanceError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "SECURITY_ERROR" => Self::SecurityError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "ACCESSIBILITY_ERROR" => Self::AccessibilityError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "TESTING_ERROR" => Self::TestingError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "LINTING_ERROR" => Self::LintingError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            "FORMATTING_ERROR" => Self::FormattingError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
            _ => Self::InternalError {
                message: message.to_string(),
                file: file.to_string(),
                line,
                column,
            },
        }
    }
    
    /// Get error code
    pub fn code(&self) -> &'static str {
        match self {
            Self::ParseError { .. } => "PARSE_ERROR",
            Self::TypeError { .. } => "TYPE_ERROR",
            Self::SemanticError { .. } => "SEMANTIC_ERROR",
            Self::TransformError { .. } => "TRANSFORM_ERROR",
            Self::CodegenError { .. } => "CODEGEN_ERROR",
            Self::BundleError { .. } => "BUNDLE_ERROR",
            Self::CacheError { .. } => "CACHE_ERROR",
            Self::FileSystemError { .. } => "FILE_SYSTEM_ERROR",
            Self::ConfigurationError { .. } => "CONFIGURATION_ERROR",
            Self::PluginError { .. } => "PLUGIN_ERROR",
            Self::ValidationError { .. } => "VALIDATION_ERROR",
            Self::PerformanceError { .. } => "PERFORMANCE_ERROR",
            Self::SecurityError { .. } => "SECURITY_ERROR",
            Self::AccessibilityError { .. } => "ACCESSIBILITY_ERROR",
            Self::TestingError { .. } => "TESTING_ERROR",
            Self::LintingError { .. } => "LINTING_ERROR",
            Self::FormattingError { .. } => "FORMATTING_ERROR",
            Self::InternalError { .. } => "INTERNAL_ERROR",
        }
    }
    
    /// Get error message
    pub fn message(&self) -> &str {
        match self {
            Self::ParseError { message, .. } => message,
            Self::TypeError { message, .. } => message,
            Self::SemanticError { message, .. } => message,
            Self::TransformError { message, .. } => message,
            Self::CodegenError { message, .. } => message,
            Self::BundleError { message, .. } => message,
            Self::CacheError { message, .. } => message,
            Self::FileSystemError { message, .. } => message,
            Self::ConfigurationError { message, .. } => message,
            Self::PluginError { message, .. } => message,
            Self::ValidationError { message, .. } => message,
            Self::PerformanceError { message, .. } => message,
            Self::SecurityError { message, .. } => message,
            Self::AccessibilityError { message, .. } => message,
            Self::TestingError { message, .. } => message,
            Self::LintingError { message, .. } => message,
            Self::FormattingError { message, .. } => message,
            Self::InternalError { message, .. } => message,
        }
    }
    
    /// Get file path
    pub fn file(&self) -> &str {
        match self {
            Self::ParseError { file, .. } => file,
            Self::TypeError { file, .. } => file,
            Self::SemanticError { file, .. } => file,
            Self::TransformError { file, .. } => file,
            Self::CodegenError { file, .. } => file,
            Self::BundleError { file, .. } => file,
            Self::CacheError { file, .. } => file,
            Self::FileSystemError { file, .. } => file,
            Self::ConfigurationError { file, .. } => file,
            Self::PluginError { file, .. } => file,
            Self::ValidationError { file, .. } => file,
            Self::PerformanceError { file, .. } => file,
            Self::SecurityError { file, .. } => file,
            Self::AccessibilityError { file, .. } => file,
            Self::TestingError { file, .. } => file,
            Self::LintingError { file, .. } => file,
            Self::FormattingError { file, .. } => file,
            Self::InternalError { file, .. } => file,
        }
    }
    
    /// Get line number
    pub fn line(&self) -> u32 {
        match self {
            Self::ParseError { line, .. } => *line,
            Self::TypeError { line, .. } => *line,
            Self::SemanticError { line, .. } => *line,
            Self::TransformError { line, .. } => *line,
            Self::CodegenError { line, .. } => *line,
            Self::BundleError { line, .. } => *line,
            Self::CacheError { line, .. } => *line,
            Self::FileSystemError { line, .. } => *line,
            Self::ConfigurationError { line, .. } => *line,
            Self::PluginError { line, .. } => *line,
            Self::ValidationError { line, .. } => *line,
            Self::PerformanceError { line, .. } => *line,
            Self::SecurityError { line, .. } => *line,
            Self::AccessibilityError { line, .. } => *line,
            Self::TestingError { line, .. } => *line,
            Self::LintingError { line, .. } => *line,
            Self::FormattingError { line, .. } => *line,
            Self::InternalError { line, .. } => *line,
        }
    }
    
    /// Get column number
    pub fn column(&self) -> u32 {
        match self {
            Self::ParseError { column, .. } => *column,
            Self::TypeError { column, .. } => *column,
            Self::SemanticError { column, .. } => *column,
            Self::TransformError { column, .. } => *column,
            Self::CodegenError { column, .. } => *column,
            Self::BundleError { column, .. } => *column,
            Self::CacheError { column, .. } => *column,
            Self::FileSystemError { column, .. } => *column,
            Self::ConfigurationError { column, .. } => *column,
            Self::PluginError { column, .. } => *column,
            Self::ValidationError { column, .. } => *column,
            Self::PerformanceError { column, .. } => *column,
            Self::SecurityError { column, .. } => *column,
            Self::AccessibilityError { column, .. } => *column,
            Self::TestingError { column, .. } => *column,
            Self::LintingError { column, .. } => *column,
            Self::FormattingError { column, .. } => *column,
            Self::InternalError { column, .. } => *column,
        }
    }
    
    /// Get error severity
    pub fn severity(&self) -> ErrorSeverity {
        match self {
            Self::ParseError { .. } => ErrorSeverity::Error,
            Self::TypeError { .. } => ErrorSeverity::Error,
            Self::SemanticError { .. } => ErrorSeverity::Error,
            Self::TransformError { .. } => ErrorSeverity::Error,
            Self::CodegenError { .. } => ErrorSeverity::Error,
            Self::BundleError { .. } => ErrorSeverity::Error,
            Self::CacheError { .. } => ErrorSeverity::Warning,
            Self::FileSystemError { .. } => ErrorSeverity::Error,
            Self::ConfigurationError { .. } => ErrorSeverity::Error,
            Self::PluginError { .. } => ErrorSeverity::Warning,
            Self::ValidationError { .. } => ErrorSeverity::Error,
            Self::PerformanceError { .. } => ErrorSeverity::Warning,
            Self::SecurityError { .. } => ErrorSeverity::Error,
            Self::AccessibilityError { .. } => ErrorSeverity::Warning,
            Self::TestingError { .. } => ErrorSeverity::Error,
            Self::LintingError { .. } => ErrorSeverity::Warning,
            Self::FormattingError { .. } => ErrorSeverity::Info,
            Self::InternalError { .. } => ErrorSeverity::Error,
        }
    }
    
    /// Check if error is fixable
    pub fn is_fixable(&self) -> bool {
        match self {
            Self::ParseError { .. } => false,
            Self::TypeError { .. } => true,
            Self::SemanticError { .. } => true,
            Self::TransformError { .. } => false,
            Self::CodegenError { .. } => false,
            Self::BundleError { .. } => false,
            Self::CacheError { .. } => true,
            Self::FileSystemError { .. } => false,
            Self::ConfigurationError { .. } => true,
            Self::PluginError { .. } => true,
            Self::ValidationError { .. } => true,
            Self::PerformanceError { .. } => true,
            Self::SecurityError { .. } => true,
            Self::AccessibilityError { .. } => true,
            Self::TestingError { .. } => true,
            Self::LintingError { .. } => true,
            Self::FormattingError { .. } => true,
            Self::InternalError { .. } => false,
        }
    }
    
    /// Get error category
    pub fn category(&self) -> ErrorCategory {
        match self {
            Self::ParseError { .. } => ErrorCategory::Syntax,
            Self::TypeError { .. } => ErrorCategory::Type,
            Self::SemanticError { .. } => ErrorCategory::Semantic,
            Self::TransformError { .. } => ErrorCategory::Transform,
            Self::CodegenError { .. } => ErrorCategory::Codegen,
            Self::BundleError { .. } => ErrorCategory::Bundle,
            Self::CacheError { .. } => ErrorCategory::System,
            Self::FileSystemError { .. } => ErrorCategory::System,
            Self::ConfigurationError { .. } => ErrorCategory::Configuration,
            Self::PluginError { .. } => ErrorCategory::Plugin,
            Self::ValidationError { .. } => ErrorCategory::Validation,
            Self::PerformanceError { .. } => ErrorCategory::Performance,
            Self::SecurityError { .. } => ErrorCategory::Security,
            Self::AccessibilityError { .. } => ErrorCategory::Accessibility,
            Self::TestingError { .. } => ErrorCategory::Testing,
            Self::LintingError { .. } => ErrorCategory::Linting,
            Self::FormattingError { .. } => ErrorCategory::Formatting,
            Self::InternalError { .. } => ErrorCategory::Internal,
        }
    }
    
    /// Get error documentation URL
    pub fn documentation_url(&self) -> Option<&'static str> {
        match self {
            Self::ParseError { .. } => Some("https://docs.synapse.dev/errors/parse-error"),
            Self::TypeError { .. } => Some("https://docs.synapse.dev/errors/type-error"),
            Self::SemanticError { .. } => Some("https://docs.synapse.dev/errors/semantic-error"),
            Self::TransformError { .. } => Some("https://docs.synapse.dev/errors/transform-error"),
            Self::CodegenError { .. } => Some("https://docs.synapse.dev/errors/codegen-error"),
            Self::BundleError { .. } => Some("https://docs.synapse.dev/errors/bundle-error"),
            Self::CacheError { .. } => Some("https://docs.synapse.dev/errors/cache-error"),
            Self::FileSystemError { .. } => Some("https://docs.synapse.dev/errors/file-system-error"),
            Self::ConfigurationError { .. } => Some("https://docs.synapse.dev/errors/configuration-error"),
            Self::PluginError { .. } => Some("https://docs.synapse.dev/errors/plugin-error"),
            Self::ValidationError { .. } => Some("https://docs.synapse.dev/errors/validation-error"),
            Self::PerformanceError { .. } => Some("https://docs.synapse.dev/errors/performance-error"),
            Self::SecurityError { .. } => Some("https://docs.synapse.dev/errors/security-error"),
            Self::AccessibilityError { .. } => Some("https://docs.synapse.dev/errors/accessibility-error"),
            Self::TestingError { .. } => Some("https://docs.synapse.dev/errors/testing-error"),
            Self::LintingError { .. } => Some("https://docs.synapse.dev/errors/linting-error"),
            Self::FormattingError { .. } => Some("https://docs.synapse.dev/errors/formatting-error"),
            Self::InternalError { .. } => Some("https://docs.synapse.dev/errors/internal-error"),
        }
    }
    
    /// Get error suggestions
    pub fn suggestions(&self) -> Vec<String> {
        match self {
            Self::ParseError { .. } => vec![
                "Check syntax and fix any syntax errors".to_string(),
                "Ensure all brackets and braces are properly closed".to_string(),
                "Check for missing semicolons or commas".to_string(),
            ],
            Self::TypeError { .. } => vec![
                "Check type annotations and fix type mismatches".to_string(),
                "Ensure all variables are properly typed".to_string(),
                "Check for missing type imports".to_string(),
            ],
            Self::SemanticError { .. } => vec![
                "Check for undefined variables or functions".to_string(),
                "Ensure all imports are properly resolved".to_string(),
                "Check for circular dependencies".to_string(),
            ],
            Self::TransformError { .. } => vec![
                "Check transform configuration".to_string(),
                "Ensure all required plugins are installed".to_string(),
                "Check for transform conflicts".to_string(),
            ],
            Self::CodegenError { .. } => vec![
                "Check codegen configuration".to_string(),
                "Ensure all required dependencies are available".to_string(),
                "Check for codegen conflicts".to_string(),
            ],
            Self::BundleError { .. } => vec![
                "Check bundle configuration".to_string(),
                "Ensure all entry points are valid".to_string(),
                "Check for bundle conflicts".to_string(),
            ],
            Self::CacheError { .. } => vec![
                "Clear cache and try again".to_string(),
                "Check cache permissions".to_string(),
                "Check cache configuration".to_string(),
            ],
            Self::FileSystemError { .. } => vec![
                "Check file permissions".to_string(),
                "Ensure file exists and is accessible".to_string(),
                "Check disk space".to_string(),
            ],
            Self::ConfigurationError { .. } => vec![
                "Check configuration file syntax".to_string(),
                "Ensure all required options are set".to_string(),
                "Check configuration validation".to_string(),
            ],
            Self::PluginError { .. } => vec![
                "Check plugin configuration".to_string(),
                "Ensure plugin is properly installed".to_string(),
                "Check plugin compatibility".to_string(),
            ],
            Self::ValidationError { .. } => vec![
                "Check validation rules".to_string(),
                "Ensure all required fields are present".to_string(),
                "Check validation configuration".to_string(),
            ],
            Self::PerformanceError { .. } => vec![
                "Check performance configuration".to_string(),
                "Optimize code for better performance".to_string(),
                "Check performance budgets".to_string(),
            ],
            Self::SecurityError { .. } => vec![
                "Check security configuration".to_string(),
                "Review security best practices".to_string(),
                "Check for security vulnerabilities".to_string(),
            ],
            Self::AccessibilityError { .. } => vec![
                "Check accessibility guidelines".to_string(),
                "Ensure proper ARIA attributes".to_string(),
                "Check color contrast and keyboard navigation".to_string(),
            ],
            Self::TestingError { .. } => vec![
                "Check test configuration".to_string(),
                "Ensure all tests are properly written".to_string(),
                "Check test dependencies".to_string(),
            ],
            Self::LintingError { .. } => vec![
                "Check linting rules".to_string(),
                "Fix linting violations".to_string(),
                "Check linting configuration".to_string(),
            ],
            Self::FormattingError { .. } => vec![
                "Check formatting rules".to_string(),
                "Fix formatting violations".to_string(),
                "Check formatting configuration".to_string(),
            ],
            Self::InternalError { .. } => vec![
                "Report this as a bug".to_string(),
                "Check system requirements".to_string(),
                "Try restarting the compiler".to_string(),
            ],
        }
    }
}

/// Error severity levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ErrorSeverity {
    Error,
    Warning,
    Info,
    Debug,
}

impl fmt::Display for ErrorSeverity {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Error => write!(f, "error"),
            Self::Warning => write!(f, "warning"),
            Self::Info => write!(f, "info"),
            Self::Debug => write!(f, "debug"),
        }
    }
}

/// Error categories
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ErrorCategory {
    Syntax,
    Type,
    Semantic,
    Transform,
    Codegen,
    Bundle,
    System,
    Configuration,
    Plugin,
    Validation,
    Performance,
    Security,
    Accessibility,
    Testing,
    Linting,
    Formatting,
    Internal,
}

impl fmt::Display for ErrorCategory {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Syntax => write!(f, "syntax"),
            Self::Type => write!(f, "type"),
            Self::Semantic => write!(f, "semantic"),
            Self::Transform => write!(f, "transform"),
            Self::Codegen => write!(f, "codegen"),
            Self::Bundle => write!(f, "bundle"),
            Self::System => write!(f, "system"),
            Self::Configuration => write!(f, "configuration"),
            Self::Plugin => write!(f, "plugin"),
            Self::Validation => write!(f, "validation"),
            Self::Performance => write!(f, "performance"),
            Self::Security => write!(f, "security"),
            Self::Accessibility => write!(f, "accessibility"),
            Self::Testing => write!(f, "testing"),
            Self::Linting => write!(f, "linting"),
            Self::Formatting => write!(f, "formatting"),
            Self::Internal => write!(f, "internal"),
        }
    }
}

/// Error context information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorContext {
    /// Source code around the error
    pub source: String,
    
    /// Line number where error occurs
    pub line: u32,
    
    /// Column number where error occurs
    pub column: u32,
    
    /// Number of lines before error to show
    pub before_lines: u32,
    
    /// Number of lines after error to show
    pub after_lines: u32,
    
    /// Error highlight range
    pub highlight_range: Option<(u32, u32)>,
    
    /// Additional context information
    pub additional_info: HashMap<String, String>,
}

impl ErrorContext {
    /// Create new error context
    pub fn new(source: String, line: u32, column: u32) -> Self {
        Self {
            source,
            line,
            column,
            before_lines: 3,
            after_lines: 3,
            highlight_range: None,
            additional_info: HashMap::new(),
        }
    }
    
    /// Set highlight range
    pub fn with_highlight_range(mut self, start: u32, end: u32) -> Self {
        self.highlight_range = Some((start, end));
        self
    }
    
    /// Add additional information
    pub fn with_info(mut self, key: String, value: String) -> Self {
        self.additional_info.insert(key, value);
        self
    }
}

/// Error collection for managing multiple errors
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorCollection {
    /// List of errors
    pub errors: Vec<CompilerError>,
    
    /// Error count by severity
    pub error_counts: HashMap<ErrorSeverity, usize>,
    
    /// Error count by category
    pub category_counts: HashMap<ErrorCategory, usize>,
    
    /// Total error count
    pub total_count: usize,
}

impl ErrorCollection {
    /// Create new error collection
    pub fn new() -> Self {
        Self {
            errors: Vec::new(),
            error_counts: HashMap::new(),
            category_counts: HashMap::new(),
            total_count: 0,
        }
    }
    
    /// Add error to collection
    pub fn add(&mut self, error: CompilerError) {
        let severity = error.severity();
        let category = error.category();
        
        self.errors.push(error);
        self.total_count += 1;
        
        *self.error_counts.entry(severity).or_insert(0) += 1;
        *self.category_counts.entry(category).or_insert(0) += 1;
    }
    
    /// Add multiple errors to collection
    pub fn add_all(&mut self, errors: Vec<CompilerError>) {
        for error in errors {
            self.add(error);
        }
    }
    
    /// Get errors by severity
    pub fn get_by_severity(&self, severity: ErrorSeverity) -> Vec<&CompilerError> {
        self.errors
            .iter()
            .filter(|error| error.severity() == severity)
            .collect()
    }
    
    /// Get errors by category
    pub fn get_by_category(&self, category: ErrorCategory) -> Vec<&CompilerError> {
        self.errors
            .iter()
            .filter(|error| error.category() == category)
            .collect()
    }
    
    /// Get errors by file
    pub fn get_by_file(&self, file: &str) -> Vec<&CompilerError> {
        self.errors
            .iter()
            .filter(|error| error.file() == file)
            .collect()
    }
    
    /// Check if collection has errors
    pub fn has_errors(&self) -> bool {
        self.error_counts.get(&ErrorSeverity::Error).unwrap_or(&0) > &0
    }
    
    /// Check if collection has warnings
    pub fn has_warnings(&self) -> bool {
        self.error_counts.get(&ErrorSeverity::Warning).unwrap_or(&0) > &0
    }
    
    /// Get error summary
    pub fn summary(&self) -> ErrorSummary {
        ErrorSummary {
            total: self.total_count,
            errors: *self.error_counts.get(&ErrorSeverity::Error).unwrap_or(&0),
            warnings: *self.error_counts.get(&ErrorSeverity::Warning).unwrap_or(&0),
            info: *self.error_counts.get(&ErrorSeverity::Info).unwrap_or(&0),
            debug: *self.error_counts.get(&ErrorSeverity::Debug).unwrap_or(&0),
        }
    }
    
    /// Clear all errors
    pub fn clear(&mut self) {
        self.errors.clear();
        self.error_counts.clear();
        self.category_counts.clear();
        self.total_count = 0;
    }
}

/// Error summary information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorSummary {
    pub total: usize,
    pub errors: usize,
    pub warnings: usize,
    pub info: usize,
    pub debug: usize,
}

impl fmt::Display for ErrorSummary {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{} total ({} errors, {} warnings, {} info, {} debug)",
            self.total, self.errors, self.warnings, self.info, self.debug
        )
    }
}

/// Error formatter for displaying errors
pub struct ErrorFormatter {
    /// Whether to use colors
    pub use_colors: bool,
    
    /// Whether to show context
    pub show_context: bool,
    
    /// Whether to show suggestions
    pub show_suggestions: bool,
    
    /// Whether to show documentation links
    pub show_documentation: bool,
}

impl ErrorFormatter {
    /// Create new error formatter
    pub fn new() -> Self {
        Self {
            use_colors: true,
            show_context: true,
            show_suggestions: true,
            show_documentation: true,
        }
    }
    
    /// Format error for display
    pub fn format_error(&self, error: &CompilerError) -> String {
        let mut output = String::new();
        
        // Error header
        output.push_str(&format!(
            "{} {}: {}\n",
            self.format_severity(error.severity()),
            error.code(),
            error.message()
        ));
        
        // File and location
        output.push_str(&format!(
            "  --> {}:{}:{}\n",
            error.file(),
            error.line(),
            error.column()
        ));
        
        // Context (if enabled)
        if self.show_context {
            // This would show source code context
            output.push_str("  |\n");
            output.push_str("  | Context would be shown here\n");
            output.push_str("  |\n");
        }
        
        // Suggestions (if enabled)
        if self.show_suggestions && !error.suggestions().is_empty() {
            output.push_str("  Suggestions:\n");
            for suggestion in error.suggestions() {
                output.push_str(&format!("    - {}\n", suggestion));
            }
        }
        
        // Documentation link (if enabled)
        if self.show_documentation {
            if let Some(url) = error.documentation_url() {
                output.push_str(&format!("  Documentation: {}\n", url));
            }
        }
        
        output
    }
    
    /// Format error severity
    fn format_severity(&self, severity: ErrorSeverity) -> String {
        if self.use_colors {
            match severity {
                ErrorSeverity::Error => "🔴 ERROR".to_string(),
                ErrorSeverity::Warning => "🟡 WARNING".to_string(),
                ErrorSeverity::Info => "🔵 INFO".to_string(),
                ErrorSeverity::Debug => "⚪ DEBUG".to_string(),
            }
        } else {
            format!("{:?}", severity)
        }
    }
}

impl Default for ErrorFormatter {
    fn default() -> Self {
        Self::new()
    }
}

/// Error handler for managing errors during compilation
pub struct ErrorHandler {
    /// Error collection
    collection: ErrorCollection,
    
    /// Error formatter
    formatter: ErrorFormatter,
    
    /// Whether to stop on first error
    stop_on_first_error: bool,
    
    /// Whether to show errors immediately
    show_immediately: bool,
}

impl ErrorHandler {
    /// Create new error handler
    pub fn new() -> Self {
        Self {
            collection: ErrorCollection::new(),
            formatter: ErrorFormatter::new(),
            stop_on_first_error: false,
            show_immediately: true,
        }
    }
    
    /// Add error to handler
    pub fn add_error(&mut self, error: CompilerError) -> Result<(), CompilerError> {
        if self.show_immediately {
            eprintln!("{}", self.formatter.format_error(&error));
        }
        
        self.collection.add(error);
        
        if self.stop_on_first_error && self.collection.has_errors() {
            return Err(self.collection.errors.last().unwrap().clone());
        }
        
        Ok(())
    }
    
    /// Add multiple errors to handler
    pub fn add_errors(&mut self, errors: Vec<CompilerError>) -> Result<(), CompilerError> {
        for error in errors {
            self.add_error(error)?;
        }
        Ok(())
    }
    
    /// Get error collection
    pub fn collection(&self) -> &ErrorCollection {
        &self.collection
    }
    
    /// Check if handler has errors
    pub fn has_errors(&self) -> bool {
        self.collection.has_errors()
    }
    
    /// Check if handler has warnings
    pub fn has_warnings(&self) -> bool {
        self.collection.has_warnings()
    }
    
    /// Get error summary
    pub fn summary(&self) -> ErrorSummary {
        self.collection.summary()
    }
    
    /// Clear all errors
    pub fn clear(&mut self) {
        self.collection.clear();
    }
}

impl Default for ErrorHandler {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compiler_error_creation() {
        let error = CompilerError::new(
            "PARSE_ERROR",
            "Unexpected token",
            "test.ts",
            10,
            5,
        );
        
        assert_eq!(error.code(), "PARSE_ERROR");
        assert_eq!(error.message(), "Unexpected token");
        assert_eq!(error.file(), "test.ts");
        assert_eq!(error.line(), 10);
        assert_eq!(error.column(), 5);
        assert_eq!(error.severity(), ErrorSeverity::Error);
        assert_eq!(error.category(), ErrorCategory::Syntax);
        assert!(!error.is_fixable());
    }
    
    #[test]
    fn test_error_collection() {
        let mut collection = ErrorCollection::new();
        
        let error1 = CompilerError::new("PARSE_ERROR", "Error 1", "file1.ts", 1, 1);
        let error2 = CompilerError::new("TYPE_ERROR", "Error 2", "file2.ts", 2, 2);
        
        collection.add(error1);
        collection.add(error2);
        
        assert_eq!(collection.total_count, 2);
        assert!(collection.has_errors());
        assert!(!collection.has_warnings());
        
        let summary = collection.summary();
        assert_eq!(summary.total, 2);
        assert_eq!(summary.errors, 2);
        assert_eq!(summary.warnings, 0);
    }
    
    #[test]
    fn test_error_handler() {
        let mut handler = ErrorHandler::new();
        
        let error = CompilerError::new("PARSE_ERROR", "Test error", "test.ts", 1, 1);
        let result = handler.add_error(error);
        
        assert!(result.is_ok());
        assert!(handler.has_errors());
        assert!(!handler.has_warnings());
    }
}