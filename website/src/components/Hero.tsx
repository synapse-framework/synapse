import React from 'react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            ⚡ Synapse Framework
            <span className="hero-subtitle">The Mightiest Developer Toolkit</span>
          </h1>
          <p className="hero-description">
            Zero dependencies, 10x performance, AI-powered. Every developer task made ridiculously fast and easy.
            Now with comprehensive deployment, team collaboration, security scanning, i18n, and analytics!
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large">
              Get Started
            </button>
            <button className="btn btn-secondary btn-large">
              View Examples
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10x</span>
              <span className="stat-label">Faster</span>
            </div>
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Dependencies</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">TypeScript</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Possibilities</span>
            </div>
          </div>
        </div>
        <div className="hero-demo">
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="btn-close"></span>
                <span className="btn-minimize"></span>
                <span className="btn-maximize"></span>
              </div>
              <span className="terminal-title">synapse init my-app</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="command">synapse init my-awesome-app</span>
              </div>
              <div className="terminal-output">
                <div className="output-line">🚀 Initializing new Synapse project...</div>
                <div className="output-line">📦 Project: my-awesome-app</div>
                <div className="output-line">🎨 Template: fullstack</div>
                <div className="output-line">✅ Project created successfully!</div>
                <div className="output-line">⚡ Completed in 4ms</div>
              </div>
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="command">synapse dev</span>
              </div>
              <div className="terminal-output">
                <div className="output-line">🔥 Starting development server...</div>
                <div className="output-line">🌐 Server running on http://localhost:3000</div>
                <div className="output-line">⚡ Hot reload enabled</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}