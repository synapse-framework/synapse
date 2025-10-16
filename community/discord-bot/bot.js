// Synapse Framework Discord Bot
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

class SynapseDiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ]
    });
    
    this.prefix = '!synapse';
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.once('ready', () => {
      console.log(`🤖 Synapse Bot is online as ${this.client.user.tag}!`);
      this.setActivity();
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      if (!message.content.startsWith(this.prefix)) return;

      const args = message.content.slice(this.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      try {
        await this.handleCommand(message, command, args);
      } catch (error) {
        console.error('Command error:', error);
        await message.reply('❌ An error occurred while processing your command.');
      }
    });
  }

  setActivity() {
    this.client.user.setActivity('Synapse Framework | !synapse help', { type: 'WATCHING' });
  }

  async handleCommand(message, command, args) {
    switch (command) {
      case 'help':
        await this.helpCommand(message);
        break;
      case 'docs':
        await this.docsCommand(message, args);
        break;
      case 'install':
        await this.installCommand(message, args);
        break;
      case 'version':
        await this.versionCommand(message);
        break;
      case 'status':
        await this.statusCommand(message);
        break;
      case 'search':
        await this.searchCommand(message, args);
        break;
      case 'template':
        await this.templateCommand(message, args);
        break;
      case 'plugin':
        await this.pluginCommand(message, args);
        break;
      case 'example':
        await this.exampleCommand(message, args);
        break;
      case 'community':
        await this.communityCommand(message);
        break;
      case 'news':
        await this.newsCommand(message);
        break;
      default:
        await this.unknownCommand(message, command);
    }
  }

  async helpCommand(message) {
    const embed = new EmbedBuilder()
      .setTitle('🚀 Synapse Framework Bot Help')
      .setDescription('Here are the available commands:')
      .setColor(0x2563eb)
      .addFields(
        {
          name: '📚 Documentation',
          value: '`!synapse docs [topic]` - Get documentation links\n`!synapse example [type]` - Show code examples',
          inline: false
        },
        {
          name: '🛠️ Development',
          value: '`!synapse install [package]` - Install packages\n`!synapse version` - Check versions\n`!synapse status` - System status',
          inline: false
        },
        {
          name: '🔍 Search',
          value: '`!synapse search [query]` - Search documentation\n`!synapse template [name]` - Find templates\n`!synapse plugin [name]` - Find plugins',
          inline: false
        },
        {
          name: '🌐 Community',
          value: '`!synapse community` - Community links\n`!synapse news` - Latest news',
          inline: false
        }
      )
      .setFooter({ text: 'Synapse Framework • Zero-dependency TypeScript-first' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Website')
          .setStyle(ButtonStyle.Link)
          .setURL('https://synapse-framework.dev'),
        new ButtonBuilder()
          .setLabel('GitHub')
          .setStyle(ButtonStyle.Link)
          .setURL('https://github.com/synapse-framework/synapse'),
        new ButtonBuilder()
          .setLabel('Discord')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/synapse-framework')
      );

    await message.reply({ embeds: [embed], components: [row] });
  }

  async docsCommand(message, args) {
    const topic = args[0] || 'general';
    const docLinks = {
      'general': 'https://synapse-framework.dev/docs',
      'getting-started': 'https://synapse-framework.dev/docs/getting-started',
      'api': 'https://synapse-framework.dev/docs/api',
      'components': 'https://synapse-framework.dev/docs/components',
      'routing': 'https://synapse-framework.dev/docs/routing',
      'state': 'https://synapse-framework.dev/docs/state',
      'testing': 'https://synapse-framework.dev/docs/testing',
      'deployment': 'https://synapse-framework.dev/docs/deployment'
    };

    const link = docLinks[topic] || docLinks['general'];
    
    const embed = new EmbedBuilder()
      .setTitle(`📚 Synapse Documentation - ${topic.charAt(0).toUpperCase() + topic.slice(1)}`)
      .setDescription(`Here's the documentation for **${topic}**:`)
      .setColor(0x2563eb)
      .addFields(
        {
          name: '🔗 Link',
          value: `[View Documentation](${link})`,
          inline: false
        },
        {
          name: '💡 Quick Start',
          value: '```bash\nnpm install -g @snps/cli\nsynapse init my-app\ncd my-app && synapse dev\n```',
          inline: false
        }
      )
      .setFooter({ text: 'Need help? Ask in #help channel!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  async installCommand(message, args) {
    const packageName = args[0];
    if (!packageName) {
      await message.reply('❌ Please specify a package name. Example: `!synapse install @snps/ui`');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('📦 Package Installation')
      .setDescription(`Installing **${packageName}**...`)
      .setColor(0x22c55e)
      .addFields(
        {
          name: 'Command',
          value: `\`npm install ${packageName}\``,
          inline: false
        },
        {
          name: 'Or with Synapse CLI',
          value: `\`synapse add ${packageName}\``,
          inline: false
        }
      )
      .setFooter({ text: 'Package installation instructions' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  async versionCommand(message) {
    try {
      const response = await axios.get('https://registry.npmjs.org/@snps/core');
      const latestVersion = response.data['dist-tags'].latest;
      
      const embed = new EmbedBuilder()
        .setTitle('📊 Synapse Framework Versions')
        .setColor(0x2563eb)
        .addFields(
          {
            name: 'Latest Version',
            value: `**${latestVersion}**`,
            inline: true
          },
          {
            name: 'Node.js',
            value: '18.0.0+',
            inline: true
          },
          {
            name: 'TypeScript',
            value: '5.0.0+',
            inline: true
          }
        )
        .setFooter({ text: 'Check for updates regularly!' })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (error) {
      await message.reply('❌ Could not fetch version information.');
    }
  }

  async statusCommand(message) {
    const embed = new EmbedBuilder()
      .setTitle('🟢 Synapse Framework Status')
      .setColor(0x22c55e)
      .addFields(
        {
          name: 'Website',
          value: '🟢 Online',
          inline: true
        },
        {
          name: 'NPM Registry',
          value: '🟢 Online',
          inline: true
        },
        {
          name: 'GitHub',
          value: '🟢 Online',
          inline: true
        },
        {
          name: 'Documentation',
          value: '🟢 Online',
          inline: true
        },
        {
          name: 'API',
          value: '🟢 Online',
          inline: true
        },
        {
          name: 'Discord Bot',
          value: '🟢 Online',
          inline: true
        }
      )
      .setFooter({ text: 'All systems operational' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  async searchCommand(message, args) {
    const query = args.join(' ');
    if (!query) {
      await message.reply('❌ Please provide a search query. Example: `!synapse search components`');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`🔍 Search Results for "${query}"`)
      .setColor(0x2563eb)
      .addFields(
        {
          name: '📚 Documentation',
          value: `[Search Docs](https://synapse-framework.dev/search?q=${encodeURIComponent(query)})`,
          inline: false
        },
        {
          name: '📦 NPM Packages',
          value: `[Search NPM](https://www.npmjs.com/search?q=${encodeURIComponent(query)})`,
          inline: false
        },
        {
          name: '🐙 GitHub',
          value: `[Search GitHub](https://github.com/synapse-framework/synapse/search?q=${encodeURIComponent(query)})`,
          inline: false
        }
      )
      .setFooter({ text: 'Try different keywords for better results' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  async templateCommand(message, args) {
    const templateName = args[0] || 'list';
    
    if (templateName === 'list') {
      const embed = new EmbedBuilder()
        .setTitle('🎨 Available Templates')
        .setColor(0x2563eb)
        .addFields(
          {
            name: '🏠 Landing Pages',
            value: '• startup-landing\n• saas-landing\n• portfolio\n• agency\n• ecommerce',
            inline: true
          },
          {
            name: '📱 Web Apps',
            value: '• admin-dashboard\n• crm-system\n• project-management\n• blog-platform\n• e-learning',
            inline: true
          },
          {
            name: '🏢 Enterprise',
            value: '• corporate-website\n• documentation\n• support-portal\n• intranet\n• compliance',
            inline: true
          }
        )
        .setFooter({ text: 'Use !synapse template [name] for details' })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle(`🎨 Template: ${templateName}`)
        .setColor(0x2563eb)
        .addFields(
          {
            name: 'Install Command',
            value: `\`synapse template:install ${templateName}\``,
            inline: false
          },
          {
            name: 'Create Project',
            value: `\`synapse init my-app --template ${templateName}\``,
            inline: false
          },
          {
            name: 'View Details',
            value: `[Template Gallery](https://synapse-framework.dev/templates/${templateName})`,
            inline: false
          }
        )
        .setFooter({ text: 'Browse all templates at synapse-framework.dev/templates' })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    }
  }

  async pluginCommand(message, args) {
    const pluginName = args[0] || 'list';
    
    if (pluginName === 'list') {
      const embed = new EmbedBuilder()
        .setTitle('🔌 Available Plugins')
        .setColor(0x2563eb)
        .addFields(
          {
            name: '🎨 UI & Design',
            value: '• @snps/plugin-theme-builder\n• @snps/plugin-component-library\n• @snps/plugin-animations',
            inline: true
          },
          {
            name: '🗄️ Database',
            value: '• @snps/plugin-postgres\n• @snps/plugin-mongodb\n• @snps/plugin-redis',
            inline: true
          },
          {
            name: '🔐 Security',
            value: '• @snps/plugin-auth-jwt\n• @snps/plugin-auth-oauth\n• @snps/plugin-security-headers',
            inline: true
          }
        )
        .setFooter({ text: 'Use !synapse plugin [name] for details' })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle(`🔌 Plugin: ${pluginName}`)
        .setColor(0x2563eb)
        .addFields(
          {
            name: 'Install Command',
            value: `\`npm install ${pluginName}\``,
            inline: false
          },
          {
            name: 'Synapse CLI',
            value: `\`synapse plugin:install ${pluginName}\``,
            inline: false
          },
          {
            name: 'View Details',
            value: `[Plugin Marketplace](https://synapse-framework.dev/plugins/${pluginName})`,
            inline: false
          }
        )
        .setFooter({ text: 'Browse all plugins at synapse-framework.dev/plugins' })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    }
  }

  async exampleCommand(message, args) {
    const exampleType = args[0] || 'basic';
    
    const examples = {
      'basic': {
        title: 'Basic App Setup',
        code: `import { SynapseFramework } from '@snps/core';

const app = new SynapseFramework({
  name: 'My App',
  version: '1.0.0'
});

app.start();`
      },
      'component': {
        title: 'Creating a Component',
        code: `import { Button } from '@snps/ui';

const button = new Button({
  children: 'Click me!',
  variant: 'primary',
  onClick: () => console.log('Hello!')
});

document.body.innerHTML = button.render();`
      },
      'routing': {
        title: 'File-based Routing',
        code: `// pages/index.ts
export default function HomePage() {
  return \`<h1>Welcome to Synapse!</h1>\`;
}

// pages/about.ts
export default function AboutPage() {
  return \`<h1>About Us</h1>\`;
}`
      },
      'state': {
        title: 'State Management',
        code: `import { SynapseStateManager } from '@snps/state';

const state = new SynapseStateManager({
  count: 0
});

state.subscribe('count', (value) => {
  console.log('Count:', value);
});

state.set('count', 1);`
      }
    };

    const example = examples[exampleType] || examples['basic'];
    
    const embed = new EmbedBuilder()
      .setTitle(`💡 Example: ${example.title}`)
      .setDescription('```typescript\n' + example.code + '\n```')
      .setColor(0x2563eb)
      .addFields(
        {
          name: 'More Examples',
          value: '[View All Examples](https://synapse-framework.dev/examples)',
          inline: false
        }
      )
      .setFooter({ text: 'Try: !synapse example [basic|component|routing|state]' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  async communityCommand(message) {
    const embed = new EmbedBuilder()
      .setTitle('🌐 Synapse Community')
      .setDescription('Connect with the Synapse community!')
      .setColor(0x2563eb)
      .addFields(
        {
          name: '💬 Discord',
          value: '[Join our Discord](https://discord.gg/synapse-framework)',
          inline: true
        },
        {
          name: '🐙 GitHub',
          value: '[GitHub Repository](https://github.com/synapse-framework/synapse)',
          inline: true
        },
        {
          name: '🐦 Twitter',
          value: '[Follow us](https://twitter.com/synapse_framework)',
          inline: true
        },
        {
          name: '📧 Newsletter',
          value: '[Subscribe](https://synapse-framework.dev/newsletter)',
          inline: true
        },
        {
          name: '📺 YouTube',
          value: '[Watch Tutorials](https://youtube.com/@synapse-framework)',
          inline: true
        },
        {
          name: '📝 Blog',
          value: '[Read Blog](https://synapse-framework.dev/blog)',
          inline: true
        }
      )
      .setFooter({ text: 'Join our amazing community!' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Join Discord')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/synapse-framework'),
        new ButtonBuilder()
          .setLabel('Follow GitHub')
          .setStyle(ButtonStyle.Link)
          .setURL('https://github.com/synapse-framework/synapse')
      );

    await message.reply({ embeds: [embed], components: [row] });
  }

  async newsCommand(message) {
    try {
      // This would typically fetch from an API or RSS feed
      const embed = new EmbedBuilder()
        .setTitle('📰 Latest Synapse News')
        .setColor(0x2563eb)
        .addFields(
          {
            name: '🚀 v0.5.0 Released',
            value: 'New UI library with animations and accessibility support!',
            inline: false
          },
          {
            name: '📱 Mobile Support',
            value: 'React Native and Flutter adapters now available',
            inline: false
          },
          {
            name: '🎨 Design System',
            value: 'Complete design tokens and theme system',
            inline: false
          }
        )
        .setFooter({ text: 'Stay updated with the latest news!' })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (error) {
      await message.reply('❌ Could not fetch latest news.');
    }
  }

  async unknownCommand(message, command) {
    const embed = new EmbedBuilder()
      .setTitle('❓ Unknown Command')
      .setDescription(`Command \`${command}\` not found.`)
      .setColor(0xef4444)
      .addFields(
        {
          name: 'Available Commands',
          value: '`help`, `docs`, `install`, `version`, `status`, `search`, `template`, `plugin`, `example`, `community`, `news`',
          inline: false
        },
        {
          name: 'Get Help',
          value: 'Use `!synapse help` to see all available commands.',
          inline: false
        }
      )
      .setFooter({ text: 'Need help? Ask in #help channel!' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }

  async start() {
    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (error) {
      console.error('Failed to start Discord bot:', error);
    }
  }
}

// Start the bot
const bot = new SynapseDiscordBot();
bot.start();

module.exports = SynapseDiscordBot;