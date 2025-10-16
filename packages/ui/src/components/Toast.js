// Animated Toast Notification System
import { animations, transitions } from '../animations/index.js';

export class Toast {
  constructor(options = {}) {
    this.id = options.id || Math.random().toString(36).substr(2, 9);
    this.type = options.type || 'info';
    this.title = options.title || '';
    this.message = options.message || '';
    this.duration = options.duration || 5000;
    this.position = options.position || 'top-right';
    this.action = options.action || null;
    this.onClose = options.onClose || (() => {});
    this.className = options.className || '';
  }

  render() {
    const typeClasses = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const iconSvg = {
      success: `<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>`,
      error: `<svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
      </svg>`,
      warning: `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>`,
      info: `<svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
      </svg>`
    };

    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    const actionHtml = this.action ? `
      <div class="mt-3">
        <button 
          class="text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${typeClasses[this.type].replace('bg-', 'text-').replace('border-', 'hover:bg-').replace('text-', 'focus:ring-')}"
          onclick="${this.action.onClick.toString()}"
        >
          ${this.action.label}
        </button>
      </div>
    ` : '';

    const classes = `max-w-sm w-full bg-white rounded-lg shadow-lg border p-4 pointer-events-auto ring-1 ring-black ring-opacity-5 ${typeClasses[this.type]} ${positionClasses[this.position]} ${this.className}`;

    return `
      <div 
        class="${classes}" 
        data-toast="${this.id}"
        role="alert"
        aria-live="polite"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            ${iconSvg[this.type]}
          </div>
          <div class="ml-3 w-0 flex-1">
            ${this.title ? `<p class="text-sm font-medium">${this.title}</p>` : ''}
            <p class="text-sm ${this.title ? 'mt-1' : ''}">
              ${this.message}
            </p>
            ${actionHtml}
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button 
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              onclick="this.closest('[data-toast]').remove()"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Show toast with animation
  show() {
    const toastHtml = this.render();
    const toastElement = document.createElement('div');
    toastElement.innerHTML = toastHtml;
    const toast = toastElement.firstElementChild;

    // Add to toast container
    let container = document.querySelector('[data-toast-container]');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('data-toast-container', '');
      container.className = 'fixed inset-0 z-50 pointer-events-none';
      document.body.appendChild(container);
    }

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      animations.slideInFromRight(toast, 300);
    });

    // Auto remove after duration
    if (this.duration > 0) {
      setTimeout(() => {
        this.hide();
      }, this.duration);
    }

    return toast;
  }

  // Hide toast with animation
  hide() {
    const toast = document.querySelector(`[data-toast="${this.id}"]`);
    if (!toast) return;

    animations.slideInFromRight(toast, 200).then(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.onClose();
    });
  }
}

// Toast Manager
export class ToastManager {
  constructor() {
    this.toasts = new Map();
  }

  show(options) {
    const toast = new Toast(options);
    this.toasts.set(toast.id, toast);
    toast.show();
    return toast.id;
  }

  hide(id) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.hide();
      this.toasts.delete(id);
    }
  }

  hideAll() {
    this.toasts.forEach(toast => toast.hide());
    this.toasts.clear();
  }

  // Convenience methods
  success(message, options = {}) {
    return this.show({ ...options, type: 'success', message });
  }

  error(message, options = {}) {
    return this.show({ ...options, type: 'error', message });
  }

  warning(message, options = {}) {
    return this.show({ ...options, type: 'warning', message });
  }

  info(message, options = {}) {
    return this.show({ ...options, type: 'info', message });
  }
}

// Global toast manager instance
export const toastManager = new ToastManager();