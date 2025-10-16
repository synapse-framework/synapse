// Animated Modal Component
import { animations, transitions } from '../animations/index.js';

export class Modal {
  constructor(options = {}) {
    this.isOpen = options.isOpen || false;
    this.title = options.title || '';
    this.description = options.description || '';
    this.children = options.children || '';
    this.size = options.size || 'md';
    this.closeOnOverlayClick = options.closeOnOverlayClick !== false;
    this.closeOnEscape = options.closeOnEscape !== false;
    this.showCloseButton = options.showCloseButton !== false;
    this.onClose = options.onClose || (() => {});
    this.className = options.className || '';
  }

  render() {
    if (!this.isOpen) return '';

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    };

    const classes = `relative bg-white rounded-lg shadow-xl ${sizeClasses[this.size]} ${this.className}`;
    
    const titleHtml = this.title ? `<h3 class="text-lg font-semibold text-gray-900 mb-2">${this.title}</h3>` : '';
    const descriptionHtml = this.description ? `<p class="text-sm text-gray-600 mb-4">${this.description}</p>` : '';
    const closeButtonHtml = this.showCloseButton ? `
      <button 
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        onclick="${this.onClose.toString()}"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    ` : '';

    return `
      <div class="fixed inset-0 z-50 overflow-y-auto" data-modal-overlay>
        <div class="flex min-h-screen items-center justify-center p-4">
          <div 
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
            data-modal-backdrop
            ${this.closeOnOverlayClick ? `onclick="${this.onClose.toString()}"` : ''}
          ></div>
          <div 
            class="${classes} transform transition-all duration-300 ease-out" 
            data-modal-content
            role="dialog"
            aria-modal="true"
            aria-labelledby="${this.title ? 'modal-title' : ''}"
          >
            ${closeButtonHtml}
            <div class="p-6">
              ${titleHtml}
              ${descriptionHtml}
              ${this.children}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Show modal with animation
  show() {
    this.isOpen = true;
    const modalHtml = this.render();
    
    // Create modal element
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHtml;
    const modal = modalElement.firstElementChild;
    
    // Add to DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(() => {
      const backdrop = modal.querySelector('[data-modal-backdrop]');
      const content = modal.querySelector('[data-modal-content]');
      
      if (backdrop) {
        backdrop.style.opacity = '0';
        animations.fadeIn(backdrop, 300);
      }
      
      if (content) {
        content.style.opacity = '0';
        content.style.transform = 'scale(0.95) translateY(20px)';
        animations.scaleIn(content, 300);
      }
    });

    // Handle escape key
    if (this.closeOnEscape) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          this.hide();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    }

    return modal;
  }

  // Hide modal with animation
  hide() {
    const modal = document.querySelector('[data-modal-overlay]');
    if (!modal) return;

    const backdrop = modal.querySelector('[data-modal-backdrop]');
    const content = modal.querySelector('[data-modal-content]');

    // Animate out
    if (backdrop) {
      animations.fadeOut(backdrop, 200);
    }
    
    if (content) {
      animations.scaleOut(content, 200);
    }

    // Remove from DOM after animation
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      document.body.style.overflow = '';
      this.isOpen = false;
      this.onClose();
    }, 300);
  }
}