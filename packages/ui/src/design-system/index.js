// Design System for @snps/ui - Complete Design Tokens
export const designTokens = {
  // Colors
  colors: {
    // Primary colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    
    // Secondary colors
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    
    // Success colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    
    // Warning colors
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    
    // Error colors
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    
    // Info colors
    info: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    
    // Neutral colors
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b'
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    },
    
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    },
    
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    }
  },
  
  // Spacing
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem'
  },
  
  // Border radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000'
  },
  
  // Z-index
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto'
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Transitions
  transition: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    
    timingFunction: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
  }
};

// Component tokens
export const componentTokens = {
  button: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem'
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.5rem 1rem',
      lg: '0.75rem 1.5rem'
    },
    fontSize: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem'
    }
  },
  
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem'
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.5rem 1rem',
      lg: '0.75rem 1rem'
    }
  },
  
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem'
    },
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
  },
  
  modal: {
    maxWidth: {
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem'
    },
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
};

// Theme generator
export class ThemeGenerator {
  constructor(baseTheme = 'light') {
    this.baseTheme = baseTheme;
    this.tokens = designTokens;
  }

  generateTheme(customTokens = {}) {
    const theme = {
      name: customTokens.name || this.baseTheme,
      colors: {
        ...this.tokens.colors,
        ...customTokens.colors
      },
      typography: {
        ...this.tokens.typography,
        ...customTokens.typography
      },
      spacing: {
        ...this.tokens.spacing,
        ...customTokens.spacing
      },
      borderRadius: {
        ...this.tokens.borderRadius,
        ...customTokens.borderRadius
      },
      boxShadow: {
        ...this.tokens.boxShadow,
        ...customTokens.boxShadow
      },
      zIndex: {
        ...this.tokens.zIndex,
        ...customTokens.zIndex
      },
      breakpoints: {
        ...this.tokens.breakpoints,
        ...customTokens.breakpoints
      },
      transition: {
        ...this.tokens.transition,
        ...customTokens.transition
      }
    };

    return theme;
  }

  generateCSSVariables(theme) {
    const cssVars = [];
    
    // Color variables
    Object.entries(theme.colors).forEach(([colorName, colorScale]) => {
      Object.entries(colorScale).forEach(([shade, value]) => {
        cssVars.push(`--color-${colorName}-${shade}: ${value};`);
      });
    });
    
    // Typography variables
    Object.entries(theme.typography.fontSize).forEach(([size, config]) => {
      cssVars.push(`--font-size-${size}: ${config[0]};`);
      cssVars.push(`--line-height-${size}: ${config[1].lineHeight};`);
    });
    
    Object.entries(theme.typography.fontWeight).forEach(([weight, value]) => {
      cssVars.push(`--font-weight-${weight}: ${value};`);
    });
    
    // Spacing variables
    Object.entries(theme.spacing).forEach(([size, value]) => {
      cssVars.push(`--spacing-${size}: ${value};`);
    });
    
    // Border radius variables
    Object.entries(theme.borderRadius).forEach(([size, value]) => {
      cssVars.push(`--border-radius-${size}: ${value};`);
    });
    
    // Box shadow variables
    Object.entries(theme.boxShadow).forEach(([size, value]) => {
      cssVars.push(`--box-shadow-${size}: ${value};`);
    });
    
    // Z-index variables
    Object.entries(theme.zIndex).forEach(([size, value]) => {
      cssVars.push(`--z-index-${size}: ${value};`);
    });
    
    // Breakpoint variables
    Object.entries(theme.breakpoints).forEach(([size, value]) => {
      cssVars.push(`--breakpoint-${size}: ${value};`);
    });
    
    // Transition variables
    Object.entries(theme.transition.duration).forEach(([duration, value]) => {
      cssVars.push(`--transition-duration-${duration}: ${value};`);
    });
    
    Object.entries(theme.transition.timingFunction).forEach(([timing, value]) => {
      cssVars.push(`--transition-timing-${timing}: ${value};`);
    });
    
    return `:root {\n  ${cssVars.join('\n  ')}\n}`;
  }

  generateTailwindConfig(theme) {
    return {
      theme: {
        extend: {
          colors: theme.colors,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.fontSize,
          fontWeight: theme.typography.fontWeight,
          letterSpacing: theme.typography.letterSpacing,
          lineHeight: theme.typography.lineHeight,
          spacing: theme.spacing,
          borderRadius: theme.borderRadius,
          boxShadow: theme.boxShadow,
          zIndex: theme.zIndex,
          screens: theme.breakpoints,
          transitionDuration: theme.transition.duration,
          transitionTimingFunction: theme.transition.timingFunction
        }
      }
    };
  }
}

// Predefined themes
export const themes = {
  light: new ThemeGenerator('light').generateTheme(),
  dark: new ThemeGenerator('dark').generateTheme({
    colors: {
      primary: designTokens.colors.primary,
      secondary: designTokens.colors.secondary,
      success: designTokens.colors.success,
      warning: designTokens.colors.warning,
      error: designTokens.colors.error,
      info: designTokens.colors.info,
      neutral: designTokens.colors.neutral
    }
  }),
  highContrast: new ThemeGenerator('high-contrast').generateTheme({
    colors: {
      primary: {
        50: '#ffffff',
        100: '#ffffff',
        200: '#ffffff',
        300: '#ffffff',
        400: '#ffffff',
        500: '#000000',
        600: '#000000',
        700: '#000000',
        800: '#000000',
        900: '#000000',
        950: '#000000'
      },
      secondary: {
        50: '#ffffff',
        100: '#ffffff',
        200: '#ffffff',
        300: '#ffffff',
        400: '#ffffff',
        500: '#000000',
        600: '#000000',
        700: '#000000',
        800: '#000000',
        900: '#000000',
        950: '#000000'
      }
    }
  })
};

// Utility functions
export const designUtils = {
  // Get color value
  getColor: (colorName, shade = 500) => {
    return designTokens.colors[colorName]?.[shade] || '#000000';
  },
  
  // Get spacing value
  getSpacing: (size) => {
    return designTokens.spacing[size] || '0px';
  },
  
  // Get font size
  getFontSize: (size) => {
    return designTokens.typography.fontSize[size]?.[0] || '1rem';
  },
  
  // Get line height
  getLineHeight: (size) => {
    return designTokens.typography.fontSize[size]?.[1]?.lineHeight || '1.5rem';
  },
  
  // Get border radius
  getBorderRadius: (size) => {
    return designTokens.borderRadius[size] || '0px';
  },
  
  // Get box shadow
  getBoxShadow: (size) => {
    return designTokens.boxShadow[size] || 'none';
  },
  
  // Get z-index
  getZIndex: (size) => {
    return designTokens.zIndex[size] || '0';
  },
  
  // Get breakpoint
  getBreakpoint: (size) => {
    return designTokens.breakpoints[size] || '0px';
  },
  
  // Generate responsive classes
  responsive: (classes) => {
    return Object.entries(classes)
      .map(([breakpoint, classNames]) => {
        if (breakpoint === 'base') return classNames;
        return `@media (min-width: ${designTokens.breakpoints[breakpoint]}) { ${classNames} }`;
      })
      .join(' ');
  }
};

export default {
  designTokens,
  componentTokens,
  ThemeGenerator,
  themes,
  designUtils
};