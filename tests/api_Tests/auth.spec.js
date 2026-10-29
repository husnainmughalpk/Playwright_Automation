import { test, expect } from '@playwright/test';
import AuthAPI from './services/AuthAPI.js';
import UsersAPI from './services/UsersAPI.js';
import { generateUser } from './testdata/userData.js';
import { attachApiLog } from './apiLogger.js';

async function deleteTestUser(request, auth, user, testInfo) {
  await test.step('Clean up test account', async () => {
    const loginResponse = await auth.loginUser({ username: user.username, password: user.password });
    await attachApiLog(testInfo, 'Cleanup Login Response', loginResponse);
    const deleteResponse = await new UsersAPI(request, auth.getToken()).deleteUser();
    await attachApiLog(testInfo, 'Cleanup Delete User Response', deleteResponse);
  });
}

test('TC_REGISTER_001 - Register user successfully', async ({ request }, testInfo) => {
  const auth = new AuthAPI(request);
  const user = generateUser();
  let response;

  await test.step('Register new user', async () => {
    response = await auth.registerUser(user);
    await attachApiLog(testInfo, 'Register User Response', response);
  });

  await test.step('Verify registration response', async () => {
    expect(response.status()).toBe(201);
    expect((await response.json()).data.username).toBe(user.username);
  });

  await deleteTestUser(request, auth, user, testInfo);
});

test('TC_REGISTER_003 - Reject registration with missing fields', async ({ request }, testInfo) => {
  const auth = new AuthAPI(request);
  let response;

  await test.step('Submit incomplete registration', async () => {
    response = await auth.registerUser({ username: generateUser().username });
    await attachApiLog(testInfo, 'Incomplete Registration Response', response);
  });

  await test.step('Verify missing-field error', async () => {
    expect(response.status()).toBe(400);
    expect((await response.json()).success).toBe(false);
  });
});

test('TC_REGISTER_004 - Reject duplicate user', async ({ request }, testInfo) => {
  const auth = new AuthAPI(request);
  const user = generateUser();
  let response;

  await test.step('Register user once', async () => {
    response = await auth.registerUser(user);
    await attachApiLog(testInfo, 'Initial Registration Response', response);
  });
  await test.step('Verify first registration', async () => {
    expect(response.status()).toBe(201);
  });

  await test.step('Register same user again', async () => {
    response = await auth.registerUser(user);
    await attachApiLog(testInfo, 'Duplicate Registration Response', response);
  });
  await test.step('Verify duplicate is rejected', async () => {
    expect(response.status()).toBe(409);
  });

  await deleteTestUser(request, auth, user, testInfo);
});

test('TC_LOGIN_001 - Login with valid credentials', async ({ request }, testInfo) => {
  const auth = new AuthAPI(request);
  const user = generateUser();
  let response;

  await test.step('Register fresh user', async () => {
    response = await auth.registerUser(user);
    await attachApiLog(testInfo, 'Register User Response', response);
  });
  await test.step('Verify registration', async () => {
    expect(response.status()).toBe(201);
  });

  await test.step('Login as new user', async () => {
    response = await auth.loginUser({ username: user.username, password: user.password });
    await attachApiLog(testInfo, 'Login Response', response);
  });
  await test.step('Verify login and access token', async () => {
    expect(response.status()).toBe(200);
    expect(auth.getToken()).toBeTruthy();
  });

  await test.step('Clean up test account', async () => {
    const deleteResponse = await new UsersAPI(request, auth.getToken()).deleteUser();
    await attachApiLog(testInfo, 'Delete User Response', deleteResponse);
  });
});

test('TC_LOGIN_002 - Reject invalid credentials', async ({ request }, testInfo) => {
  const auth = new AuthAPI(request);
  const user = generateUser();
  let response;

  await test.step('Register fresh user', async () => {
    response = await auth.registerUser(user);
    await attachApiLog(testInfo, 'Register User Response', response);
  });
  await test.step('Verify registration', async () => {
    expect(response.status()).toBe(201);
  });

  await test.step('Login with wrong password', async () => {
    response = await auth.loginUser({ username: user.username, password: 'WrongPassword123!' });
    await attachApiLog(testInfo, 'Invalid Login Response', response);
  });
  await test.step('Verify unauthorized response', async () => {
    expect(response.status()).toBe(401);
    expect((await response.json()).success).toBe(false);
  });

  await deleteTestUser(request, auth, user, testInfo);
});

test('TC_LOGIN_003 - Reject login with missing fields', async ({ request }, testInfo) => {
  const auth = new AuthAPI(request);
  let response;

  await test.step('Submit login without username or email', async () => {
    response = await auth.loginUser({ password: 'Password123!' });
    await attachApiLog(testInfo, 'Incomplete Login Response', response);
  });
  await test.step('Verify bad request response', async () => {
    expect(response.status()).toBe(400);
    expect((await response.json()).success).toBe(false);
  });
});
