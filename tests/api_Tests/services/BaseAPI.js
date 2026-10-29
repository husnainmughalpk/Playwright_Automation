import path from 'node:path';

process.loadEnvFile(path.join(__dirname, '..', '..', '..', '.env'));

class BaseAPI {
  constructor(request) {
    this.request = request;
    this.baseURL = process.env.API_BASE_URL;

    if (!this.baseURL) {
      throw new Error('Set API_BASE_URL in the root .env file.');
    }
  }

  url(endpoint) {
    return `${this.baseURL.replace(/\/$/, '')}${endpoint}`;
  }

  get(endpoint, options = {}) {
    return this.request.get(this.url(endpoint), options);
  }

  post(endpoint, data, options = {}) {
    return this.request.post(this.url(endpoint), { ...options, data });
  }

  put(endpoint, data, options = {}) {
    return this.request.put(this.url(endpoint), { ...options, data });
  }

  patch(endpoint, data, options = {}) {
    return this.request.patch(this.url(endpoint), { ...options, data });
  }

  delete(endpoint, options = {}) {
    return this.request.delete(this.url(endpoint), options);
  }
}

export default BaseAPI;
