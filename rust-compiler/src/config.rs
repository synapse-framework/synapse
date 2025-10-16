/**
 * Compiler configuration system
 * Handles all compiler options and settings
 */

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use anyhow::Result;

use crate::types::*;

/// Main compiler configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompilerConfig {
    /// Target language (TypeScript or JavaScript)
    pub target_language: TargetLanguage,
    
    /// Target ECMAScript version
    pub target_es_version: EsVersion,
    
    /// Module format
    pub module_format: ModuleFormat,
    
    /// Output directory
    pub output_dir: PathBuf,
    
    /// Source directory
    pub source_dir: PathBuf,
    
    /// Cache directory
    pub cache_dir: PathBuf,
    
    /// Whether to minify output
    pub minify: bool,
    
    /// Whether to generate source maps
    pub source_maps: bool,
    
    /// Whether to enable tree shaking
    pub tree_shaking: bool,
    
    /// Whether to enable code splitting
    pub code_splitting: bool,
    
    /// Chunk size limit for code splitting
    pub chunk_size_limit: usize,
    
    /// Asset inline limit (in bytes)
    pub asset_inline_limit: usize,
    
    /// TypeScript configuration
    pub typescript: TypeScriptConfig,
    
    /// React configuration
    pub react: ReactConfig,
    
    /// Bundling configuration
    pub bundling: BundlingConfig,
    
    /// Optimization configuration
    pub optimization: OptimizationConfig,
    
    /// Linting configuration
    pub linting: LintingConfig,
    
    /// Testing configuration
    pub testing: TestingConfig,
    
    /// Plugin configuration
    pub plugins: Vec<PluginConfig>,
    
    /// Environment variables
    pub env: HashMap<String, String>,
    
    /// Strict mode settings
    pub strict: StrictConfig,
    
    /// Performance settings
    pub performance: PerformanceConfig,
}

impl Default for CompilerConfig {
    fn default() -> Self {
        Self {
            target_language: TargetLanguage::JavaScript,
            target_es_version: EsVersion::Es2022,
            module_format: ModuleFormat::ESNext,
            output_dir: PathBuf::from("dist"),
            source_dir: PathBuf::from("src"),
            cache_dir: PathBuf::from(".synapse-cache"),
            minify: false,
            source_maps: true,
            tree_shaking: true,
            code_splitting: true,
            chunk_size_limit: 244 * 1024, // 244KB
            asset_inline_limit: 4096, // 4KB
            typescript: TypeScriptConfig::default(),
            react: ReactConfig::default(),
            bundling: BundlingConfig::default(),
            optimization: OptimizationConfig::default(),
            linting: LintingConfig::default(),
            testing: TestingConfig::default(),
            plugins: vec![],
            env: HashMap::new(),
            strict: StrictConfig::default(),
            performance: PerformanceConfig::default(),
        }
    }
}

impl CompilerConfig {
    /// Load configuration from file
    pub fn from_file(path: &PathBuf) -> Result<Self> {
        let content = std::fs::read_to_string(path)?;
        let config: CompilerConfig = toml::from_str(&content)?;
        Ok(config)
    }
    
    /// Save configuration to file
    pub fn save_to_file(&self, path: &PathBuf) -> Result<()> {
        let content = toml::to_string_pretty(self)?;
        std::fs::write(path, content)?;
        Ok(())
    }
    
    /// Merge with another configuration
    pub fn merge(&mut self, other: CompilerConfig) {
        // Merge configurations, with other taking precedence
        if other.target_language != TargetLanguage::JavaScript {
            self.target_language = other.target_language;
        }
        if other.target_es_version != EsVersion::Es2022 {
            self.target_es_version = other.target_es_version;
        }
        if other.module_format != ModuleFormat::ESNext {
            self.module_format = other.module_format;
        }
        if other.output_dir != PathBuf::from("dist") {
            self.output_dir = other.output_dir;
        }
        if other.source_dir != PathBuf::from("src") {
            self.source_dir = other.source_dir;
        }
        if other.cache_dir != PathBuf::from(".synapse-cache") {
            self.cache_dir = other.cache_dir;
        }
        
        self.minify = other.minify;
        self.source_maps = other.source_maps;
        self.tree_shaking = other.tree_shaking;
        self.code_splitting = other.code_splitting;
        self.chunk_size_limit = other.chunk_size_limit;
        self.asset_inline_limit = other.asset_inline_limit;
        
        self.typescript.merge(other.typescript);
        self.react.merge(other.react);
        self.bundling.merge(other.bundling);
        self.optimization.merge(other.optimization);
        self.linting.merge(other.linting);
        self.testing.merge(other.testing);
        
        self.plugins.extend(other.plugins);
        self.env.extend(other.env);
        self.strict.merge(other.strict);
        self.performance.merge(other.performance);
    }
    
    /// Validate configuration
    pub fn validate(&self) -> Result<()> {
        // Validate paths exist
        if !self.source_dir.exists() {
            return Err(anyhow::anyhow!("Source directory does not exist: {:?}", self.source_dir));
        }
        
        // Validate chunk size limit
        if self.chunk_size_limit == 0 {
            return Err(anyhow::anyhow!("Chunk size limit must be greater than 0"));
        }
        
        // Validate asset inline limit
        if self.asset_inline_limit == 0 {
            return Err(anyhow::anyhow!("Asset inline limit must be greater than 0"));
        }
        
        // Validate TypeScript configuration
        self.typescript.validate()?;
        
        // Validate React configuration
        self.react.validate()?;
        
        // Validate bundling configuration
        self.bundling.validate()?;
        
        // Validate optimization configuration
        self.optimization.validate()?;
        
        // Validate linting configuration
        self.linting.validate()?;
        
        // Validate testing configuration
        self.testing.validate()?;
        
        // Validate strict configuration
        self.strict.validate()?;
        
        // Validate performance configuration
        self.performance.validate()?;
        
        Ok(())
    }
}

/// TypeScript configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TypeScriptConfig {
    /// Whether to enable strict mode
    pub strict: bool,
    
    /// Whether to enable noImplicitAny
    pub no_implicit_any: bool,
    
    /// Whether to enable strictNullChecks
    pub strict_null_checks: bool,
    
    /// Whether to enable strictFunctionTypes
    pub strict_function_types: bool,
    
    /// Whether to enable strictBindCallApply
    pub strict_bind_call_apply: bool,
    
    /// Whether to enable strictPropertyInitialization
    pub strict_property_initialization: bool,
    
    /// Whether to enable noImplicitReturns
    pub no_implicit_returns: bool,
    
    /// Whether to enable noFallthroughCasesInSwitch
    pub no_fallthrough_cases_in_switch: bool,
    
    /// Whether to enable noUncheckedIndexedAccess
    pub no_unchecked_indexed_access: bool,
    
    /// Whether to enable exactOptionalPropertyTypes
    pub exact_optional_property_types: bool,
    
    /// Whether to enable noImplicitOverride
    pub no_implicit_override: bool,
    
    /// Whether to enable noPropertyAccessFromIndexSignature
    pub no_property_access_from_index_signature: bool,
    
    /// Whether to enable allowUnusedLabels
    pub allow_unused_labels: bool,
    
    /// Whether to enable allowUnreachableCode
    pub allow_unreachable_code: bool,
    
    /// Whether to enable noImplicitThis
    pub no_implicit_this: bool,
    
    /// Whether to enable useUnknownInCatchVariables
    pub use_unknown_in_catch_variables: bool,
    
    /// Whether to enable forceConsistentCasingInFileNames
    pub force_consistent_casing_in_file_names: bool,
    
    /// Whether to enable skipLibCheck
    pub skip_lib_check: bool,
    
    /// Whether to enable declaration
    pub declaration: bool,
    
    /// Whether to enable declarationMap
    pub declaration_map: bool,
    
    /// Whether to enable removeComments
    pub remove_comments: bool,
    
    /// Whether to enable importHelpers
    pub import_helpers: bool,
    
    /// Whether to enable downlevelIteration
    pub downlevel_iteration: bool,
    
    /// Whether to enable experimentalDecorators
    pub experimental_decorators: bool,
    
    /// Whether to enable emitDecoratorMetadata
    pub emit_decorator_metadata: bool,
    
    /// Whether to enable resolveJsonModule
    pub resolve_json_module: bool,
    
    /// Whether to enable isolatedModules
    pub isolated_modules: bool,
    
    /// Whether to enable verbatimModuleSyntax
    pub verbatim_module_syntax: bool,
    
    /// Whether to enable allowSyntheticDefaultImports
    pub allow_synthetic_default_imports: bool,
    
    /// Whether to enable esModuleInterop
    pub es_module_interop: bool,
    
    /// Base URL for module resolution
    pub base_url: Option<PathBuf>,
    
    /// Path mapping for module resolution
    pub paths: HashMap<String, Vec<String>>,
    
    /// Type roots for module resolution
    pub type_roots: Vec<PathBuf>,
    
    /// Types to include
    pub types: Vec<String>,
    
    /// Lib files to include
    pub lib: Vec<String>,
}

impl Default for TypeScriptConfig {
    fn default() -> Self {
        Self {
            strict: true,
            no_implicit_any: true,
            strict_null_checks: true,
            strict_function_types: true,
            strict_bind_call_apply: true,
            strict_property_initialization: true,
            no_implicit_returns: true,
            no_fallthrough_cases_in_switch: true,
            no_unchecked_indexed_access: true,
            exact_optional_property_types: true,
            no_implicit_override: true,
            no_property_access_from_index_signature: true,
            allow_unused_labels: false,
            allow_unreachable_code: false,
            no_implicit_this: true,
            use_unknown_in_catch_variables: true,
            force_consistent_casing_in_file_names: true,
            skip_lib_check: true,
            declaration: true,
            declaration_map: true,
            remove_comments: false,
            import_helpers: false,
            downlevel_iteration: true,
            experimental_decorators: true,
            emit_decorator_metadata: true,
            resolve_json_module: true,
            isolated_modules: true,
            verbatim_module_syntax: true,
            allow_synthetic_default_imports: true,
            es_module_interop: true,
            base_url: None,
            paths: HashMap::new(),
            type_roots: vec![],
            types: vec![],
            lib: vec![
                "ES2022".to_string(),
                "DOM".to_string(),
                "DOM.Iterable".to_string(),
            ],
        }
    }
}

impl TypeScriptConfig {
    fn merge(&mut self, other: TypeScriptConfig) {
        self.strict = other.strict;
        self.no_implicit_any = other.no_implicit_any;
        self.strict_null_checks = other.strict_null_checks;
        self.strict_function_types = other.strict_function_types;
        self.strict_bind_call_apply = other.strict_bind_call_apply;
        self.strict_property_initialization = other.strict_property_initialization;
        self.no_implicit_returns = other.no_implicit_returns;
        self.no_fallthrough_cases_in_switch = other.no_fallthrough_cases_in_switch;
        self.no_unchecked_indexed_access = other.no_unchecked_indexed_access;
        self.exact_optional_property_types = other.exact_optional_property_types;
        self.no_implicit_override = other.no_implicit_override;
        self.no_property_access_from_index_signature = other.no_property_access_from_index_signature;
        self.allow_unused_labels = other.allow_unused_labels;
        self.allow_unreachable_code = other.allow_unreachable_code;
        self.no_implicit_this = other.no_implicit_this;
        self.use_unknown_in_catch_variables = other.use_unknown_in_catch_variables;
        self.force_consistent_casing_in_file_names = other.force_consistent_casing_in_file_names;
        self.skip_lib_check = other.skip_lib_check;
        self.declaration = other.declaration;
        self.declaration_map = other.declaration_map;
        self.remove_comments = other.remove_comments;
        self.import_helpers = other.import_helpers;
        self.downlevel_iteration = other.downlevel_iteration;
        self.experimental_decorators = other.experimental_decorators;
        self.emit_decorator_metadata = other.emit_decorator_metadata;
        self.resolve_json_module = other.resolve_json_module;
        self.isolated_modules = other.isolated_modules;
        self.verbatim_module_syntax = other.verbatim_module_syntax;
        self.allow_synthetic_default_imports = other.allow_synthetic_default_imports;
        self.es_module_interop = other.es_module_interop;
        
        if let Some(base_url) = other.base_url {
            self.base_url = Some(base_url);
        }
        
        self.paths.extend(other.paths);
        self.type_roots.extend(other.type_roots);
        self.types.extend(other.types);
        self.lib.extend(other.lib);
    }
    
    fn validate(&self) -> Result<()> {
        // Validate that if strict is enabled, all strict options are enabled
        if self.strict {
            if !self.no_implicit_any {
                return Err(anyhow::anyhow!("noImplicitAny must be enabled when strict mode is enabled"));
            }
            if !self.strict_null_checks {
                return Err(anyhow::anyhow!("strictNullChecks must be enabled when strict mode is enabled"));
            }
            if !self.strict_function_types {
                return Err(anyhow::anyhow!("strictFunctionTypes must be enabled when strict mode is enabled"));
            }
            if !self.strict_bind_call_apply {
                return Err(anyhow::anyhow!("strictBindCallApply must be enabled when strict mode is enabled"));
            }
            if !self.strict_property_initialization {
                return Err(anyhow::anyhow!("strictPropertyInitialization must be enabled when strict mode is enabled"));
            }
            if !self.no_implicit_returns {
                return Err(anyhow::anyhow!("noImplicitReturns must be enabled when strict mode is enabled"));
            }
            if !self.no_fallthrough_cases_in_switch {
                return Err(anyhow::anyhow!("noFallthroughCasesInSwitch must be enabled when strict mode is enabled"));
            }
            if !self.no_unchecked_indexed_access {
                return Err(anyhow::anyhow!("noUncheckedIndexedAccess must be enabled when strict mode is enabled"));
            }
            if !self.exact_optional_property_types {
                return Err(anyhow::anyhow!("exactOptionalPropertyTypes must be enabled when strict mode is enabled"));
            }
            if !self.no_implicit_override {
                return Err(anyhow::anyhow!("noImplicitOverride must be enabled when strict mode is enabled"));
            }
            if !self.no_property_access_from_index_signature {
                return Err(anyhow::anyhow!("noPropertyAccessFromIndexSignature must be enabled when strict mode is enabled"));
            }
            if self.allow_unused_labels {
                return Err(anyhow::anyhow!("allowUnusedLabels must be disabled when strict mode is enabled"));
            }
            if self.allow_unreachable_code {
                return Err(anyhow::anyhow!("allowUnreachableCode must be disabled when strict mode is enabled"));
            }
            if !self.no_implicit_this {
                return Err(anyhow::anyhow!("noImplicitThis must be enabled when strict mode is enabled"));
            }
            if !self.use_unknown_in_catch_variables {
                return Err(anyhow::anyhow!("useUnknownInCatchVariables must be enabled when strict mode is enabled"));
            }
            if !self.force_consistent_casing_in_file_names {
                return Err(anyhow::anyhow!("forceConsistentCasingInFileNames must be enabled when strict mode is enabled"));
            }
        }
        
        Ok(())
    }
}

/// React configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReactConfig {
    /// Whether React is enabled
    pub enabled: bool,
    
    /// JSX runtime
    pub jsx_runtime: JsxRuntime,
    
    /// JSX pragma
    pub jsx_pragma: Option<String>,
    
    /// JSX fragment
    pub jsx_fragment: Option<String>,
    
    /// JSX import source
    pub jsx_import_source: Option<String>,
    
    /// Whether to enable React refresh
    pub refresh: bool,
    
    /// Whether to enable React dev tools
    pub dev_tools: bool,
}

impl Default for ReactConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            jsx_runtime: JsxRuntime::Automatic,
            jsx_pragma: None,
            jsx_fragment: None,
            jsx_import_source: None,
            refresh: true,
            dev_tools: true,
        }
    }
}

impl ReactConfig {
    fn merge(&mut self, other: ReactConfig) {
        self.enabled = other.enabled;
        self.jsx_runtime = other.jsx_runtime;
        self.jsx_pragma = other.jsx_pragma;
        self.jsx_fragment = other.jsx_fragment;
        self.jsx_import_source = other.jsx_import_source;
        self.refresh = other.refresh;
        self.dev_tools = other.dev_tools;
    }
    
    fn validate(&self) -> Result<()> {
        if self.enabled {
            match self.jsx_runtime {
                JsxRuntime::Classic => {
                    if self.jsx_pragma.is_none() {
                        return Err(anyhow::anyhow!("jsxPragma must be specified when using classic JSX runtime"));
                    }
                }
                JsxRuntime::Automatic => {
                    if self.jsx_import_source.is_none() {
                        return Err(anyhow::anyhow!("jsxImportSource must be specified when using automatic JSX runtime"));
                    }
                }
            }
        }
        Ok(())
    }
}

/// Bundling configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BundlingConfig {
    /// Entry points
    pub entry_points: Vec<PathBuf>,
    
    /// Output format
    pub output_format: OutputFormat,
    
    /// Whether to enable code splitting
    pub code_splitting: bool,
    
    /// Chunk size limit
    pub chunk_size_limit: usize,
    
    /// Whether to enable tree shaking
    pub tree_shaking: bool,
    
    /// Whether to enable minification
    pub minify: bool,
    
    /// Whether to enable source maps
    pub source_maps: bool,
    
    /// Asset inline limit
    pub asset_inline_limit: usize,
    
    /// External dependencies
    pub externals: Vec<String>,
    
    /// Whether to enable bundle analysis
    pub analyze: bool,
    
    /// Whether to enable bundle splitting
    pub split_chunks: bool,
    
    /// Chunk splitting strategy
    pub chunk_splitting_strategy: ChunkSplittingStrategy,
}

impl Default for BundlingConfig {
    fn default() -> Self {
        Self {
            entry_points: vec![],
            output_format: OutputFormat::ESModule,
            code_splitting: true,
            chunk_size_limit: 244 * 1024, // 244KB
            tree_shaking: true,
            minify: false,
            source_maps: true,
            asset_inline_limit: 4096, // 4KB
            externals: vec![],
            analyze: false,
            split_chunks: true,
            chunk_splitting_strategy: ChunkSplittingStrategy::SizeBased,
        }
    }
}

impl BundlingConfig {
    fn merge(&mut self, other: BundlingConfig) {
        if !other.entry_points.is_empty() {
            self.entry_points = other.entry_points;
        }
        self.output_format = other.output_format;
        self.code_splitting = other.code_splitting;
        self.chunk_size_limit = other.chunk_size_limit;
        self.tree_shaking = other.tree_shaking;
        self.minify = other.minify;
        self.source_maps = other.source_maps;
        self.asset_inline_limit = other.asset_inline_limit;
        self.externals.extend(other.externals);
        self.analyze = other.analyze;
        self.split_chunks = other.split_chunks;
        self.chunk_splitting_strategy = other.chunk_splitting_strategy;
    }
    
    fn validate(&self) -> Result<()> {
        if self.entry_points.is_empty() {
            return Err(anyhow::anyhow!("At least one entry point must be specified"));
        }
        
        if self.chunk_size_limit == 0 {
            return Err(anyhow::anyhow!("Chunk size limit must be greater than 0"));
        }
        
        if self.asset_inline_limit == 0 {
            return Err(anyhow::anyhow!("Asset inline limit must be greater than 0"));
        }
        
        Ok(())
    }
}

/// Optimization configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OptimizationConfig {
    /// Whether to enable dead code elimination
    pub dead_code_elimination: bool,
    
    /// Whether to enable constant folding
    pub constant_folding: bool,
    
    /// Whether to enable function inlining
    pub function_inlining: bool,
    
    /// Whether to enable loop unrolling
    pub loop_unrolling: bool,
    
    /// Whether to enable variable hoisting
    pub variable_hoisting: bool,
    
    /// Whether to enable property access optimization
    pub property_access_optimization: bool,
    
    /// Whether to enable array access optimization
    pub array_access_optimization: bool,
    
    /// Whether to enable string optimization
    pub string_optimization: bool,
    
    /// Whether to enable number optimization
    pub number_optimization: bool,
    
    /// Whether to enable boolean optimization
    pub boolean_optimization: bool,
    
    /// Whether to enable object optimization
    pub object_optimization: bool,
    
    /// Whether to enable function optimization
    pub function_optimization: bool,
    
    /// Whether to enable class optimization
    pub class_optimization: bool,
    
    /// Whether to enable module optimization
    pub module_optimization: bool,
    
    /// Whether to enable async optimization
    pub async_optimization: bool,
    
    /// Whether to enable generator optimization
    pub generator_optimization: bool,
    
    /// Whether to enable arrow function optimization
    pub arrow_function_optimization: bool,
    
    /// Whether to enable template literal optimization
    pub template_literal_optimization: bool,
    
    /// Whether to enable destructuring optimization
    pub destructuring_optimization: bool,
    
    /// Whether to enable spread optimization
    pub spread_optimization: bool,
    
    /// Whether to enable rest optimization
    pub rest_optimization: bool,
    
    /// Whether to enable optional chaining optimization
    pub optional_chaining_optimization: bool,
    
    /// Whether to enable nullish coalescing optimization
    pub nullish_coalescing_optimization: bool,
}

impl Default for OptimizationConfig {
    fn default() -> Self {
        Self {
            dead_code_elimination: true,
            constant_folding: true,
            function_inlining: true,
            loop_unrolling: false,
            variable_hoisting: true,
            property_access_optimization: true,
            array_access_optimization: true,
            string_optimization: true,
            number_optimization: true,
            boolean_optimization: true,
            object_optimization: true,
            function_optimization: true,
            class_optimization: true,
            module_optimization: true,
            async_optimization: true,
            generator_optimization: true,
            arrow_function_optimization: true,
            template_literal_optimization: true,
            destructuring_optimization: true,
            spread_optimization: true,
            rest_optimization: true,
            optional_chaining_optimization: true,
            nullish_coalescing_optimization: true,
        }
    }
}

impl OptimizationConfig {
    fn merge(&mut self, other: OptimizationConfig) {
        self.dead_code_elimination = other.dead_code_elimination;
        self.constant_folding = other.constant_folding;
        self.function_inlining = other.function_inlining;
        self.loop_unrolling = other.loop_unrolling;
        self.variable_hoisting = other.variable_hoisting;
        self.property_access_optimization = other.property_access_optimization;
        self.array_access_optimization = other.array_access_optimization;
        self.string_optimization = other.string_optimization;
        self.number_optimization = other.number_optimization;
        self.boolean_optimization = other.boolean_optimization;
        self.object_optimization = other.object_optimization;
        self.function_optimization = other.function_optimization;
        self.class_optimization = other.class_optimization;
        self.module_optimization = other.module_optimization;
        self.async_optimization = other.async_optimization;
        self.generator_optimization = other.generator_optimization;
        self.arrow_function_optimization = other.arrow_function_optimization;
        self.template_literal_optimization = other.template_literal_optimization;
        self.destructuring_optimization = other.destructuring_optimization;
        self.spread_optimization = other.spread_optimization;
        self.rest_optimization = other.rest_optimization;
        self.optional_chaining_optimization = other.optional_chaining_optimization;
        self.nullish_coalescing_optimization = other.nullish_coalescing_optimization;
    }
    
    fn validate(&self) -> Result<()> {
        // All optimization settings are valid by default
        Ok(())
    }
}

/// Linting configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LintingConfig {
    /// Whether linting is enabled
    pub enabled: bool,
    
    /// Linting rules
    pub rules: HashMap<String, RuleConfig>,
    
    /// Whether to enable auto-fix
    pub auto_fix: bool,
    
    /// Whether to enable format on save
    pub format_on_save: bool,
    
    /// Whether to enable strict mode
    pub strict_mode: bool,
    
    /// Whether to enable TDD enforcement
    pub tdd_enforcement: bool,
    
    /// Whether to enable performance linting
    pub performance_linting: bool,
    
    /// Whether to enable security linting
    pub security_linting: bool,
    
    /// Whether to enable accessibility linting
    pub accessibility_linting: bool,
    
    /// Whether to enable best practices linting
    pub best_practices_linting: bool,
}

impl Default for LintingConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            rules: HashMap::new(),
            auto_fix: true,
            format_on_save: true,
            strict_mode: true,
            tdd_enforcement: true,
            performance_linting: true,
            security_linting: true,
            accessibility_linting: true,
            best_practices_linting: true,
        }
    }
}

impl LintingConfig {
    fn merge(&mut self, other: LintingConfig) {
        self.enabled = other.enabled;
        self.rules.extend(other.rules);
        self.auto_fix = other.auto_fix;
        self.format_on_save = other.format_on_save;
        self.strict_mode = other.strict_mode;
        self.tdd_enforcement = other.tdd_enforcement;
        self.performance_linting = other.performance_linting;
        self.security_linting = other.security_linting;
        self.accessibility_linting = other.accessibility_linting;
        self.best_practices_linting = other.best_practices_linting;
    }
    
    fn validate(&self) -> Result<()> {
        if self.enabled && self.strict_mode && !self.tdd_enforcement {
            return Err(anyhow::anyhow!("TDD enforcement must be enabled when strict mode is enabled"));
        }
        Ok(())
    }
}

/// Testing configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestingConfig {
    /// Whether testing is enabled
    pub enabled: bool,
    
    /// Test directory
    pub test_dir: PathBuf,
    
    /// Test file patterns
    pub test_patterns: Vec<String>,
    
    /// Whether to enable parallel testing
    pub parallel: bool,
    
    /// Number of parallel test workers
    pub parallel_workers: usize,
    
    /// Test timeout in milliseconds
    pub timeout: u64,
    
    /// Whether to enable coverage
    pub coverage: bool,
    
    /// Coverage threshold
    pub coverage_threshold: f64,
    
    /// Coverage reporters
    pub coverage_reporters: Vec<CoverageReporter>,
    
    /// Whether to enable watch mode
    pub watch: bool,
    
    /// Whether to enable bail on first failure
    pub bail: bool,
    
    /// Whether to enable verbose output
    pub verbose: bool,
    
    /// Whether to enable silent mode
    pub silent: bool,
}

impl Default for TestingConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            test_dir: PathBuf::from("tests"),
            test_patterns: vec![
                "**/*.test.ts".to_string(),
                "**/*.test.tsx".to_string(),
                "**/*.spec.ts".to_string(),
                "**/*.spec.tsx".to_string(),
            ],
            parallel: true,
            parallel_workers: num_cpus::get(),
            timeout: 5000,
            coverage: true,
            coverage_threshold: 100.0,
            coverage_reporters: vec![
                CoverageReporter::Text,
                CoverageReporter::Html,
                CoverageReporter::Json,
            ],
            watch: false,
            bail: false,
            verbose: false,
            silent: false,
        }
    }
}

impl TestingConfig {
    fn merge(&mut self, other: TestingConfig) {
        self.enabled = other.enabled;
        if other.test_dir != PathBuf::from("tests") {
            self.test_dir = other.test_dir;
        }
        if !other.test_patterns.is_empty() {
            self.test_patterns = other.test_patterns;
        }
        self.parallel = other.parallel;
        self.parallel_workers = other.parallel_workers;
        self.timeout = other.timeout;
        self.coverage = other.coverage;
        self.coverage_threshold = other.coverage_threshold;
        self.coverage_reporters = other.coverage_reporters;
        self.watch = other.watch;
        self.bail = other.bail;
        self.verbose = other.verbose;
        self.silent = other.silent;
    }
    
    fn validate(&self) -> Result<()> {
        if self.enabled {
            if self.parallel_workers == 0 {
                return Err(anyhow::anyhow!("Parallel workers must be greater than 0"));
            }
            
            if self.timeout == 0 {
                return Err(anyhow::anyhow!("Timeout must be greater than 0"));
            }
            
            if self.coverage && (self.coverage_threshold < 0.0 || self.coverage_threshold > 100.0) {
                return Err(anyhow::anyhow!("Coverage threshold must be between 0 and 100"));
            }
        }
        Ok(())
    }
}

/// Plugin configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginConfig {
    /// Plugin name
    pub name: String,
    
    /// Plugin version
    pub version: String,
    
    /// Plugin options
    pub options: HashMap<String, serde_json::Value>,
    
    /// Whether plugin is enabled
    pub enabled: bool,
    
    /// Plugin priority
    pub priority: i32,
}

/// Strict configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StrictConfig {
    /// Whether strict mode is enabled
    pub enabled: bool,
    
    /// Whether to enforce TDD
    pub enforce_tdd: bool,
    
    /// Whether to enforce best practices
    pub enforce_best_practices: bool,
    
    /// Whether to enforce design patterns
    pub enforce_design_patterns: bool,
    
    /// Whether to enforce performance guidelines
    pub enforce_performance: bool,
    
    /// Whether to enforce security guidelines
    pub enforce_security: bool,
    
    /// Whether to enforce accessibility guidelines
    pub enforce_accessibility: bool,
    
    /// Whether to enforce code style
    pub enforce_code_style: bool,
    
    /// Whether to enforce documentation
    pub enforce_documentation: bool,
    
    /// Whether to enforce testing
    pub enforce_testing: bool,
    
    /// Whether to enforce linting
    pub enforce_linting: bool,
    
    /// Whether to enforce formatting
    pub enforce_formatting: bool,
}

impl Default for StrictConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            enforce_tdd: true,
            enforce_best_practices: true,
            enforce_design_patterns: true,
            enforce_performance: true,
            enforce_security: true,
            enforce_accessibility: true,
            enforce_code_style: true,
            enforce_documentation: true,
            enforce_testing: true,
            enforce_linting: true,
            enforce_formatting: true,
        }
    }
}

impl StrictConfig {
    fn merge(&mut self, other: StrictConfig) {
        self.enabled = other.enabled;
        self.enforce_tdd = other.enforce_tdd;
        self.enforce_best_practices = other.enforce_best_practices;
        self.enforce_design_patterns = other.enforce_design_patterns;
        self.enforce_performance = other.enforce_performance;
        self.enforce_security = other.enforce_security;
        self.enforce_accessibility = other.enforce_accessibility;
        self.enforce_code_style = other.enforce_code_style;
        self.enforce_documentation = other.enforce_documentation;
        self.enforce_testing = other.enforce_testing;
        self.enforce_linting = other.enforce_linting;
        self.enforce_formatting = other.enforce_formatting;
    }
    
    fn validate(&self) -> Result<()> {
        if self.enabled && !self.enforce_tdd {
            return Err(anyhow::anyhow!("TDD enforcement must be enabled when strict mode is enabled"));
        }
        Ok(())
    }
}

/// Performance configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceConfig {
    /// Whether performance monitoring is enabled
    pub enabled: bool,
    
    /// Whether to enable profiling
    pub profiling: bool,
    
    /// Whether to enable memory tracking
    pub memory_tracking: bool,
    
    /// Whether to enable CPU tracking
    pub cpu_tracking: bool,
    
    /// Whether to enable I/O tracking
    pub io_tracking: bool,
    
    /// Whether to enable network tracking
    pub network_tracking: bool,
    
    /// Whether to enable cache tracking
    pub cache_tracking: bool,
    
    /// Whether to enable bundle analysis
    pub bundle_analysis: bool,
    
    /// Whether to enable performance budgets
    pub performance_budgets: bool,
    
    /// Performance budget thresholds
    pub budget_thresholds: HashMap<String, u64>,
}

impl Default for PerformanceConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            profiling: true,
            memory_tracking: true,
            cpu_tracking: true,
            io_tracking: true,
            network_tracking: true,
            cache_tracking: true,
            bundle_analysis: true,
            performance_budgets: true,
            budget_thresholds: HashMap::new(),
        }
    }
}

impl PerformanceConfig {
    fn merge(&mut self, other: PerformanceConfig) {
        self.enabled = other.enabled;
        self.profiling = other.profiling;
        self.memory_tracking = other.memory_tracking;
        self.cpu_tracking = other.cpu_tracking;
        self.io_tracking = other.io_tracking;
        self.network_tracking = other.network_tracking;
        self.cache_tracking = other.cache_tracking;
        self.bundle_analysis = other.bundle_analysis;
        self.performance_budgets = other.performance_budgets;
        self.budget_thresholds.extend(other.budget_thresholds);
    }
    
    fn validate(&self) -> Result<()> {
        // All performance settings are valid by default
        Ok(())
    }
}

/// Rule configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RuleConfig {
    /// Rule severity
    pub severity: RuleSeverity,
    
    /// Rule options
    pub options: HashMap<String, serde_json::Value>,
    
    /// Whether rule is enabled
    pub enabled: bool,
}

/// Rule severity
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum RuleSeverity {
    Error,
    Warning,
    Info,
    Off,
}

/// JSX runtime
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum JsxRuntime {
    Classic,
    Automatic,
}

/// Output format
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum OutputFormat {
    ESNext,
    ESModule,
    CommonJS,
    AMD,
    UMD,
    SystemJS,
    IIFE,
}

/// Chunk splitting strategy
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum ChunkSplittingStrategy {
    SizeBased,
    DependencyBased,
    Manual,
}

/// Coverage reporter
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum CoverageReporter {
    Text,
    Html,
    Json,
    Lcov,
    Cobertura,
    Teamcity,
    Clover,
}

/// ECMAScript version
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum EsVersion {
    Es3,
    Es5,
    Es2015,
    Es2016,
    Es2017,
    Es2018,
    Es2019,
    Es2020,
    Es2021,
    Es2022,
}