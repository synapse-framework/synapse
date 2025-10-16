// Animation System for @snps/ui
export class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.defaultDuration = 300;
    this.defaultEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  }

  // Fade animations
  fadeIn(element, duration = this.defaultDuration) {
    return this.animate(element, {
      opacity: [0, 1],
      duration,
      easing: this.defaultEasing
    });
  }

  fadeOut(element, duration = this.defaultDuration) {
    return this.animate(element, {
      opacity: [1, 0],
      duration,
      easing: this.defaultEasing
    });
  }

  // Slide animations
  slideInFromTop(element, duration = this.defaultDuration) {
    return this.animate(element, {
      transform: ['translateY(-100%)', 'translateY(0)'],
      opacity: [0, 1],
      duration,
      easing: this.defaultEasing
    });
  }

  slideInFromBottom(element, duration = this.defaultDuration) {
    return this.animate(element, {
      transform: ['translateY(100%)', 'translateY(0)'],
      opacity: [0, 1],
      duration,
      easing: this.defaultEasing
    });
  }

  slideInFromLeft(element, duration = this.defaultDuration) {
    return this.animate(element, {
      transform: ['translateX(-100%)', 'translateX(0)'],
      opacity: [0, 1],
      duration,
      easing: this.defaultEasing
    });
  }

  slideInFromRight(element, duration = this.defaultDuration) {
    return this.animate(element, {
      transform: ['translateX(100%)', 'translateX(0)'],
      opacity: [0, 1],
      duration,
      easing: this.defaultEasing
    });
  }

  // Scale animations
  scaleIn(element, duration = this.defaultDuration) {
    return this.animate(element, {
      transform: ['scale(0)', 'scale(1)'],
      opacity: [0, 1],
      duration,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
  }

  scaleOut(element, duration = this.defaultDuration) {
    return this.animate(element, {
      transform: ['scale(1)', 'scale(0)'],
      opacity: [1, 0],
      duration,
      easing: this.defaultEasing
    });
  }

  // Bounce animations
  bounceIn(element, duration = 600) {
    return this.animate(element, {
      transform: ['scale(0.3)', 'scale(1.05)', 'scale(0.9)', 'scale(1)'],
      opacity: [0, 1, 1, 1],
      duration,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
  }

  // Shake animation
  shake(element, duration = 500) {
    return this.animate(element, {
      transform: [
        'translateX(0)',
        'translateX(-10px)',
        'translateX(10px)',
        'translateX(-10px)',
        'translateX(10px)',
        'translateX(-5px)',
        'translateX(5px)',
        'translateX(0)'
      ],
      duration,
      easing: 'ease-in-out'
    });
  }

  // Pulse animation
  pulse(element, duration = 1000) {
    return this.animate(element, {
      transform: ['scale(1)', 'scale(1.05)', 'scale(1)'],
      duration,
      easing: 'ease-in-out',
      iterations: 'infinite'
    });
  }

  // Wiggle animation
  wiggle(element, duration = 500) {
    return this.animate(element, {
      transform: [
        'rotate(0deg)',
        'rotate(-3deg)',
        'rotate(3deg)',
        'rotate(-3deg)',
        'rotate(3deg)',
        'rotate(0deg)'
      ],
      duration,
      easing: 'ease-in-out'
    });
  }

  // Generic animate method
  animate(element, options) {
    const {
      opacity,
      transform,
      duration = this.defaultDuration,
      easing = this.defaultEasing,
      iterations = 1,
      delay = 0
    } = options;

    const keyframes = [];
    const properties = {};

    if (opacity) {
      properties.opacity = opacity;
    }
    if (transform) {
      properties.transform = transform;
    }

    keyframes.push(properties);

    const animation = element.animate(keyframes, {
      duration,
      easing,
      iterations,
      delay,
      fill: 'forwards'
    });

    // Store animation for potential cleanup
    const animationId = Math.random().toString(36).substr(2, 9);
    this.animations.set(animationId, animation);

    return {
      id: animationId,
      animation,
      finished: animation.finished,
      cancel: () => {
        animation.cancel();
        this.animations.delete(animationId);
      }
    };
  }

  // Cleanup all animations
  cleanup() {
    this.animations.forEach(animation => animation.cancel());
    this.animations.clear();
  }
}

// Predefined animation presets
export const animations = {
  // Entrance animations
  fadeIn: (element, duration) => new AnimationManager().fadeIn(element, duration),
  slideInFromTop: (element, duration) => new AnimationManager().slideInFromTop(element, duration),
  slideInFromBottom: (element, duration) => new AnimationManager().slideInFromBottom(element, duration),
  slideInFromLeft: (element, duration) => new AnimationManager().slideInFromLeft(element, duration),
  slideInFromRight: (element, duration) => new AnimationManager().slideInFromRight(element, duration),
  scaleIn: (element, duration) => new AnimationManager().scaleIn(element, duration),
  bounceIn: (element, duration) => new AnimationManager().bounceIn(element, duration),

  // Exit animations
  fadeOut: (element, duration) => new AnimationManager().fadeOut(element, duration),
  scaleOut: (element, duration) => new AnimationManager().scaleOut(element, duration),

  // Attention animations
  shake: (element, duration) => new AnimationManager().shake(element, duration),
  pulse: (element, duration) => new AnimationManager().pulse(element, duration),
  wiggle: (element, duration) => new AnimationManager().wiggle(element, duration)
};

// CSS transition utilities
export const transitions = {
  // Common transition presets
  fast: '150ms ease-out',
  normal: '300ms ease-out',
  slow: '500ms ease-out',
  bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: '400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  
  // Property-specific transitions
  all: 'all 300ms ease-out',
  opacity: 'opacity 300ms ease-out',
  transform: 'transform 300ms ease-out',
  color: 'color 300ms ease-out',
  background: 'background-color 300ms ease-out',
  border: 'border-color 300ms ease-out',
  boxShadow: 'box-shadow 300ms ease-out'
};

// Hover effects
export const hoverEffects = {
  lift: 'transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);',
  glow: 'box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);',
  scale: 'transform: scale(1.05);',
  rotate: 'transform: rotate(2deg);',
  skew: 'transform: skewX(-2deg);',
  bounce: 'animation: bounce 0.6s ease-in-out;'
};

// Loading animations
export const loadingAnimations = {
  spinner: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    animation: spin 1s linear infinite;
  `,
  
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  `,
  
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
      50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
    }
    animation: bounce 1s infinite;
  `,
  
  wave: `
    @keyframes wave {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(1.5); }
    }
    animation: wave 1s ease-in-out infinite;
  `
};

// Create global animation instance
export const animationManager = new AnimationManager();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    animationManager.cleanup();
  });
}

export default {
  AnimationManager,
  animations,
  transitions,
  hoverEffects,
  loadingAnimations,
  animationManager
};