import { Card } from '../src/index.js';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: 'A flexible card component for displaying grouped content with various styles and interactions.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title'
    },
    subtitle: {
      control: 'text',
      description: 'Card subtitle'
    },
    children: {
      control: 'text',
      description: 'Card content'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined', 'filled'],
      description: 'Card variant'
    },
    hoverable: {
      control: 'boolean',
      description: 'Hover effect'
    },
    clickable: {
      control: 'boolean',
      description: 'Clickable card'
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

// Basic card
export const Default = {
  args: {
    title: 'Card Title',
    children: '<p>This is a basic card with some content.</p>'
  },
  render: (args) => {
    const card = new Card(args);
    return card.render();
  }
};

// Card with subtitle
export const WithSubtitle = {
  args: {
    title: 'Card Title',
    subtitle: 'This is a subtitle',
    children: '<p>Card content goes here.</p>'
  },
  render: (args) => {
    const card = new Card(args);
    return card.render();
  }
};

// Card variants
export const Variants = {
  render: () => {
    const defaultCard = new Card({ 
      title: 'Default',
      children: '<p>Default card variant</p>'
    });
    const elevated = new Card({ 
      title: 'Elevated',
      variant: 'elevated',
      children: '<p>Elevated card with shadow</p>'
    });
    const outlined = new Card({ 
      title: 'Outlined',
      variant: 'outlined',
      children: '<p>Outlined card variant</p>'
    });
    const filled = new Card({ 
      title: 'Filled',
      variant: 'filled',
      children: '<p>Filled card variant</p>'
    });
    
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${defaultCard.render()}
        ${elevated.render()}
        ${outlined.render()}
        ${filled.render()}
      </div>
    `;
  }
};

// Hoverable cards
export const Hoverable = {
  render: () => {
    const hoverable = new Card({ 
      title: 'Hoverable Card',
      children: '<p>Hover over this card to see the effect.</p>',
      hoverable: true
    });
    const clickable = new Card({ 
      title: 'Clickable Card',
      children: '<p>Click this card to interact.</p>',
      clickable: true,
      hoverable: true
    });
    
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${hoverable.render()}
        ${clickable.render()}
      </div>
    `;
  }
};

// Card without title
export const WithoutTitle = {
  args: {
    children: '<p>This card has no title, just content.</p>'
  },
  render: (args) => {
    const card = new Card(args);
    return card.render();
  }
};

// Card grid
export const CardGrid = {
  render: () => {
    const cards = [
      { title: 'Feature 1', children: '<p>Description of feature 1</p>' },
      { title: 'Feature 2', children: '<p>Description of feature 2</p>' },
      { title: 'Feature 3', children: '<p>Description of feature 3</p>' },
      { title: 'Feature 4', children: '<p>Description of feature 4</p>' }
    ];
    
    const cardElements = cards.map(cardData => {
      const card = new Card({ ...cardData, hoverable: true });
      return card.render();
    });
    
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        ${cardElements.join('')}
      </div>
    `;
  }
};