import { Button } from '../src/index.js';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and animation effects.'
      }
    }
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content'
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Button variant'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state'
    },
    hoverEffect: {
      control: { type: 'select' },
      options: ['lift', 'glow', 'scale', 'bounce'],
      description: 'Hover effect'
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

// Basic button
export const Primary = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false
  },
  render: (args) => {
    const button = new Button(args);
    return button.render();
  }
};

// Secondary button
export const Secondary = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md'
  },
  render: (args) => {
    const button = new Button(args);
    return button.render();
  }
};

// Tertiary button
export const Tertiary = {
  args: {
    children: 'Tertiary Button',
    variant: 'tertiary',
    size: 'md'
  },
  render: (args) => {
    const button = new Button(args);
    return button.render();
  }
};

// Button sizes
export const Sizes = {
  render: () => {
    const small = new Button({ children: 'Small', size: 'sm' });
    const medium = new Button({ children: 'Medium', size: 'md' });
    const large = new Button({ children: 'Large', size: 'lg' });
    
    return `
      <div class="space-x-4">
        ${small.render()}
        ${medium.render()}
        ${large.render()}
      </div>
    `;
  }
};

// Button states
export const States = {
  render: () => {
    const normal = new Button({ children: 'Normal' });
    const disabled = new Button({ children: 'Disabled', disabled: true });
    const loading = new Button({ children: 'Loading', loading: true });
    
    return `
      <div class="space-x-4">
        ${normal.render()}
        ${disabled.render()}
        ${loading.render()}
      </div>
    `;
  }
};

// Hover effects
export const HoverEffects = {
  render: () => {
    const lift = new Button({ children: 'Lift Effect', hoverEffect: 'lift' });
    const glow = new Button({ children: 'Glow Effect', hoverEffect: 'glow' });
    const scale = new Button({ children: 'Scale Effect', hoverEffect: 'scale' });
    const bounce = new Button({ children: 'Bounce Effect', hoverEffect: 'bounce' });
    
    return `
      <div class="space-x-4">
        ${lift.render()}
        ${glow.render()}
        ${scale.render()}
        ${bounce.render()}
      </div>
    `;
  }
};

// Button group
export const ButtonGroup = {
  render: () => {
    const primary = new Button({ children: 'Save', variant: 'primary' });
    const secondary = new Button({ children: 'Cancel', variant: 'secondary' });
    const tertiary = new Button({ children: 'Reset', variant: 'tertiary' });
    
    return `
      <div class="flex space-x-2">
        ${primary.render()}
        ${secondary.render()}
        ${tertiary.render()}
      </div>
    `;
  }
};