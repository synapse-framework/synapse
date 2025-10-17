import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { URL } from 'node:url';
import { EventEmitter } from 'node:events';

export class HttpClient extends EventEmitter {
  private baseURL?: string;
  private defaultConfig: RequestConfig;

  constructor(baseURL?: string, defaultConfig: Partial<RequestConfig> = {}) {
    super();
    this.baseURL = baseURL;
    this.defaultConfig = {
      timeout: 5000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Synapse-HTTP-Client/0.1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      ...defaultConfig,
    };
  }

  async request<T = any>(config: RequestConfig): Promise<Response<T>> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const url = this.buildURL(mergedConfig.url!);
    
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const requestOptions = this.buildRequestOptions(url, mergedConfig);
      
      const req = this.isHttps(url) 
        ? httpsRequest(requestOptions, (res) => this.handleResponse(res, resolve, reject, startTime, mergedConfig))
        : httpRequest(requestOptions, (res) => this.handleResponse(res, resolve, reject, startTime, mergedConfig));

      req.on('error', (error) => {
        this.emit('error', error);
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${mergedConfig.timeout}ms`));
      });

      if (mergedConfig.timeout) {
        req.setTimeout(mergedConfig.timeout);
      }

      if (mergedConfig.data) {
        const body = this.serializeData(mergedConfig.data, mergedConfig.headers);
        req.write(body);
      }

      req.end();
    });
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<Response<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  private buildURL(url: string): URL {
    if (this.baseURL) {
      return new URL(url, this.baseURL);
    }
    return new URL(url);
  }

  private isHttps(url: URL): boolean {
    return url.protocol === 'https:';
  }

  private buildRequestOptions(url: URL, config: RequestConfig): any {
    const options: any = {
      hostname: url.hostname,
      port: url.port || (this.isHttps(url) ? 443 : 80),
      path: url.pathname + url.search,
      method: config.method || 'GET',
      headers: config.headers || {},
    };

    if (config.auth) {
      const auth = Buffer.from(`${config.auth.username}:${config.auth.password}`).toString('base64');
      options.headers['Authorization'] = `Basic ${auth}`;
    }

    return options;
  }

  private handleResponse(
    res: any,
    resolve: (value: Response<any>) => void,
    reject: (reason?: any) => void,
    startTime: number,
    config: RequestConfig
  ): void {
    const responseTime = Date.now() - startTime;
    let data = '';

    res.on('data', (chunk: Buffer) => {
      data += chunk.toString();
    });

    res.on('end', () => {
      try {
        const response: Response<any> = {
          data: this.parseResponse(data, res.headers['content-type']),
          status: res.statusCode!,
          statusText: res.statusMessage || '',
          headers: res.headers,
          config,
          responseTime,
        };

        this.emit('response', response);

        if (res.statusCode! >= 200 && res.statusCode! < 300) {
          resolve(response);
        } else {
          const error = new Error(`Request failed with status ${res.statusCode}`);
          (error as any).response = response;
          (error as any).code = res.statusCode;
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });

    res.on('error', (error: Error) => {
      reject(error);
    });
  }

  private serializeData(data: any, headers: Record<string, string>): string {
    const contentType = headers['Content-Type'] || 'application/json';
    
    if (contentType.includes('application/json')) {
      return JSON.stringify(data);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      return new URLSearchParams(data).toString();
    } else if (typeof data === 'string') {
      return data;
    } else {
      return JSON.stringify(data);
    }
  }

  private parseResponse(data: string, contentType?: string): any {
    if (!data) return data;
    
    if (contentType?.includes('application/json')) {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    
    return data;
  }
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url?: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
  maxRedirects?: number;
  auth?: {
    username: string;
    password: string;
  };
}

export interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
  responseTime: number;
}

// Create default instance
export const http = new HttpClient();

// Export for compatibility
export default HttpClient;