// Synapse Framework Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize code playground
    initializeCodePlayground();
    
    // Initialize demo components
    initializeDemoComponents();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icon
    updateThemeIcon(savedTheme);
    
    // Add click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (!themeIcon) return;
    
    if (theme === 'dark') {
        themeIcon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        `;
    } else {
        themeIcon.innerHTML = `
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        `;
    }
}

// Navigation Management
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleNav);
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeNav();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !navToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            closeNav();
        }
    });
}

function toggleNav() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    }
}

function closeNav() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Code Playground
function initializeCodePlayground() {
    const codeEditor = document.getElementById('code-editor');
    const runButton = document.querySelector('.run-button');
    const clearButton = document.querySelector('.clear-button');
    
    if (codeEditor && runButton) {
        runButton.addEventListener('click', runCode);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearOutput);
    }
    
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.textContent.toLowerCase()));
    });
}

function runCode() {
    const codeEditor = document.getElementById('code-editor');
    const outputContent = document.getElementById('output-content');
    
    if (!codeEditor || !outputContent) return;
    
    const code = codeEditor.value;
    
    // Clear previous output
    outputContent.innerHTML = '';
    
    // Create output placeholder
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output-result';
    
    try {
        // Simulate code execution
        const result = simulateCodeExecution(code);
        outputDiv.innerHTML = result;
    } catch (error) {
        outputDiv.innerHTML = `
            <div class="error-message">
                <h4>Error</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
    
    outputContent.appendChild(outputDiv);
}

function simulateCodeExecution(code) {
    // This is a simplified simulation
    if (code.includes('Button')) {
        return `
            <div class="demo-result">
                <h4>Button Component Rendered:</h4>
                <button class="btn btn-primary" style="margin: 1rem 0;">Click me!</button>
                <p>This is a simulated output. In a real environment, your Synapse components would render here.</p>
            </div>
        `;
    } else if (code.includes('Card')) {
        return `
            <div class="demo-result">
                <h4>Card Component Rendered:</h4>
                <div class="card" style="margin: 1rem 0;">
                    <h4>Welcome to Synapse</h4>
                    <p>This is a beautiful card component.</p>
                </div>
                <p>This is a simulated output. In a real environment, your Synapse components would render here.</p>
            </div>
        `;
    } else {
        return `
            <div class="demo-result">
                <h4>Code Executed Successfully!</h4>
                <p>Your Synapse code has been processed. In a real environment, this would show the actual rendered output.</p>
                <div class="console-output">
                    <strong>Console:</strong>
                    <pre>Hello from Synapse!</pre>
                </div>
            </div>
        `;
    }
}

function clearOutput() {
    const outputContent = document.getElementById('output-content');
    if (outputContent) {
        outputContent.innerHTML = `
            <div class="output-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/>
                    <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/>
                    <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/>
                    <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/>
                </svg>
                <p>Click "Run" to see your code in action!</p>
            </div>
        `;
    }
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = Array.from(tabs).find(tab => 
        tab.textContent.toLowerCase() === tabName
    );
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update editor placeholder
    const codeEditor = document.getElementById('code-editor');
    if (codeEditor) {
        switch (tabName) {
            case 'html':
                codeEditor.placeholder = '<!-- Write your HTML here... -->';
                break;
            case 'css':
                codeEditor.placeholder = '/* Write your CSS here... */';
                break;
            default:
                codeEditor.placeholder = '// Write your Synapse code here...';
        }
    }
}

// Demo Components
function initializeDemoComponents() {
    // Initialize toast system
    window.showToast = showToast;
    
    // Initialize modal system
    window.showModal = showModal;
    
    // Initialize copy functionality
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => copyCode(button));
    });
}

function showToast(type, title, message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <div class="toast-title">${title}</div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

function showModal() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3 class="modal-title">Welcome to Synapse!</h3>
            <button class="modal-close" onclick="closeModal()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <p>This is a beautiful modal component built with Synapse Framework. It features smooth animations, accessibility support, and responsive design.</p>
            <p>Try building your own components with our comprehensive UI library!</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="closeModal(); showToast('success', 'Great!', 'You clicked the primary button!')">Get Started</button>
        </div>
    `;
    
    modalContainer.innerHTML = '';
    modalContainer.appendChild(modal);
    modalContainer.classList.add('active');
    
    // Close on backdrop click
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.classList.remove('active');
        setTimeout(() => {
            modalContainer.innerHTML = '';
        }, 300);
    }
}

function copyCode(button) {
    const codeBlock = button.parentElement;
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.backgroundColor = '#22c55e';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .community-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
}

// Initialize performance monitoring
initializePerformanceMonitoring();

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}