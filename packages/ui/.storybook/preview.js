import '../src/animations/index.js';

// Global parameters
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  docs: {
    toc: true
  },
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px'
        }
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px'
        }
      },
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1024px',
          height: '768px'
        }
      },
      wide: {
        name: 'Wide',
        styles: {
          width: '1440px',
          height: '900px'
        }
      }
    }
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#ffffff'
      },
      {
        name: 'dark',
        value: '#1a1a1a'
      },
      {
        name: 'gray',
        value: '#f5f5f5'
      }
    ]
  }
};

// Global decorators
export const decorators = [
  (Story, context) => {
    const { theme } = context.globals;
    
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }

    return Story();
  }
];

// Global arg types
export const argTypes = {
  theme: {
    control: { type: 'select' },
    options: ['light', 'dark'],
    description: 'Theme variant'
  }
};

// Global args
export const args = {
  theme: 'light'
};