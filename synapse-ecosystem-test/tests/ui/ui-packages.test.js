import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';

// UI Packages Tests
describe('UI Packages', () => {
  let uiComponents, cli;

  before(async () => {
    // Import UI packages
    const { Button, Card, Input, Modal, Table, Form, Alert, Badge, Spinner, Tooltip } = await import('@snps/ui');
    const { SynapseCLI } = await import('@snps/cli');

    // Initialize instances
    uiComponents = {
      Button,
      Card,
      Input,
      Modal,
      Table,
      Form,
      Alert,
      Badge,
      Spinner,
      Tooltip
    };

    cli = new SynapseCLI({
      name: 'test-cli',
      version: '1.0.0',
      description: 'Test CLI'
    });
  });

  describe('@snps/ui - UI Components', () => {
    test('should create Button component', () => {
      const button = new uiComponents.Button({
        text: 'Click me',
        variant: 'primary',
        size: 'medium'
      });

      assert(button instanceof uiComponents.Button);
      assert.strictEqual(button.text, 'Click me');
      assert.strictEqual(button.variant, 'primary');
      assert.strictEqual(button.size, 'medium');
    });

    test('should create Button with different variants', () => {
      const variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
      
      for (const variant of variants) {
        const button = new uiComponents.Button({
          text: 'Test',
          variant: variant
        });
        assert.strictEqual(button.variant, variant);
      }
    });

    test('should create Button with different sizes', () => {
      const sizes = ['small', 'medium', 'large'];
      
      for (const size of sizes) {
        const button = new uiComponents.Button({
          text: 'Test',
          size: size
        });
        assert.strictEqual(button.size, size);
      }
    });

    test('should create Card component', () => {
      const card = new uiComponents.Card({
        title: 'Test Card',
        content: 'This is a test card',
        footer: 'Card footer'
      });

      assert(card instanceof uiComponents.Card);
      assert.strictEqual(card.title, 'Test Card');
      assert.strictEqual(card.content, 'This is a test card');
      assert.strictEqual(card.footer, 'Card footer');
    });

    test('should create Input component', () => {
      const input = new uiComponents.Input({
        placeholder: 'Enter text...',
        type: 'text',
        value: '',
        required: true
      });

      assert(input instanceof uiComponents.Input);
      assert.strictEqual(input.placeholder, 'Enter text...');
      assert.strictEqual(input.type, 'text');
      assert.strictEqual(input.required, true);
    });

    test('should create Input with different types', () => {
      const types = ['text', 'email', 'password', 'number', 'tel', 'url'];
      
      for (const type of types) {
        const input = new uiComponents.Input({
          type: type,
          placeholder: 'Test'
        });
        assert.strictEqual(input.type, type);
      }
    });

    test('should create Modal component', () => {
      const modal = new uiComponents.Modal({
        title: 'Test Modal',
        content: 'This is a test modal',
        isOpen: false,
        onClose: () => {}
      });

      assert(modal instanceof uiComponents.Modal);
      assert.strictEqual(modal.title, 'Test Modal');
      assert.strictEqual(modal.content, 'This is a test modal');
      assert.strictEqual(modal.isOpen, false);
      assert(typeof modal.onClose === 'function');
    });

    test('should create Table component', () => {
      const data = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 }
      ];

      const columns = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' },
        { key: 'age', title: 'Age' }
      ];

      const table = new uiComponents.Table({
        data: data,
        columns: columns,
        sortable: true,
        pagination: true
      });

      assert(table instanceof uiComponents.Table);
      assert.strictEqual(table.data.length, 2);
      assert.strictEqual(table.columns.length, 3);
      assert.strictEqual(table.sortable, true);
      assert.strictEqual(table.pagination, true);
    });

    test('should create Form component', () => {
      const fields = [
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'age', type: 'number', label: 'Age', required: false }
      ];

      const form = new uiComponents.Form({
        fields: fields,
        onSubmit: (data) => console.log(data),
        validation: true
      });

      assert(form instanceof uiComponents.Form);
      assert.strictEqual(form.fields.length, 3);
      assert(typeof form.onSubmit === 'function');
      assert.strictEqual(form.validation, true);
    });

    test('should create Alert component', () => {
      const alert = new uiComponents.Alert({
        message: 'This is an alert',
        type: 'info',
        dismissible: true
      });

      assert(alert instanceof uiComponents.Alert);
      assert.strictEqual(alert.message, 'This is an alert');
      assert.strictEqual(alert.type, 'info');
      assert.strictEqual(alert.dismissible, true);
    });

    test('should create Alert with different types', () => {
      const types = ['info', 'success', 'warning', 'error'];
      
      for (const type of types) {
        const alert = new uiComponents.Alert({
          message: 'Test',
          type: type
        });
        assert.strictEqual(alert.type, type);
      }
    });

    test('should create Badge component', () => {
      const badge = new uiComponents.Badge({
        text: 'New',
        variant: 'success',
        size: 'small'
      });

      assert(badge instanceof uiComponents.Badge);
      assert.strictEqual(badge.text, 'New');
      assert.strictEqual(badge.variant, 'success');
      assert.strictEqual(badge.size, 'small');
    });

    test('should create Spinner component', () => {
      const spinner = new uiComponents.Spinner({
        size: 'medium',
        color: 'primary'
      });

      assert(spinner instanceof uiComponents.Spinner);
      assert.strictEqual(spinner.size, 'medium');
      assert.strictEqual(spinner.color, 'primary');
    });

    test('should create Tooltip component', () => {
      const tooltip = new uiComponents.Tooltip({
        content: 'This is a tooltip',
        position: 'top',
        trigger: 'hover'
      });

      assert(tooltip instanceof uiComponents.Tooltip);
      assert.strictEqual(tooltip.content, 'This is a tooltip');
      assert.strictEqual(tooltip.position, 'top');
      assert.strictEqual(tooltip.trigger, 'hover');
    });

    test('should handle component events', () => {
      let clicked = false;
      const button = new uiComponents.Button({
        text: 'Click me',
        onClick: () => { clicked = true; }
      });

      button.click();
      assert.strictEqual(clicked, true);
    });

    test('should handle component state changes', () => {
      const input = new uiComponents.Input({
        value: 'initial',
        onChange: (value) => {
          input.value = value;
        }
      });

      input.setValue('new value');
      assert.strictEqual(input.value, 'new value');
    });

    test('should validate form fields', () => {
      const form = new uiComponents.Form({
        fields: [
          { name: 'email', type: 'email', required: true },
          { name: 'password', type: 'password', required: true, minLength: 8 }
        ],
        validation: true
      });

      const validData = { email: 'test@example.com', password: 'password123' };
      const invalidData = { email: 'invalid-email', password: '123' };

      assert.strictEqual(form.validate(validData), true);
      assert.strictEqual(form.validate(invalidData), false);
    });
  });

  describe('@snps/cli - SynapseCLI', () => {
    test('should create CLI instance', () => {
      assert(cli instanceof SynapseCLI);
      assert.strictEqual(cli.name, 'test-cli');
      assert.strictEqual(cli.version, '1.0.0');
      assert.strictEqual(cli.description, 'Test CLI');
    });

    test('should have required methods', () => {
      assert(typeof cli.command === 'function');
      assert(typeof cli.option === 'function');
      assert(typeof cli.parse === 'function');
      assert(typeof cli.help === 'function');
    });

    test('should add commands', () => {
      cli.command('init', 'Initialize a new project')
        .option('-t, --template <template>', 'Project template')
        .action((options) => {
          console.log('Init command executed');
        });

      const commands = cli.getCommands();
      assert(Array.isArray(commands));
      assert(commands.some(cmd => cmd.name === 'init'));
    });

    test('should add options', () => {
      cli.option('-v, --verbose', 'Verbose output');
      cli.option('-c, --config <file>', 'Config file path');

      const options = cli.getOptions();
      assert(Array.isArray(options));
      assert(options.length >= 2);
    });

    test('should parse command line arguments', () => {
      const args = ['init', '--template', 'react', '--verbose'];
      const parsed = cli.parse(args);
      
      assert(typeof parsed === 'object');
      assert.strictEqual(parsed.command, 'init');
      assert.strictEqual(parsed.template, 'react');
      assert.strictEqual(parsed.verbose, true);
    });

    test('should show help information', () => {
      const help = cli.help();
      assert(typeof help === 'string');
      assert(help.length > 0);
      assert(help.includes('test-cli'));
      assert(help.includes('Commands:'));
      assert(help.includes('Options:'));
    });

    test('should handle command execution', (done) => {
      cli.command('test', 'Test command')
        .action(() => {
          done();
        });

      cli.parse(['test']);
    });

    test('should handle command errors', (done) => {
      cli.command('error', 'Error command')
        .action(() => {
          throw new Error('Command error');
        });

      cli.on('error', (error) => {
        assert(error.message === 'Command error');
        done();
      });

      cli.parse(['error']);
    });

    test('should support command chaining', () => {
      const chained = cli.command('build', 'Build project')
        .option('-o, --output <dir>', 'Output directory')
        .option('-w, --watch', 'Watch mode')
        .action(() => {});

      assert(chained === cli); // Should return CLI instance for chaining
    });

    test('should handle version command', () => {
      cli.command('version', 'Show version')
        .action(() => {
          console.log(cli.version);
        });

      const parsed = cli.parse(['version']);
      assert.strictEqual(parsed.command, 'version');
    });
  });
});