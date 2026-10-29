import BaseAPI from './BaseAPI.js';

class UsersAPI extends BaseAPI {
  constructor(request, token) {
    super(request);
    this.auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  getCurrentUser() {
    return this.get('/users/current-user', this.auth);
  }

  getAllUsers() {
    return this.get('/users/all-users');
  }

  getUserByUsername(username) {
    return this.get(`/users/user/${encodeURIComponent(username)}`);
  }

  updateUser(data) {
    return this.patch('/users/update-account', data, this.auth);
  }

  replaceUser(data) {
    return this.put('/users/replace-account', data, this.auth);
  }

  deleteUser() {
    return this.delete('/users/delete-account', this.auth);
  }
}

export default UsersAPI;
