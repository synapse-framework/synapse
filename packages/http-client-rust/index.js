const { loadBinding } = require('@node-rs/helper')

/**
 * Load the native addon for @snps/http-client-rust
 * This provides blazing fast HTTP client functionality built with Rust
 */
module.exports = loadBinding(__dirname, 'snps-http-client-rust', '@snps/http-client-rust')