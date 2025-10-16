/**
 * Synapse Compiler CLI
 * Command-line interface for the Synapse TypeScript compiler
 */

use anyhow::Result;
use clap::{Parser, Subcommand};
use console::style;
use std::path::{Path, PathBuf};
use synapse_compiler::{CompilerConfig, SynapseCompiler};

#[derive(Parser)]
#[command(name = "synapse-compiler")]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Compile a TypeScript file
    Compile {
        /// Input file path
        #[arg(value_name = "FILE")]
        input: PathBuf,

        /// Output file path
        #[arg(short, long)]
        output: Option<PathBuf>,

        /// Enable minification
        #[arg(short, long)]
        minify: bool,

        /// Disable source maps
        #[arg(long)]
        no_source_maps: bool,
    },

    /// Compile multiple files using quantum parallel processing
    Quantum {
        /// Input directory or file patterns
        #[arg(value_name = "PATHS")]
        inputs: Vec<PathBuf>,

        /// Output directory
        #[arg(short, long)]
        output_dir: Option<PathBuf>,

        /// Maximum parallel threads
        #[arg(long)]
        max_threads: Option<usize>,

        /// Enable quantum entanglement
        #[arg(long)]
        enable_entanglement: bool,

        /// Quantum error correction level (0-3)
        #[arg(long, default_value = "2")]
        error_correction: u8,
    },

    /// Show version information
    Version,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Compile { input, output, minify, no_source_maps }) => {
            compile_file(input, output.as_deref(), *minify, !*no_source_maps).await?;
        }
        Some(Commands::Quantum { inputs, output_dir, max_threads, enable_entanglement, error_correction }) => {
            quantum_compile(inputs, output_dir.as_deref(), *max_threads, *enable_entanglement, *error_correction).await?;
        }
        Some(Commands::Version) | None => {
            show_version();
        }
    }

    Ok(())
}

async fn compile_file(
    input: &PathBuf,
    output: Option<&Path>,
    minify: bool,
    source_maps: bool,
) -> Result<()> {
    println!("{} Compiling: {}", style("🔨").cyan(), input.display());

    let config = CompilerConfig {
        minify,
        source_maps,
        target: "es2022".to_string(),
        quantum_mode: false,
        max_parallel_threads: None,
    };

    let compiler = SynapseCompiler::new(config)?;
    let result = compiler.compile_file(input)?;

    if result.success {
        if let Some(output_path) = output {
            std::fs::write(output_path, &result.output)?;
            println!("{} Output written to: {}", style("✅").green(), output_path.display());
        } else {
            println!("{}", result.output);
        }

        if !result.warnings.is_empty() {
            println!("\n{} Warnings:", style("⚠️").yellow());
            for warning in &result.warnings {
                println!("  {}", warning);
            }
        }
    } else {
        println!("{} Compilation failed:", style("❌").red());
        for error in &result.errors {
            println!("  {}", error);
        }
        std::process::exit(1);
    }

    Ok(())
}

async fn quantum_compile(
    inputs: &[PathBuf],
    output_dir: Option<&Path>,
    max_threads: Option<usize>,
    _enable_entanglement: bool,
    _error_correction: u8,
) -> Result<()> {
    println!("{} Initializing Quantum Compilation Mode...", style("⚛️").cyan());
    
    let config = CompilerConfig {
        minify: false,
        source_maps: true,
        target: "es2022".to_string(),
        quantum_mode: true,
        max_parallel_threads: max_threads,
    };

    let mut compiler = SynapseCompiler::new(config)?;
    compiler.enable_quantum_mode();

    // Collect all TypeScript files
    let mut file_paths = Vec::new();
    for input in inputs {
        if input.is_dir() {
            collect_ts_files(input, &mut file_paths)?;
        } else if input.extension().and_then(|s| s.to_str()) == Some("ts") {
            file_paths.push(input.clone());
        }
    }

    if file_paths.is_empty() {
        println!("{} No TypeScript files found", style("⚠️").yellow());
        return Ok(());
    }

    println!("{} Found {} TypeScript files", style("📁").blue(), file_paths.len());

    // Perform quantum compilation
    let results = compiler.compile_files_quantum(file_paths).await?;

    // Write results
    let mut success_count = 0;
    for (file_path, result) in &results {
        if result.success {
            success_count += 1;
            
            if let Some(output_dir) = output_dir {
                let output_path = output_dir.join(file_path.file_name().unwrap());
                std::fs::create_dir_all(output_dir)?;
                std::fs::write(&output_path, &result.output)?;
                println!("{} Compiled: {} -> {}", 
                    style("✅").green(), 
                    file_path.display(), 
                    output_path.display()
                );
            } else {
                println!("{} Compiled: {}", style("✅").green(), file_path.display());
                println!("{}", result.output);
            }
        } else {
            println!("{} Failed: {}", style("❌").red(), file_path.display());
            for error in &result.errors {
                println!("  {}", error);
            }
        }
    }

    println!("\n{} Quantum Compilation Complete!", style("✨").cyan());
    println!("{} Success: {}/{} files", style("📊").blue(), success_count, results.len());
    
    if success_count < results.len() {
        std::process::exit(1);
    }

    Ok(())
}

fn collect_ts_files(dir: &Path, files: &mut Vec<PathBuf>) -> Result<()> {
    for entry in std::fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        
        if path.is_dir() {
            collect_ts_files(&path, files)?;
        } else if path.extension().and_then(|s| s.to_str()) == Some("ts") {
            files.push(path);
        }
    }
    Ok(())
}

fn show_version() {
    println!("{} Synapse Compiler v{}",
        style("🚀").cyan(),
        SynapseCompiler::version()
    );
    println!("High-performance TypeScript compiler and bundler");
    println!("Built with Rust for maximum performance");
    println!("{} Quantum Compilation Mode Available", style("⚛️").magenta());
}
