// Accessible Dropdown Component
import { a11y } from '../accessibility/index.js';

export class Dropdown {
  constructor(options = {}) {
    this.id = options.id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;
    this.label = options.label || '';
    this.placeholder = options.placeholder || 'Select an option';
    this.options = options.options || [];
    this.value = options.value || '';
    this.disabled = options.disabled || false;
    this.required = options.required || false;
    this.error = options.error || false;
    this.errorMessage = options.errorMessage || '';
    this.ariaLabel = options.ariaLabel || '';
    this.ariaDescribedBy = options.ariaDescribedBy || '';
    this.ariaInvalid = options.ariaInvalid || false;
    this.ariaRequired = options.ariaRequired || false;
    this.onChange = options.onChange || (() => {});
    this.onFocus = options.onFocus || (() => {});
    this.onBlur = options.onBlur || (() => {});
    this.onKeyDown = options.onKeyDown || (() => {});
    this.className = options.className || '';
  }

  render() {
    const buttonId = `${this.id}-button`;
    const listId = `${this.id}-list`;
    const errorId = this.error && this.errorMessage ? `${this.id}-error` : '';
    const describedBy = [this.ariaDescribedBy, errorId].filter(Boolean).join(' ');
    
    // Build ARIA attributes
    const ariaAttributes = [];
    if (this.ariaLabel) ariaAttributes.push(`aria-label="${this.ariaLabel}"`);
    if (describedBy) ariaAttributes.push(`aria-describedby="${describedBy}"`);
    if (this.ariaInvalid || this.error) ariaAttributes.push(`aria-invalid="${this.ariaInvalid || this.error}"`);
    if (this.ariaRequired || this.required) ariaAttributes.push(`aria-required="${this.ariaRequired || this.required}"`);
    
    const ariaString = ariaAttributes.length > 0 ? ' ' + ariaAttributes.join(' ') : '';
    
    const labelHtml = this.label ? `
      <label for="${buttonId}" class="block text-sm font-medium text-gray-700 mb-1">
        ${this.label}${this.required ? ' <span class="text-red-500" aria-label="required">*</span>' : ''}
      </label>
    ` : '';
    
    const errorHtml = this.error && this.errorMessage ? `
      <p id="${errorId}" class="mt-1 text-sm text-red-600" role="alert">${this.errorMessage}</p>
    ` : '';
    
    const selectedOption = this.options.find(option => option.value === this.value);
    const displayText = selectedOption ? selectedOption.label : this.placeholder;
    
    return `
      <div class="relative ${this.className}">
        ${labelHtml}
        <div class="relative">
          <button
            id="${buttonId}"
            type="button"
            class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              this.error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
            } ${this.disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}"
            aria-haspopup="listbox"
            aria-expanded="false"
            aria-labelledby="${this.label ? buttonId : ''}"
            ${this.disabled ? 'disabled aria-disabled="true"' : ''}
            onclick="${this.toggleDropdown.toString()}"
            onkeydown="${this.handleKeyDown.toString()}"
            onfocus="${this.onFocus.toString()}"
            onblur="${this.onBlur.toString()}"
            ${ariaString}
          >
            <span class="block truncate">${displayText}</span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
          </button>
          
          <ul
            id="${listId}"
            class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm hidden"
            tabindex="-1"
            role="listbox"
            aria-labelledby="${buttonId}"
          >
            ${this.renderOptions()}
          </ul>
        </div>
        ${errorHtml}
      </div>
    `;
  }

  renderOptions() {
    return this.options.map((option, index) => {
      const isSelected = option.value === this.value;
      const optionId = `${this.id}-option-${index}`;
      
      return `
        <li
          id="${optionId}"
          class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 ${
            isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'
          }"
          role="option"
          ${isSelected ? 'aria-selected="true"' : ''}
          onclick="${this.selectOption.toString()}"
          onkeydown="${this.handleOptionKeyDown.toString()}"
        >
          <span class="block truncate">${option.label}</span>
          ${isSelected ? `
            <span class="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          ` : ''}
        </li>
      `;
    }).join('');
  }

  toggleDropdown() {
    const button = document.getElementById(`${this.id}-button`);
    const list = document.getElementById(`${this.id}-list`);
    
    if (list.classList.contains('hidden')) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  openDropdown() {
    const button = document.getElementById(`${this.id}-button`);
    const list = document.getElementById(`${this.id}-list`);
    
    if (button && list) {
      button.setAttribute('aria-expanded', 'true');
      list.classList.remove('hidden');
      list.focus();
      
      // Focus first option
      const firstOption = list.querySelector('[role="option"]');
      if (firstOption) {
        firstOption.focus();
      }
    }
  }

  closeDropdown() {
    const button = document.getElementById(`${this.id}-button`);
    const list = document.getElementById(`${this.id}-list`);
    
    if (button && list) {
      button.setAttribute('aria-expanded', 'false');
      list.classList.add('hidden');
      button.focus();
    }
  }

  selectOption(event) {
    const option = event.target.closest('[role="option"]');
    if (!option) return;
    
    const optionIndex = parseInt(option.id.split('-').pop());
    const selectedOption = this.options[optionIndex];
    
    if (selectedOption) {
      this.value = selectedOption.value;
      this.onChange(selectedOption.value, selectedOption);
      this.closeDropdown();
    }
  }

  handleKeyDown(event) {
    const { key } = event;
    
    switch (key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.openDropdown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openDropdown();
        break;
    }
    
    this.onKeyDown(event);
  }

  handleOptionKeyDown(event) {
    const { key } = event;
    const list = document.getElementById(`${this.id}-list`);
    const options = Array.from(list.querySelectorAll('[role="option"]'));
    const currentIndex = options.indexOf(event.target);
    
    switch (key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectOption(event);
        break;
      case 'Escape':
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        options[nextIndex].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        options[prevIndex].focus();
        break;
      case 'Home':
        event.preventDefault();
        options[0].focus();
        break;
      case 'End':
        event.preventDefault();
        options[options.length - 1].focus();
        break;
    }
  }
}