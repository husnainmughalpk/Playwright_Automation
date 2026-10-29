export function generateUser() {
  const id = `${Date.now()}${Math.floor(Math.random() * 100000)}`;

  return {
    fullname: `Test User ${id}`,
    email: `test${id}@example.com`,
    username: `test${id}`,
    password: 'Password123!',
  };
}
