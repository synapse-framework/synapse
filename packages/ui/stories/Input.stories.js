import { Input } from '../src/index.js';

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: 'A flexible input component with validation, labels, and animation support.'
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Input value'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    label: {
      control: 'text',
      description: 'Label text'
    },
    error: {
      control: 'boolean',
      description: 'Error state'
    },
    errorMessage: {
      control: 'text',
      description: 'Error message'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    animation: {
      control: 'text',
      description: 'Animation identifier'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
};

// Basic input
export const Default = {
  args: {
    placeholder: 'Enter text...',
    label: 'Label'
  },
  render: (args) => {
    const input = new Input(args);
    return input.render();
  }
};

// Input with value
export const WithValue = {
  args: {
    value: 'Hello World',
    label: 'Name',
    placeholder: 'Enter your name'
  },
  render: (args) => {
    const input = new Input(args);
    return input.render();
  }
};

// Input states
export const States = {
  render: () => {
    const normal = new Input({ 
      placeholder: 'Normal input',
      label: 'Normal'
    });
    const error = new Input({ 
      placeholder: 'Error input',
      label: 'Error',
      error: true,
      errorMessage: 'This field is required'
    });
    const disabled = new Input({ 
      placeholder: 'Disabled input',
      label: 'Disabled',
      disabled: true
    });
    
    return `
      <div class="space-y-4">
        ${normal.render()}
        ${error.render()}
        ${disabled.render()}
      </div>
    `;
  }
};

// Input without label
export const WithoutLabel = {
  args: {
    placeholder: 'No label input'
  },
  render: (args) => {
    const input = new Input(args);
    return input.render();
  }
};

// Form example
export const FormExample = {
  render: () => {
    const name = new Input({ 
      placeholder: 'John Doe',
      label: 'Full Name',
      className: 'mb-4'
    });
    const email = new Input({ 
      placeholder: 'john@example.com',
      label: 'Email',
      className: 'mb-4'
    });
    const password = new Input({ 
      placeholder: 'Enter password',
      label: 'Password',
      className: 'mb-4'
    });
    
    return `
      <form class="max-w-md space-y-4">
        <h3 class="text-lg font-semibold mb-4">Contact Form</h3>
        ${name.render()}
        ${email.render()}
        ${password.render()}
      </form>
    `;
  }
};