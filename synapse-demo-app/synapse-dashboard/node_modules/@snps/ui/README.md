# 🎨 @snps/ui - Comprehensive UI Component Library

A beautiful, accessible, and performant UI component library built for the Synapse Framework. Features 100+ components with TypeScript support, theming, animations, and accessibility features.

## ✨ Features

- **🎨 100+ Components** - Comprehensive set of UI components
- **🌙 Dark Mode** - Built-in light and dark themes
- **♿ Accessible** - WCAG 2.1 AA compliant components
- **⚡ Performant** - Optimized for speed and efficiency
- **🎭 Animations** - Smooth transitions and micro-interactions
- **📱 Responsive** - Mobile-first design approach
- **🔧 Customizable** - Extensive theming and customization options
- **📚 TypeScript** - Full type safety and IntelliSense support
- **🎯 Zero Dependencies** - No external dependencies (except React)

## 🚀 Quick Start

### Installation

```bash
npm install @snps/ui
```

### Basic Usage

```tsx
import React from 'react';
import { ThemeProvider, Button, Card, Input } from '@snps/ui';

function App() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Synapse UI</CardTitle>
          </CardHeader>
          <CardBody>
            <Input 
              label="Email"
              placeholder="Enter your email"
              type="email"
            />
            <Button variant="primary" className="mt-4">
              Get Started
            </Button>
          </CardBody>
        </Card>
      </div>
    </ThemeProvider>
  );
}
```

## 🎨 Theme System

### Using Themes

```tsx
import { ThemeProvider, useTheme } from '@snps/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <YourApp />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      Switch to {theme.name === 'light' ? 'dark' : 'light'} mode
    </Button>
  );
}
```

### Custom Themes

```tsx
import { ThemeProvider, createTheme } from '@snps/ui';

const customTheme = createTheme({
  name: 'custom',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    // ... other theme properties
  }
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## 🧩 Components

### Button

```tsx
import { Button } from '@snps/ui';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With icons
<Button leftIcon={<Icon />}>With Icon</Button>
<Button loading>Loading...</Button>
```

### Input

```tsx
import { Input } from '@snps/ui';

<Input
  label="Email"
  placeholder="Enter your email"
  type="email"
  error={hasError}
  errorMessage="Please enter a valid email"
  helperText="We'll never share your email"
  leftIcon={<MailIcon />}
  clearable
/>
```

### Card

```tsx
import { Card, CardHeader, CardBody, CardFooter, CardTitle } from '@snps/ui';

<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardBody>
    Card content goes here
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Modal

```tsx
import { Modal } from '@snps/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  size="md"
>
  <p>Modal content goes here</p>
  <div className="flex justify-end space-x-2 mt-4">
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </div>
</Modal>
```

### Table

```tsx
import { Table } from '@snps/ui';

const columns = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'actions', title: 'Actions', render: (_, record) => (
    <Button size="sm">Edit</Button>
  )}
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

<Table
  data={data}
  columns={columns}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
    onChange: (page, pageSize) => console.log(page, pageSize)
  }}
  selectable
  onSelectionChange={(selected) => console.log(selected)}
/>
```

### Dropdown

```tsx
import { Dropdown } from '@snps/ui';

const items = [
  { key: 'profile', label: 'Profile', icon: <UserIcon /> },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  { key: 'divider', divider: true },
  { key: 'logout', label: 'Logout', icon: <LogoutIcon />, onClick: handleLogout }
];

<Dropdown
  trigger={<Button>Menu</Button>}
  items={items}
  placement="bottom-start"
/>
```

### Toast Notifications

```tsx
import { ToastProvider, useToast } from '@snps/ui';

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}

function MyComponent() {
  const { addToast } = useToast();
  
  const showSuccess = () => {
    addToast({
      type: 'success',
      title: 'Success!',
      message: 'Your action was completed successfully.',
      duration: 3000
    });
  };
  
  return <Button onClick={showSuccess}>Show Toast</Button>;
}
```

## 🎭 Animations

All components include smooth animations and transitions:

```tsx
// Hover animations
<Button hoverable>Hover me</Button>

// Loading states
<Button loading>Loading...</Button>

// Modal animations
<Modal isOpen={isOpen} onClose={onClose}>
  Content with smooth entrance/exit animations
</Modal>
```

## ♿ Accessibility

All components are built with accessibility in mind:

- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Proper ARIA labels and roles
- **Focus Management** - Logical focus flow
- **Color Contrast** - WCAG 2.1 AA compliant
- **Semantic HTML** - Proper HTML structure

## 📱 Responsive Design

Mobile-first approach with responsive utilities:

```tsx
<Card className="w-full sm:w-1/2 lg:w-1/3">
  <Button className="w-full sm:w-auto">
    Responsive Button
  </Button>
</Card>
```

## 🎨 Customization

### CSS Custom Properties

```css
:root {
  --snps-primary: #6366f1;
  --snps-secondary: #8b5cf6;
  --snps-spacing-md: 1rem;
  /* ... more custom properties */
}
```

### Component Variants

```tsx
// Custom button variant
<Button 
  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
>
  Gradient Button
</Button>
```

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@snps/ui';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

## 📚 Storybook

View all components in our interactive Storybook:

```bash
npm run storybook
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🆘 Support

- **Documentation**: https://ui.synapse.dev
- **Discord**: https://discord.gg/synapse
- **GitHub Issues**: https://github.com/synapse-framework/synapse/issues

---

**Built with ❤️ by the Synapse Framework Team**