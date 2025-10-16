import { animations, transitions, hoverEffects, loadingAnimations } from '../src/index.js';

export default {
  title: 'Animations/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Animation system with various effects and transitions.'
      }
    }
  }
};

// Animation examples
export const EntranceAnimations = {
  render: () => {
    const createDemo = (name, animation) => {
      return `
        <div class="mb-4">
          <h4 class="text-sm font-medium mb-2">${name}</h4>
          <div 
            class="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold cursor-pointer"
            onclick="this.style.opacity='0'; this.style.transform='scale(0)'; setTimeout(() => { this.style.opacity='1'; this.style.transform='scale(1)'; }, 100);"
          >
            Click me
          </div>
        </div>
      `;
    };

    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold">Entrance Animations</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${createDemo('Fade In', 'fadeIn')}
          ${createDemo('Slide From Top', 'slideInFromTop')}
          ${createDemo('Slide From Bottom', 'slideInFromBottom')}
          ${createDemo('Slide From Left', 'slideInFromLeft')}
          ${createDemo('Slide From Right', 'slideInFromRight')}
          ${createDemo('Scale In', 'scaleIn')}
          ${createDemo('Bounce In', 'bounceIn')}
        </div>
      </div>
    `;
  }
};

// Hover effects
export const HoverEffects = {
  render: () => {
    const createHoverDemo = (name, effect) => {
      return `
        <div class="mb-4">
          <h4 class="text-sm font-medium mb-2">${name}</h4>
          <div 
            class="w-20 h-20 bg-green-500 rounded-lg flex items-center justify-center text-white font-semibold transition-all duration-300 ${effect}"
          >
            Hover me
          </div>
        </div>
      `;
    };

    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold">Hover Effects</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${createHoverDemo('Lift', 'hover:transform hover:-translate-y-2 hover:shadow-lg')}
          ${createHoverDemo('Glow', 'hover:shadow-lg hover:shadow-blue-500/25')}
          ${createHoverDemo('Scale', 'hover:scale-105')}
          ${createHoverDemo('Bounce', 'hover:animate-bounce')}
        </div>
      </div>
    `;
  }
};

// Loading animations
export const LoadingAnimations = {
  render: () => {
    const createLoadingDemo = (name, animation) => {
      return `
        <div class="mb-4">
          <h4 class="text-sm font-medium mb-2">${name}</h4>
          <div class="w-20 h-20 bg-purple-500 rounded-lg flex items-center justify-center text-white font-semibold ${animation}">
            Loading
          </div>
        </div>
      `;
    };

    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold">Loading Animations</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${createLoadingDemo('Spinner', 'animate-spin')}
          ${createLoadingDemo('Pulse', 'animate-pulse')}
          ${createLoadingDemo('Bounce', 'animate-bounce')}
          ${createLoadingDemo('Ping', 'animate-ping')}
        </div>
      </div>
    `;
  }
};

// Transition examples
export const Transitions = {
  render: () => {
    const createTransitionDemo = (name, transition) => {
      return `
        <div class="mb-4">
          <h4 class="text-sm font-medium mb-2">${name}</h4>
          <div 
            class="w-20 h-20 bg-orange-500 rounded-lg flex items-center justify-center text-white font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-110"
            style="transition: ${transition}"
          >
            Hover me
          </div>
        </div>
      `;
    };

    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold">Transition Examples</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${createTransitionDemo('Fast', 'all 150ms ease-out')}
          ${createTransitionDemo('Normal', 'all 300ms ease-out')}
          ${createTransitionDemo('Slow', 'all 500ms ease-out')}
          ${createTransitionDemo('Bounce', 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')}
        </div>
      </div>
    `;
  }
};

// Interactive animation playground
export const AnimationPlayground = {
  render: () => {
    return `
      <div class="space-y-6">
        <h3 class="text-lg font-semibold">Animation Playground</h3>
        <div class="space-y-4">
          <div class="flex space-x-2">
            <button 
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onclick="animations.fadeIn(document.getElementById('playground-box'), 500)"
            >
              Fade In
            </button>
            <button 
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onclick="animations.scaleIn(document.getElementById('playground-box'), 500)"
            >
              Scale In
            </button>
            <button 
              class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onclick="animations.bounceIn(document.getElementById('playground-box'), 600)"
            >
              Bounce In
            </button>
            <button 
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onclick="animations.shake(document.getElementById('playground-box'), 500)"
            >
              Shake
            </button>
          </div>
          <div 
            id="playground-box"
            class="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
            style="opacity: 0; transform: scale(0);"
          >
            Animate Me!
          </div>
        </div>
      </div>
    `;
  }
};