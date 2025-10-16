// Accessible Accordion Component
import { a11y } from '../accessibility/index.js';

export class Accordion {
  constructor(options = {}) {
    this.id = options.id || `accordion-${Math.random().toString(36).substr(2, 9)}`;
    this.items = options.items || [];
    this.allowMultiple = options.allowMultiple || false;
    this.defaultOpen = options.defaultOpen || [];
    this.ariaLabel = options.ariaLabel || '';
    this.ariaDescribedBy = options.ariaDescribedBy || '';
    this.onToggle = options.onToggle || (() => {});
    this.className = options.className || '';
    
    // Track open items
    this.openItems = new Set(this.defaultOpen);
  }

  render() {
    // Build ARIA attributes
    const ariaAttributes = [];
    if (this.ariaLabel) ariaAttributes.push(`aria-label="${this.ariaLabel}"`);
    if (this.ariaDescribedBy) ariaAttributes.push(`aria-describedby="${this.ariaDescribedBy}"`);
    
    const ariaString = ariaAttributes.length > 0 ? ' ' + ariaAttributes.join(' ') : '';
    
    const itemsHtml = this.items.map((item, index) => {
      return this.renderItem(item, index);
    }).join('');
    
    return `
      <div 
        class="space-y-2 ${this.className}"
        role="region"
        ${ariaString}
      >
        ${itemsHtml}
      </div>
    `;
  }

  renderItem(item, index) {
    const itemId = `${this.id}-item-${index}`;
    const buttonId = `${itemId}-button`;
    const panelId = `${itemId}-panel`;
    const isOpen = this.openItems.has(index);
    
    return `
      <div class="border border-gray-200 rounded-md">
        <h3>
          <button
            id="${buttonId}"
            class="flex justify-between items-center w-full px-4 py-3 text-left text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-md ${
              !isOpen ? 'rounded-b-md' : ''
            }"
            aria-expanded="${isOpen}"
            aria-controls="${panelId}"
            onclick="${this.toggleItem.toString()}"
            onkeydown="${this.handleKeyDown.toString()}"
          >
            <span>${item.title}</span>
            <svg 
              class="w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </h3>
        <div
          id="${panelId}"
          class="px-4 py-3 text-sm text-gray-700 bg-gray-50 border-t border-gray-200 ${
            isOpen ? 'block' : 'hidden'
          }"
          role="region"
          aria-labelledby="${buttonId}"
        >
          ${item.content}
        </div>
      </div>
    `;
  }

  toggleItem(event) {
    const button = event.target.closest('button');
    if (!button) return;
    
    const itemId = button.id.replace('-button', '');
    const index = parseInt(itemId.split('-').pop());
    
    if (this.openItems.has(index)) {
      this.closeItem(index);
    } else {
      this.openItem(index);
    }
  }

  openItem(index) {
    if (!this.allowMultiple) {
      // Close all other items
      this.openItems.clear();
    }
    
    this.openItems.add(index);
    this.updateItemState(index, true);
    this.onToggle(index, true);
  }

  closeItem(index) {
    this.openItems.delete(index);
    this.updateItemState(index, false);
    this.onToggle(index, false);
  }

  updateItemState(index, isOpen) {
    const buttonId = `${this.id}-item-${index}-button`;
    const panelId = `${this.id}-item-${index}-panel`;
    
    const button = document.getElementById(buttonId);
    const panel = document.getElementById(panelId);
    
    if (button) {
      button.setAttribute('aria-expanded', isOpen.toString());
      
      // Update button classes
      if (isOpen) {
        button.classList.remove('rounded-b-md');
      } else {
        button.classList.add('rounded-b-md');
      }
      
      // Update icon rotation
      const icon = button.querySelector('svg');
      if (icon) {
        if (isOpen) {
          icon.classList.add('rotate-180');
        } else {
          icon.classList.remove('rotate-180');
        }
      }
    }
    
    if (panel) {
      if (isOpen) {
        panel.classList.remove('hidden');
        panel.classList.add('block');
      } else {
        panel.classList.add('hidden');
        panel.classList.remove('block');
      }
    }
  }

  handleKeyDown(event) {
    const { key } = event;
    
    switch (key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleItem(event);
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirstItem();
        break;
      case 'End':
        event.preventDefault();
        this.focusLastItem();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem(event.target);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem(event.target);
        break;
    }
  }

  focusFirstItem() {
    const firstButton = document.querySelector(`#${this.id} button`);
    if (firstButton) {
      firstButton.focus();
    }
  }

  focusLastItem() {
    const buttons = document.querySelectorAll(`#${this.id} button`);
    const lastButton = buttons[buttons.length - 1];
    if (lastButton) {
      lastButton.focus();
    }
  }

  focusNextItem(currentButton) {
    const buttons = Array.from(document.querySelectorAll(`#${this.id} button`));
    const currentIndex = buttons.indexOf(currentButton);
    const nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
    buttons[nextIndex].focus();
  }

  focusPreviousItem(currentButton) {
    const buttons = Array.from(document.querySelectorAll(`#${this.id} button`));
    const currentIndex = buttons.indexOf(currentButton);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
    buttons[prevIndex].focus();
  }

  // Public methods
  openAll() {
    this.items.forEach((_, index) => {
      this.openItems.add(index);
      this.updateItemState(index, true);
    });
  }

  closeAll() {
    this.openItems.clear();
    this.items.forEach((_, index) => {
      this.updateItemState(index, false);
    });
  }

  isOpen(index) {
    return this.openItems.has(index);
  }

  getOpenItems() {
    return Array.from(this.openItems);
  }
}