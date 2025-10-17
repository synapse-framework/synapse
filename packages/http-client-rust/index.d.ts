export interface HttpResponse {
  data: any;
  status: number;
  status_text: string;
  headers: Record<string, string>;
}

export interface HttpRequestConfig {
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  timeout?: number;
  params?: Record<string, string>;
}

export class HttpClient {
  constructor(baseUrl?: string);
  
  request(url: string, config?: HttpRequestConfig): Promise<HttpResponse>;
  get(url: string, config?: HttpRequestConfig): Promise<HttpResponse>;
  post(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse>;
  put(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse>;
  patch(url: string, data?: any, config?: HttpRequestConfig): Promise<HttpResponse>;
  delete(url: string, config?: HttpRequestConfig): Promise<HttpResponse>;
}