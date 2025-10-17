# 🚀 Synapse Framework Demo Applications

This repository contains comprehensive demonstration applications showcasing the full capabilities of the Synapse Framework.

## 📁 Project Structure

```
synapse-demo-app/
├── synapse-dashboard/          # Interactive dashboard demo
├── synapse-docs/              # Documentation website
├── .github/workflows/         # GitHub Actions workflows
└── README.md                  # This file
```

## 🎯 Demo Applications

### 1. Synapse Dashboard (`synapse-dashboard/`)
A comprehensive dashboard application demonstrating:
- **Core Framework Integration**: All 7 core components
- **UI Component Library**: Modern, responsive components
- **Rust Package Integration**: NAPI bindings and performance
- **Real-time Features**: Metrics, security scanning, AI optimization
- **State Management**: Reactive state with immutability
- **Routing**: Single-page application navigation

**Live Demo**: [View Dashboard](https://synapse-framework.github.io/synapse-dashboard-demo)

### 2. Synapse Documentation (`synapse-docs/`)
A full-featured documentation website built entirely with Synapse:
- **Interactive Navigation**: Search, breadcrumbs, sidebar
- **Comprehensive Content**: API reference, tutorials, examples
- **Modern UI**: Responsive design with dark/light themes
- **Code Examples**: Syntax highlighting and interactive demos
- **Performance**: Fast loading and smooth animations

**Live Docs**: [View Documentation](https://synapse-framework.github.io/synapse-docs)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

### Running the Demos

1. **Clone the repository**
   ```bash
   git clone https://github.com/synapse-framework/synapse-demo-app.git
   cd synapse-demo-app
   ```

2. **Run the Dashboard Demo**
   ```bash
   cd synapse-dashboard
   npm install
   npm run dev
   # Open http://localhost:3000
   ```

3. **Run the Documentation Site**
   ```bash
   cd synapse-docs
   npm install
   npm run dev
   # Open http://localhost:3000
   ```

## 🏗️ Building for Production

### Dashboard
```bash
cd synapse-dashboard
npm run build
npm run serve
```

### Documentation
```bash
cd synapse-docs
npm run build:docs
npm run serve
```

## 🧪 Testing

Both applications include comprehensive test suites:

```bash
# Test dashboard
cd synapse-dashboard
npm test

# Test documentation
cd synapse-docs
npm test
```

## 📊 Features Demonstrated

### Core Framework
- ✅ **SynapseRuntime**: Multi-threaded runtime engine
- ✅ **SynapseCompiler**: TypeScript compilation with Rust backend
- ✅ **SynapseTestingFramework**: TDD enforcement and coverage
- ✅ **SynapseLintingSystem**: Advanced linting with custom rules
- ✅ **SynapseRouter**: Universal routing system
- ✅ **SynapseStateManager**: Reactive state management
- ✅ **SynapsePluginSystem**: Extensible plugin architecture

### UI Components
- ✅ **Modern Design**: Clean, professional interface
- ✅ **Responsive Layout**: Works on all device sizes
- ✅ **Theme Support**: Dark and light mode switching
- ✅ **Animations**: Smooth transitions and interactions
- ✅ **Accessibility**: WCAG compliant components

### Rust Integration
- ✅ **EnvParser**: Fast environment variable parsing
- ✅ **HttpClient**: High-performance HTTP client
- ✅ **RuleEngine**: Business logic and validation
- ✅ **NAPI Bindings**: Seamless Node.js integration
- ✅ **Zero-copy Transfer**: Memory-efficient data handling

### Developer Experience
- ✅ **TypeScript First**: Full type safety and IntelliSense
- ✅ **Zero Dependencies**: Clean, minimal package.json
- ✅ **Hot Reload**: Instant development feedback
- ✅ **Comprehensive Testing**: 95%+ test coverage
- ✅ **Code Quality**: Automated linting and formatting

## 🌐 Deployment

### GitHub Pages
Both applications are automatically deployed to GitHub Pages:

- **Dashboard**: https://synapse-framework.github.io/synapse-dashboard-demo
- **Documentation**: https://synapse-framework.github.io/synapse-docs

### Other Platforms
The built applications can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

## 📈 Performance Metrics

| Metric | Dashboard | Documentation |
|--------|-----------|---------------|
| **Bundle Size** | < 500KB | < 1MB |
| **Load Time** | < 2s | < 3s |
| **Test Coverage** | 95% | 90% |
| **Dependencies** | 0 | 0 |
| **TypeScript** | 100% | 100% |

## 🔧 Development

### Project Structure
Each demo application follows the standard Synapse project structure:

```
app/
├── src/
│   └── index.ts          # Main application entry point
├── public/
│   └── index.html        # HTML template
├── dist/                 # Compiled output
├── tests/                # Test files
├── .synapse/             # Synapse configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run lint` - Run linting
- `npm run serve` - Serve built application

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📚 Documentation

- **Framework Docs**: [Synapse Framework Documentation](https://synapse-framework.github.io/synapse-docs)
- **API Reference**: [API Documentation](https://synapse-framework.github.io/synapse-docs/api-reference)
- **Examples**: [Code Examples](https://synapse-framework.github.io/synapse-docs/examples)
- **Tutorials**: [Step-by-step Tutorials](https://synapse-framework.github.io/synapse-docs/tutorials)

## 🐛 Issues & Support

- **Issues**: [GitHub Issues](https://github.com/synapse-framework/synapse-demo-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/synapse-framework/synapse-demo-app/discussions)
- **Documentation**: [Framework Docs](https://synapse-framework.github.io/synapse-docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Synapse Framework Team** for creating this amazing framework
- **Rust Community** for the excellent ecosystem
- **TypeScript Team** for the powerful type system
- **Open Source Community** for inspiration and support

---

**Built with ❤️ using the Synapse Framework**

*Showcasing the power of TypeScript, Rust, and modern web development*