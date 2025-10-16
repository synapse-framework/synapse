import { Toast, toastManager } from '../src/index.js';

export default {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component: 'A toast notification system with different types and animations.'
      }
    }
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['success', 'error', 'warning', 'info'],
      description: 'Toast type'
    },
    title: {
      control: 'text',
      description: 'Toast title'
    },
    message: {
      control: 'text',
      description: 'Toast message'
    },
    duration: {
      control: { type: 'number', min: 0, max: 10000, step: 1000 },
      description: 'Auto-dismiss duration (ms)'
    },
    position: {
      control: { type: 'select' },
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'],
      description: 'Toast position'
    }
  }
};

// Success toast
export const Success = {
  args: {
    type: 'success',
    title: 'Success!',
    message: 'Your action was completed successfully.',
    duration: 5000
  },
  render: (args) => {
    const toast = new Toast(args);
    return toast.render();
  }
};

// Error toast
export const Error = {
  args: {
    type: 'error',
    title: 'Error!',
    message: 'Something went wrong. Please try again.',
    duration: 5000
  },
  render: (args) => {
    const toast = new Toast(args);
    return toast.render();
  }
};

// Warning toast
export const Warning = {
  args: {
    type: 'warning',
    title: 'Warning!',
    message: 'Please review your input before proceeding.',
    duration: 5000
  },
  render: (args) => {
    const toast = new Toast(args);
    return toast.render();
  }
};

// Info toast
export const Info = {
  args: {
    type: 'info',
    title: 'Information',
    message: 'Here is some useful information for you.',
    duration: 5000
  },
  render: (args) => {
    const toast = new Toast(args);
    return toast.render();
  }
};

// Toast without title
export const WithoutTitle = {
  args: {
    type: 'success',
    message: 'Simple success message without title.',
    duration: 3000
  },
  render: (args) => {
    const toast = new Toast(args);
    return toast.render();
  }
};

// Toast with action
export const WithAction = {
  args: {
    type: 'error',
    title: 'Upload Failed',
    message: 'Your file could not be uploaded.',
    duration: 0,
    action: {
      label: 'Retry',
      onClick: () => console.log('Retry clicked')
    }
  },
  render: (args) => {
    const toast = new Toast(args);
    return toast.render();
  }
};

// Toast positions
export const Positions = {
  render: () => {
    const positions = [
      { position: 'top-right', message: 'Top Right' },
      { position: 'top-left', message: 'Top Left' },
      { position: 'bottom-right', message: 'Bottom Right' },
      { position: 'bottom-left', message: 'Bottom Left' },
      { position: 'top-center', message: 'Top Center' },
      { position: 'bottom-center', message: 'Bottom Center' }
    ];
    
    const toasts = positions.map(pos => {
      const toast = new Toast({ 
        type: 'info', 
        message: pos.message,
        position: pos.position,
        duration: 0
      });
      return toast.render();
    });
    
    return `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Toast Positions</h3>
        <div class="space-y-2">
          ${toasts.join('')}
        </div>
      </div>
    `;
  }
};

// Interactive demo
export const InteractiveDemo = {
  render: () => {
    return `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Interactive Toast Demo</h3>
        <div class="flex space-x-2">
          <button 
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onclick="toastManager.success('Success message!')"
          >
            Success
          </button>
          <button 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onclick="toastManager.error('Error message!')"
          >
            Error
          </button>
          <button 
            class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            onclick="toastManager.warning('Warning message!')"
          >
            Warning
          </button>
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onclick="toastManager.info('Info message!')"
          >
            Info
          </button>
        </div>
        <p class="text-sm text-gray-600">Click the buttons above to show different toast notifications.</p>
      </div>
    `;
  }
};