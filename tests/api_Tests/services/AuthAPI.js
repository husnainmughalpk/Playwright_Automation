import BaseAPI from './BaseAPI.js';

class AuthAPI extends BaseAPI {
  registerUser(data) {
    return this.post('/users/register', data);
  }

  async loginUser(data) {
    const response = await this.post('/users/login', data);
    this.accessToken = response.ok() ? (await response.json()).data?.accessToken : undefined;
    return response;
  }

  getToken() {
    return this.accessToken;
  }
}

export default AuthAPI;
