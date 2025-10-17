import { EventEmitter } from 'node:events';
import { WebSocket } from 'node:ws';
import { HttpClient } from '@snps/http-client';

export class DiscordClient extends EventEmitter {
  private gatewayUrl: string | null = null;
  private socket: WebSocket | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private http: HttpClient;
  private token: string;
  private sessionId: string | null = null;
  private sequence: number | null = null;

  constructor(token: string) {
    super();
    this.token = token;
    this.http = new HttpClient('https://discord.com/api/v10');
  }

  async login(): Promise<void> {
    try {
      this.gatewayUrl = await this.getGatewayUrl();
      await this.connectToGateway();
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  private async getGatewayUrl(): Promise<string> {
    const response = await this.http.get('/gateway/bot', {
      headers: {
        'Authorization': `Bot ${this.token}`,
      },
    });

    return `${response.data.url}?v=10&encoding=json`;
  }

  private async connectToGateway(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.gatewayUrl!);

      this.socket.on('open', () => {
        console.log('🔗 Connected to Discord Gateway');
        resolve();
      });

      this.socket.on('message', (data) => {
        const payload = JSON.parse(data.toString());
        this.handleGatewayPayload(payload);
      });

      this.socket.on('close', () => {
        console.log('🔌 Disconnected from Discord Gateway');
        this.cleanup();
      });

      this.socket.on('error', (error) => {
        console.error('❌ Discord Gateway error:', error);
        reject(error);
      });
    });
  }

  private handleGatewayPayload(payload: GatewayPayload): void {
    const { op, d, t, s } = payload;

    if (s !== null) {
      this.sequence = s;
    }

    switch (op) {
      case 10: // Hello
        this.startHeartbeat(d.heartbeat_interval);
        this.identify();
        break;

      case 0: // Dispatch
        this.handleDispatch(t, d);
        break;

      case 11: // Heartbeat ACK
        // Heartbeat acknowledged
        break;

      case 7: // Reconnect
        this.reconnect();
        break;

      case 9: // Invalid Session
        this.identify();
        break;

      default:
        console.log(`Unknown opcode: ${op}`);
    }
  }

  private handleDispatch(event: string, data: any): void {
    switch (event) {
      case 'READY':
        this.sessionId = data.session_id;
        this.emit('ready', data);
        break;
      case 'MESSAGE_CREATE':
        this.emit('message', data);
        break;
      case 'MESSAGE_UPDATE':
        this.emit('messageUpdate', data);
        break;
      case 'MESSAGE_DELETE':
        this.emit('messageDelete', data);
        break;
      case 'GUILD_CREATE':
        this.emit('guildCreate', data);
        break;
      case 'GUILD_UPDATE':
        this.emit('guildUpdate', data);
        break;
      case 'GUILD_DELETE':
        this.emit('guildDelete', data);
        break;
      default:
        this.emit(event, data);
    }
  }

  private identify(): void {
    this.send({
      op: 2, // Identify
      d: {
        token: this.token,
        intents: 513, // GUILDS | GUILD_MESSAGES
        properties: {
          $os: 'linux',
          $browser: 'synapse-bot',
          $device: 'synapse-bot',
        },
        shard: [0, 1],
      },
    });
  }

  private startHeartbeat(interval: number): void {
    this.heartbeatInterval = setInterval(() => {
      this.send({ op: 1, d: this.sequence }); // Heartbeat
    }, interval);
  }

  private send(payload: GatewayPayload): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private reconnect(): void {
    this.cleanup();
    this.connectToGateway();
  }

  // REST API Methods
  async sendMessage(channelId: string, content: string): Promise<Message> {
    const response = await this.http.post(`/channels/${channelId}/messages`, {
      content,
    }, {
      headers: {
        'Authorization': `Bot ${this.token}`,
      },
    });
    return response.data;
  }

  async createEmbed(channelId: string, embed: EmbedData): Promise<Message> {
    const response = await this.http.post(`/channels/${channelId}/messages`, {
      embeds: [embed],
    }, {
      headers: {
        'Authorization': `Bot ${this.token}`,
      },
    });
    return response.data;
  }

  async addReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    await this.http.put(`/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, {}, {
      headers: {
        'Authorization': `Bot ${this.token}`,
      },
    });
  }

  async getGuild(guildId: string): Promise<Guild> {
    const response = await this.http.get(`/guilds/${guildId}`, {
      headers: {
        'Authorization': `Bot ${this.token}`,
      },
    });
    return response.data;
  }

  async getChannel(channelId: string): Promise<Channel> {
    const response = await this.http.get(`/channels/${channelId}`, {
      headers: {
        'Authorization': `Bot ${this.token}`,
      },
    });
    return response.data;
  }

  async getUser(userId: string): Promise<User> {
    const response = await this.http.get(`/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${this.token}`,
      },
    });
    return response.data;
  }

  destroy(): void {
    this.cleanup();
    if (this.socket) {
      this.socket.close();
    }
  }
}

// Discord API Types
interface GatewayPayload {
  op: number;
  d?: any;
  t?: string;
  s?: number | null;
}

interface Message {
  id: string;
  channel_id: string;
  content: string;
  author: User;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: User[];
  mention_roles: string[];
  attachments: any[];
  embeds: EmbedData[];
  reactions?: any[];
  pinned: boolean;
  type: number;
}

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

interface Channel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  name?: string;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: string | null;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: User[];
  icon?: string | null;
  owner_id?: string;
  application_id?: string;
  parent_id?: string | null;
  last_pin_timestamp?: string | null;
  rtc_region?: string | null;
  video_quality_mode?: number;
  message_count?: number;
  member_count?: number;
  thread_metadata?: any;
  member?: any;
  default_auto_archive_duration?: number;
  permissions?: string;
  flags?: number;
}

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  icon_hash?: string | null;
  splash: string | null;
  discovery_splash: string | null;
  owner?: boolean;
  owner_id: string;
  permissions?: string;
  region?: string | null;
  afk_channel_id: string | null;
  afk_timeout: number;
  widget_enabled?: boolean;
  widget_channel_id?: string | null;
  verification_level: number;
  default_message_notifications: number;
  explicit_content_filter: number;
  roles: any[];
  emojis: any[];
  features: string[];
  mfa_level: number;
  application_id: string | null;
  system_channel_id: string | null;
  system_channel_flags: number;
  rules_channel_id: string | null;
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code: string | null;
  description: string | null;
  banner: string | null;
  premium_tier: number;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id: string | null;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: any;
  nsfw_level: number;
  stickers?: any[];
  premium_progress_bar_enabled: boolean;
}

interface EmbedData {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

interface EmbedFooter {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

interface EmbedImage {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

interface EmbedThumbnail {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

interface EmbedVideo {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

interface EmbedProvider {
  name?: string;
  url?: string;
}

interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export default DiscordClient;