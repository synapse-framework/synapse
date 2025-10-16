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

fn show_version() {
    println!("{} Synapse Compiler v{}",
        style("🚀").cyan(),
        SynapseCompiler::version()
    );
    println!("High-performance TypeScript compiler and bundler");
    println!("Built with Rust for maximum performance");
}
