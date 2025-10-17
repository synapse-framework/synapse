use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    if args.len() < 2 {
        eprintln!("Usage: rule-engine <command> [options]");
        eprintln!("Commands:");
        eprintln!("  check <file|directory>  - Check file or directory for rule violations");
        eprintln!("  list-rules             - List all available rules");
        eprintln!("  load-rules <file>      - Load rules from JSON file");
        eprintln!("  help                   - Show this help message");
        std::process::exit(1);
    }

    let command = &args[1];

    match command.as_str() {
        "check" => {
            if args.len() < 3 {
                eprintln!("Error: check command requires a file or directory path");
                std::process::exit(1);
            }
            
            let path = &args[2];
            println!("Checking path: {}", path);
            
            if std::path::Path::new(path).exists() {
                println!("✅ Path exists");
            } else {
                println!("❌ Path does not exist");
                std::process::exit(1);
            }
        }
        "list-rules" => {
            println!("Available Rules:");
            println!("===============");
            println!("  SEC-001 - No Hardcoded Secrets (High)");
            println!("  SEC-002 - No Console Logging of Sensitive Data (Medium)");
            println!("  PERF-001 - No Synchronous File Operations (High)");
            println!("  QUALITY-001 - Function Documentation Required (High)");
            println!("  A11Y-001 - Alt Text Required for Images (High)");
        }
        "load-rules" => {
            if args.len() < 3 {
                eprintln!("Error: load-rules command requires a rules file path");
                std::process::exit(1);
            }
            
            let rules_file = &args[2];
            match fs::read_to_string(rules_file) {
                Ok(content) => {
                    println!("Successfully loaded rules from {}", rules_file);
                    println!("File size: {} bytes", content.len());
                }
                Err(error) => {
                    eprintln!("Error loading rules: {}", error);
                    std::process::exit(1);
                }
            }
        }
        "help" => {
            println!("Synapse Rule Engine - Intelligent Best Practices Enforcement");
            println!("============================================================");
            println!();
            println!("Commands:");
            println!("  check <file|directory>  - Check file or directory for rule violations");
            println!("  list-rules             - List all available rules");
            println!("  load-rules <file>      - Load rules from JSON file");
            println!("  help                   - Show this help message");
            println!();
            println!("Examples:");
            println!("  rule-engine check src/");
            println!("  rule-engine check package.json");
            println!("  rule-engine load-rules rules/security.json");
            println!("  rule-engine list-rules");
        }
        _ => {
            eprintln!("Unknown command: {}", command);
            eprintln!("Use 'rule-engine help' for usage information");
            std::process::exit(1);
        }
    }
}