import { Modal } from '../src/index.js';

export default {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: 'A modal component with smooth animations and flexible content.'
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Modal open state'
    },
    title: {
      control: 'text',
      description: 'Modal title'
    },
    description: {
      control: 'text',
      description: 'Modal description'
    },
    children: {
      control: 'text',
      description: 'Modal content'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Modal size'
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Close on overlay click'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close on escape key'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show close button'
    }
  }
};

// Basic modal
export const Default = {
  args: {
    isOpen: true,
    title: 'Modal Title',
    description: 'This is a basic modal with title and description.',
    children: '<p>Modal content goes here.</p>'
  },
  render: (args) => {
    const modal = new Modal(args);
    return modal.render();
  }
};

// Modal sizes
export const Sizes = {
  render: () => {
    const small = new Modal({ 
      isOpen: true,
      title: 'Small Modal',
      children: '<p>This is a small modal.</p>',
      size: 'sm'
    });
    const medium = new Modal({ 
      isOpen: true,
      title: 'Medium Modal',
      children: '<p>This is a medium modal.</p>',
      size: 'md'
    });
    const large = new Modal({ 
      isOpen: true,
      title: 'Large Modal',
      children: '<p>This is a large modal.</p>',
      size: 'lg'
    });
    
    return `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Modal Sizes</h3>
        <div class="space-y-2">
          <div>Small: ${small.render()}</div>
          <div>Medium: ${medium.render()}</div>
          <div>Large: ${large.render()}</div>
        </div>
      </div>
    `;
  }
};

// Confirmation modal
export const Confirmation = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed? This action cannot be undone.',
    children: `
      <div class="flex justify-end space-x-2 mt-4">
        <button class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
        <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
      </div>
    `
  },
  render: (args) => {
    const modal = new Modal(args);
    return modal.render();
  }
};

// Form modal
export const FormModal = {
  args: {
    isOpen: true,
    title: 'Create New Item',
    children: `
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter name">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Enter description"></textarea>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button type="button" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
        </div>
      </form>
    `
  },
  render: (args) => {
    const modal = new Modal(args);
    return modal.render();
  }
};

// Modal without close button
export const NoCloseButton = {
  args: {
    isOpen: true,
    title: 'Processing',
    children: '<p>Please wait while we process your request...</p>',
    showCloseButton: false
  },
  render: (args) => {
    const modal = new Modal(args);
    return modal.render();
  }
};