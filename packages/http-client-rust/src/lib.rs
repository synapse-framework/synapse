use napi_derive::napi;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;
use tokio_rustls::TlsConnector;
use rustls::ClientConfig;
use url::Url;

#[napi]
pub struct HttpClient {
    base_url: Option<String>,
    default_headers: HashMap<String, String>,
    timeout: u32,
}

#[napi(object)]
#[derive(Serialize, Deserialize)]
pub struct HttpResponse {
    pub data: serde_json::Value,
    pub status: u16,
    pub status_text: String,
    pub headers: HashMap<String, String>,
}

#[napi(object)]
#[derive(Serialize, Deserialize)]
pub struct HttpRequestConfig {
    pub method: Option<String>,
    pub headers: Option<HashMap<String, String>>,
    pub data: Option<serde_json::Value>,
    pub timeout: Option<u32>,
    pub params: Option<HashMap<String, String>>,
}

#[napi]
impl HttpClient {
    #[napi(constructor)]
    pub fn new(base_url: Option<String>) -> Self {
        let mut default_headers = HashMap::new();
        default_headers.insert("User-Agent".to_string(), "Synapse-HTTP-Client-Rust/0.1.0".to_string());
        default_headers.insert("Accept".to_string(), "application/json".to_string());
        default_headers.insert("Content-Type".to_string(), "application/json".to_string());

        Self {
            base_url,
            default_headers,
            timeout: 5000,
        }
    }

    #[napi]
    pub async fn request(&self, url: String, config: Option<HttpRequestConfig>) -> napi::Result<HttpResponse> {
        let config = config.unwrap_or_default();
        let full_url = self.build_url(&url);
        let method = config.method.unwrap_or_else(|| "GET".to_string());
        let timeout = config.timeout.unwrap_or(self.timeout);
        
        let mut headers = self.default_headers.clone();
        if let Some(config_headers) = config.headers {
            headers.extend(config_headers);
        }

        let response = self.make_request(&full_url, &method, &headers, config.data, timeout).await?;
        Ok(response)
    }

    #[napi]
    pub async fn get(&self, url: String, config: Option<HttpRequestConfig>) -> napi::Result<HttpResponse> {
        let mut config = config.unwrap_or_default();
        config.method = Some("GET".to_string());
        self.request(url, Some(config)).await
    }

    #[napi]
    pub async fn post(&self, url: String, data: Option<serde_json::Value>, config: Option<HttpRequestConfig>) -> napi::Result<HttpResponse> {
        let mut config = config.unwrap_or_default();
        config.method = Some("POST".to_string());
        config.data = data;
        self.request(url, Some(config)).await
    }

    #[napi]
    pub async fn put(&self, url: String, data: Option<serde_json::Value>, config: Option<HttpRequestConfig>) -> napi::Result<HttpResponse> {
        let mut config = config.unwrap_or_default();
        config.method = Some("PUT".to_string());
        config.data = data;
        self.request(url, Some(config)).await
    }

    #[napi]
    pub async fn patch(&self, url: String, data: Option<serde_json::Value>, config: Option<HttpRequestConfig>) -> napi::Result<HttpResponse> {
        let mut config = config.unwrap_or_default();
        config.method = Some("PATCH".to_string());
        config.data = data;
        self.request(url, Some(config)).await
    }

    #[napi]
    pub async fn delete(&self, url: String, config: Option<HttpRequestConfig>) -> napi::Result<HttpResponse> {
        let mut config = config.unwrap_or_default();
        config.method = Some("DELETE".to_string());
        self.request(url, Some(config)).await
    }

    fn build_url(&self, url: &str) -> String {
        if let Some(base) = &self.base_url {
            if url.starts_with("http://") || url.starts_with("https://") {
                url.to_string()
            } else {
                format!("{}/{}", base.trim_end_matches('/'), url.trim_start_matches('/'))
            }
        } else {
            url.to_string()
        }
    }

    async fn make_request(
        &self,
        url: &str,
        method: &str,
        headers: &HashMap<String, String>,
        data: Option<serde_json::Value>,
        timeout_ms: u32,
    ) -> napi::Result<HttpResponse> {
        let parsed_url = Url::parse(url)
            .map_err(|e| napi::Error::new(napi::Status::InvalidArg, format!("Invalid URL: {}", e)))?;

        let host = parsed_url.host_str()
            .ok_or_else(|| napi::Error::new(napi::Status::InvalidArg, "Missing host in URL"))?;
        let port = parsed_url.port().unwrap_or(if parsed_url.scheme() == "https" { 443 } else { 80 });
        let path = if parsed_url.path().is_empty() { "/" } else { parsed_url.path() };

        let body = if let Some(data) = data {
            serde_json::to_string(&data)
                .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("JSON serialization error: {}", e)))?
        } else {
            String::new()
        };

        let request = self.build_http_request(method, path, headers, &body, &parsed_url);
        
        let response = if parsed_url.scheme() == "https" {
            self.make_https_request(host, port, &request, timeout_ms).await?
        } else {
            self.make_http_request(host, port, &request, timeout_ms).await?
        };

        self.parse_http_response(response).await
    }

    fn build_http_request(
        &self,
        method: &str,
        path: &str,
        headers: &HashMap<String, String>,
        body: &str,
        url: &Url,
    ) -> String {
        let mut request = format!("{} {} HTTP/1.1\r\n", method, path);
        request.push_str(&format!("Host: {}\r\n", url.host_str().unwrap()));
        
        for (key, value) in headers {
            request.push_str(&format!("{}: {}\r\n", key, value));
        }
        
        if !body.is_empty() {
            request.push_str(&format!("Content-Length: {}\r\n", body.len()));
        }
        
        request.push_str("\r\n");
        request.push_str(body);
        request
    }

    async fn make_http_request(
        &self,
        host: &str,
        port: u16,
        request: &str,
        _timeout_ms: u32,
    ) -> napi::Result<String> {
        let addr = format!("{}:{}", host, port);
        let mut stream = TcpStream::connect(&addr)
            .await
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Connection failed: {}", e)))?;

        stream.write_all(request.as_bytes())
            .await
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Write failed: {}", e)))?;

        let mut response = String::new();
        stream.read_to_string(&mut response)
            .await
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Read failed: {}", e)))?;

        Ok(response)
    }

    async fn make_https_request(
        &self,
        host: &str,
        port: u16,
        request: &str,
        _timeout_ms: u32,
    ) -> napi::Result<String> {
        let addr = format!("{}:{}", host, port);
        let stream = TcpStream::connect(&addr)
            .await
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Connection failed: {}", e)))?;

        // Create rustls config with native certificates
        let mut root_store = rustls::RootCertStore::empty();
        let certs = rustls_native_certs::load_native_certs();
        for cert in certs.certs {
            root_store.add(cert)
                .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Failed to add cert: {}", e)))?;
        }
        if root_store.is_empty() {
            return Err(napi::Error::new(napi::Status::GenericFailure, "No valid certificates found"));
        }

        let config = ClientConfig::builder()
            .with_root_certificates(root_store)
            .with_no_client_auth();

        let connector = TlsConnector::from(Arc::new(config));
        let domain = rustls::pki_types::ServerName::try_from(host.to_string())
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Invalid hostname: {}", e)))?;

        let mut tls_stream = connector.connect(domain, stream)
            .await
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("TLS handshake failed: {}", e)))?;

        tls_stream.write_all(request.as_bytes())
            .await
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Write failed: {}", e)))?;

        let mut response = String::new();
        tls_stream.read_to_string(&mut response)
            .await
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Read failed: {}", e)))?;

        Ok(response)
    }

    async fn parse_http_response(&self, response: String) -> napi::Result<HttpResponse> {
        let mut lines = response.lines();
        let status_line = lines.next()
            .ok_or_else(|| napi::Error::new(napi::Status::GenericFailure, "Empty response"))?;

        let parts: Vec<&str> = status_line.split_whitespace().collect();
        if parts.len() < 3 {
            return Err(napi::Error::new(napi::Status::GenericFailure, "Invalid status line"));
        }

        let status: u16 = parts[1].parse()
            .map_err(|e| napi::Error::new(napi::Status::GenericFailure, format!("Invalid status code: {}", e)))?;

        let status_text = parts[2..].join(" ");
        let mut headers = HashMap::new();
        let mut body_lines = Vec::new();
        let mut in_body = false;

        for line in lines {
            if in_body {
                body_lines.push(line);
            } else if line.is_empty() {
                in_body = true;
            } else if let Some((key, value)) = self.parse_header(line) {
                headers.insert(key, value);
            }
        }

        let body = body_lines.join("\n");
        let data = if body.is_empty() {
            serde_json::Value::Null
        } else {
            serde_json::from_str(&body).unwrap_or_else(|_| serde_json::Value::String(body))
        };

        Ok(HttpResponse {
            data,
            status,
            status_text,
            headers,
        })
    }

    fn parse_header(&self, line: &str) -> Option<(String, String)> {
        if let Some(colon_pos) = line.find(':') {
            let key = line[..colon_pos].trim().to_string();
            let value = line[colon_pos + 1..].trim().to_string();
            Some((key, value))
        } else {
            None
        }
    }
}

impl Default for HttpRequestConfig {
    fn default() -> Self {
        Self {
            method: None,
            headers: None,
            data: None,
            timeout: None,
            params: None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_http_client_creation() {
        let client = HttpClient::new(Some("https://api.example.com".to_string()));
        assert!(client.base_url.is_some());
        assert_eq!(client.timeout, 5000);
    }

    #[tokio::test]
    async fn test_build_url() {
        let client = HttpClient::new(Some("https://api.example.com".to_string()));
        let url = client.build_url("/users");
        assert_eq!(url, "https://api.example.com/users");
    }

    #[tokio::test]
    async fn test_build_url_with_full_url() {
        let client = HttpClient::new(Some("https://api.example.com".to_string()));
        let url = client.build_url("https://other.com/test");
        assert_eq!(url, "https://other.com/test");
    }
}