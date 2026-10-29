import { test, expect } from '@playwright/test';
import AuthAPI from './services/AuthAPI.js';
import UsersAPI from './services/UsersAPI.js';
import { generateUser } from './testdata/userData.js';
import { attachApiLog } from './apiLogger.js';

async function createAuthenticatedUser(request, testInfo) {
  const user = generateUser();
  const auth = new AuthAPI(request);
  let response;

  await test.step('Register a fresh account', async () => {
    response = await auth.registerUser(user);
    await attachApiLog(testInfo, 'Register User Response', response);
  });
  await test.step('Verify registration', async () => {
    expect(response.status()).toBe(201);
  });

  await test.step('Login to the API', async () => {
    response = await auth.loginUser({ username: user.username, password: user.password });
    await attachApiLog(testInfo, 'Login Response', response);
  });
  await test.step('Verify login', async () => {
    expect(response.status()).toBe(200);
    expect(auth.getToken()).toBeTruthy();
  });

  return { user, users: new UsersAPI(request, auth.getToken()) };
}

async function deleteTestUser(users, testInfo) {
  await test.step('Clean up test account', async () => {
    const response = await users.deleteUser();
    await attachApiLog(testInfo, 'Delete User Response', response);
  });
}

test('TC_USER_001 - Get current authenticated user', async ({ request }, testInfo) => {
  const { user, users } = await createAuthenticatedUser(request, testInfo);
  let response;

  await test.step('Get current user', async () => {
    response = await users.getCurrentUser();
    await attachApiLog(testInfo, 'Get Current User Response', response);
  });
  await test.step('Verify current user', async () => {
    expect(response.status()).toBe(200);
    expect((await response.json()).data.username).toBe(user.username);
  });

  await deleteTestUser(users, testInfo);
});

test('TC_USER_002 - Reject request without authentication', async ({ request }, testInfo) => {
  const users = new UsersAPI(request);
  let response;

  await test.step('Get current user without login', async () => {
    response = await users.getCurrentUser();
    await attachApiLog(testInfo, 'Unauthenticated User Response', response);
  });
  await test.step('Verify unauthorized response', async () => {
    expect(response.status()).toBe(401);
  });
});

test('TC_USER_003 - Update user details', async ({ request }, testInfo) => {
  const { user, users } = await createAuthenticatedUser(request, testInfo);
  const changes = { fullname: `Updated ${user.fullname}`, email: `updated${user.email}` };
  let response;

  await test.step('Update user details', async () => {
    response = await users.updateUser(changes);
    await attachApiLog(testInfo, 'Update User Response', response);
  });
  await test.step('Verify updated details', async () => {
    expect(response.status()).toBe(200);
    expect((await response.json()).data).toMatchObject(changes);
  });

  await deleteTestUser(users, testInfo);
});

test('TC_USER_004 - Replace user details', async ({ request }, testInfo) => {
  const { user, users } = await createAuthenticatedUser(request, testInfo);
  const replacement = {
    fullname: `Replaced ${user.fullname}`,
    email: `replaced${user.email}`,
    username: `replaced${user.username}`,
  };
  let response;

  await test.step('Replace user details', async () => {
    response = await users.replaceUser(replacement);
    await attachApiLog(testInfo, 'Replace User Response', response);
  });
  await test.step('Verify replaced details', async () => {
    expect(response.status()).toBe(200);
    expect((await response.json()).data).toMatchObject(replacement);
  });

  await deleteTestUser(users, testInfo);
});

test('TC_USER_005 - Delete user account', async ({ request }, testInfo) => {
  const { users } = await createAuthenticatedUser(request, testInfo);
  let response;

  await test.step('Delete account', async () => {
    response = await users.deleteUser();
    await attachApiLog(testInfo, 'Delete User Response', response);
  });
  await test.step('Verify deletion', async () => {
    expect(response.status()).toBe(200);
    expect((await response.json()).success).toBe(true);
  });
});

test('TC_USER_006 - Get all users', async ({ request }, testInfo) => {
  const users = new UsersAPI(request);
  let response;

  await test.step('Get all users', async () => {
    response = await users.getAllUsers();
    await attachApiLog(testInfo, 'Get All Users Response', response);
  });
  await test.step('Verify user collection', async () => {
    expect(response.status()).toBe(200);
    expect(Array.isArray((await response.json()).data)).toBe(true);
  });
});

test('TC_USER_007 - Get user by username', async ({ request }, testInfo) => {
  const { user, users } = await createAuthenticatedUser(request, testInfo);
  let response;

  await test.step('Get user by username', async () => {
    response = await users.getUserByUsername(user.username);
    await attachApiLog(testInfo, 'Get User by Username Response', response);
  });
  await test.step('Verify matching username', async () => {
    expect(response.status()).toBe(200);
    expect((await response.json()).data.username).toBe(user.username);
  });

  await deleteTestUser(users, testInfo);
});
