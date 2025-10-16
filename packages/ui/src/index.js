// Simple UI Library - JavaScript Implementation with Animations & Accessibility
import { animations, transitions, hoverEffects, loadingAnimations, animationManager } from './animations/index.js';
import { a11y, accessibilityManager } from './accessibility/index.js';
import { Modal } from './components/Modal.js';
import { Toast, ToastManager, toastManager } from './components/Toast.js';
import { Table } from './components/Table.js';
import { Dropdown } from './components/Dropdown.js';
import { Accordion } from './components/Accordion.js';

export class Button {
  constructor(options = {}) {
    this.children = options.children || '';
    this.variant = options.variant || 'primary';
    this.size = options.size || 'md';
    this.disabled = options.disabled || false;
    this.loading = options.loading || false;
    this.animation = options.animation || 'none';
    this.hoverEffect = options.hoverEffect || 'lift';
    this.ariaLabel = options.ariaLabel || '';
    this.ariaDescribedBy = options.ariaDescribedBy || '';
    this.ariaPressed = options.ariaPressed || false;
    this.ariaExpanded = options.ariaExpanded || false;
    this.ariaControls = options.ariaControls || '';
    this.role = options.role || 'button';
    this.tabIndex = options.tabIndex !== undefined ? options.tabIndex : 0;
    this.onClick = options.onClick || (() => {});
    this.onKeyDown = options.onKeyDown || (() => {});
    this.className = options.className || '';
  }

  render() {
    const baseClasses = 'px-4 py-2 rounded font-medium cursor-pointer transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      tertiary: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
    };
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    const hoverClasses = {
      lift: 'hover:transform hover:-translate-y-0.5 hover:shadow-lg',
      glow: 'hover:shadow-lg hover:shadow-blue-500/25',
      scale: 'hover:scale-105',
      bounce: 'hover:animate-bounce'
    };
    
    const loadingClasses = this.loading ? 'opacity-75 cursor-not-allowed' : '';
    const disabledClasses = this.disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    const classes = `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${hoverClasses[this.hoverEffect]} ${loadingClasses} ${disabledClasses} ${this.className}`;
    
    const loadingSpinner = this.loading ? '<div class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true"></div>' : '';
    
    // Build ARIA attributes
    const ariaAttributes = [];
    if (this.ariaLabel) ariaAttributes.push(`aria-label="${this.ariaLabel}"`);
    if (this.ariaDescribedBy) ariaAttributes.push(`aria-describedby="${this.ariaDescribedBy}"`);
    if (this.ariaPressed !== false) ariaAttributes.push(`aria-pressed="${this.ariaPressed}"`);
    if (this.ariaExpanded !== false) ariaAttributes.push(`aria-expanded="${this.ariaExpanded}"`);
    if (this.ariaControls) ariaAttributes.push(`aria-controls="${this.ariaControls}"`);
    
    const ariaString = ariaAttributes.length > 0 ? ' ' + ariaAttributes.join(' ') : '';
    
    return `<button 
      class="${classes}" 
      role="${this.role}"
      tabindex="${this.tabIndex}"
      ${this.disabled || this.loading ? 'disabled aria-disabled="true"' : ''} 
      onclick="${this.onClick.toString()}" 
      onkeydown="${this.onKeyDown.toString()}"
      data-animation="${this.animation}"
      ${ariaString}
    >${loadingSpinner}${this.children}</button>`;
  }

  // Animate the button
  animate(animationType = 'bounceIn') {
    const element = document.querySelector(`[data-animation="${this.animation}"]`);
    if (element && animations[animationType]) {
      return animations[animationType](element);
    }
  }
}

export class Input {
  constructor(options = {}) {
    this.value = options.value || '';
    this.placeholder = options.placeholder || '';
    this.label = options.label || '';
    this.error = options.error || false;
    this.errorMessage = options.errorMessage || '';
    this.required = options.required || false;
    this.type = options.type || 'text';
    this.name = options.name || '';
    this.id = options.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    this.ariaLabel = options.ariaLabel || '';
    this.ariaDescribedBy = options.ariaDescribedBy || '';
    this.ariaInvalid = options.ariaInvalid || false;
    this.ariaRequired = options.ariaRequired || false;
    this.onChange = options.onChange || (() => {});
    this.onFocus = options.onFocus || (() => {});
    this.onBlur = options.onBlur || (() => {});
    this.onKeyDown = options.onKeyDown || (() => {});
    this.disabled = options.disabled || false;
    this.animation = options.animation || 'none';
    this.className = options.className || '';
  }

  render() {
    const baseClasses = 'px-3 py-2 border rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    const stateClasses = this.error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    const disabledClasses = this.disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : '';
    
    const classes = `${baseClasses} ${stateClasses} ${disabledClasses} ${this.className}`;
    
    // Generate error message ID for aria-describedby
    const errorId = this.error && this.errorMessage ? `${this.id}-error` : '';
    const describedBy = [this.ariaDescribedBy, errorId].filter(Boolean).join(' ');
    
    // Build ARIA attributes
    const ariaAttributes = [];
    if (this.ariaLabel) ariaAttributes.push(`aria-label="${this.ariaLabel}"`);
    if (describedBy) ariaAttributes.push(`aria-describedby="${describedBy}"`);
    if (this.ariaInvalid || this.error) ariaAttributes.push(`aria-invalid="${this.ariaInvalid || this.error}"`);
    if (this.ariaRequired || this.required) ariaAttributes.push(`aria-required="${this.ariaRequired || this.required}"`);
    
    const ariaString = ariaAttributes.length > 0 ? ' ' + ariaAttributes.join(' ') : '';
    
    const labelHtml = this.label ? `<label for="${this.id}" class="block text-sm font-medium text-gray-700 mb-1">${this.label}${this.required ? ' <span class="text-red-500" aria-label="required">*</span>' : ''}</label>` : '';
    const errorHtml = this.error && this.errorMessage ? `<p id="${errorId}" class="mt-1 text-sm text-red-600" role="alert">${this.errorMessage}</p>` : '';
    
    return `
      <div class="space-y-1" data-animation="${this.animation}">
        ${labelHtml}
        <input 
          type="${this.type}"
          id="${this.id}"
          name="${this.name}"
          value="${this.value}" 
          placeholder="${this.placeholder}" 
          class="${classes}" 
          ${this.disabled ? 'disabled aria-disabled="true"' : ''} 
          ${this.required ? 'required' : ''}
          onchange="${this.onChange.toString()}"
          onfocus="${this.onFocus.toString()}"
          onblur="${this.onBlur.toString()}"
          onkeydown="${this.onKeyDown.toString()}"
          ${ariaString}
        />
        ${errorHtml}
      </div>
    `;
  }

  // Animate the input
  animate(animationType = 'shake') {
    const element = document.querySelector(`[data-animation="${this.animation}"]`);
    if (element && animations[animationType]) {
      return animations[animationType](element);
    }
  }
}

export class Card {
  constructor(options = {}) {
    this.children = options.children || '';
    this.title = options.title || '';
    this.subtitle = options.subtitle || '';
    this.variant = options.variant || 'default';
    this.hoverable = options.hoverable || false;
    this.clickable = options.clickable || false;
    this.animation = options.animation || 'none';
    this.onClick = options.onClick || (() => {});
    this.className = options.className || '';
  }

  render() {
    const variantClasses = {
      default: 'bg-white border-gray-200',
      elevated: 'bg-white border-gray-200 shadow-lg',
      outlined: 'bg-transparent border-2 border-gray-300',
      filled: 'bg-gray-50 border-gray-200'
    };
    
    const hoverClasses = this.hoverable ? 'hover:shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300 ease-out' : '';
    const clickableClasses = this.clickable ? 'cursor-pointer' : '';
    
    const classes = `rounded-lg border p-6 ${variantClasses[this.variant]} ${hoverClasses} ${clickableClasses} ${this.className}`;
    
    const titleHtml = this.title ? `<h3 class="text-lg font-semibold text-gray-900 mb-2">${this.title}</h3>` : '';
    const subtitleHtml = this.subtitle ? `<p class="text-sm text-gray-600 mb-4">${this.subtitle}</p>` : '';
    
    return `<div class="${classes}" data-animation="${this.animation}" ${this.clickable ? `onclick="${this.onClick.toString()}"` : ''}>${titleHtml}${subtitleHtml}${this.children}</div>`;
  }

  // Animate the card
  animate(animationType = 'fadeIn') {
    const element = document.querySelector(`[data-animation="${this.animation}"]`);
    if (element && animations[animationType]) {
      return animations[animationType](element);
    }
  }
}

// Theme system
export const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      background: '#ffffff',
      text: '#111827'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#9ca3af',
      background: '#111827',
      text: '#f9fafb'
    }
  }
};

// Utility functions
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// CSS-in-JS helper
export function createStyles(styles) {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  return styleSheet;
}

// Component registry
export const components = {
  Button,
  Input,
  Card,
  Modal,
  Toast,
  Table,
  Dropdown,
  Accordion
};

// Default export
export default {
  Button,
  Input,
  Card,
  Modal,
  Toast,
  ToastManager,
  toastManager,
  Table,
  Dropdown,
  Accordion,
  themes,
  animations,
  transitions,
  hoverEffects,
  loadingAnimations,
  animationManager,
  a11y,
  accessibilityManager,
  cn,
  createStyles,
  components
};