const { loadBinding } = require('@node-rs/helper')

/**
 * Load the native addon for @snps/rule-engine-rust
 * This provides blazing fast rule processing and enforcement built with Rust
 */
module.exports = loadBinding(__dirname, 'snps-rule-engine-rust', '@snps/rule-engine-rust')