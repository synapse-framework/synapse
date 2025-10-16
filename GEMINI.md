# Synapse Framework

## Project Overview

This is the Synapse Framework, a zero-dependency, TypeScript-first full-stack web framework. It's designed for high performance, utilizing Rust for its compiler and bundler, and Node.js for the development experience. The framework enforces strict best practices, including mandatory Test-Driven Development (TDD).

The project is structured as a monorepo with multiple packages under the `packages/` directory. The core components include a runtime engine, a Rust-based TypeScript compiler, a universal router, state management, a testing framework, and a plugin system.

## Building and Running

The project uses a `Makefile` to streamline the development process. Here are the key commands:

*   **Build the entire framework:**
    ```bash
    make build
    ```
*   **Build only the Rust compiler:**
    ```bash
    make build-rust
    ```
*   **Build only the Node.js code:**
    ```bash
    make build-node
    ```
*   **Run all tests:**
    ```bash
    make test
    ```
*   **Start the development server:**
    ```bash
    make dev
    ```
*   **Install the framework globally:**
    ```bash
    make install
    ```

## Development Conventions

*   **TypeScript:** The project uses TypeScript with strict compiler options.
*   **Testing:** Test-Driven Development (TDD) is mandatory. The framework has its own testing framework, and the `synapse test` command is used to run tests.
*   **Linting:** The project has a custom linting system with strict rules. The `synapse lint` command is used to lint the codebase.
*   **Code Style:** The project has a code formatter. The `synapse format` command is used to format the code.

## TODO

The `TODO.md` file outlines the following key areas for development:

*   **Immediate Fixes:** Critical bug fixes for TypeScript compilation and the build system.
*   **Rust CLI Features:** Implementation of features like performance profiling, cloud deployment, team collaboration, security scanning, and more.
*   **TypeScript Wrapper:** Completion of the TypeScript wrapper and implementation of all command handlers.
*   **Testing and Quality Assurance:** Addition of comprehensive tests and improvement of code quality.
*   **Packaging and Distribution:** Finalization of the build and distribution pipeline.