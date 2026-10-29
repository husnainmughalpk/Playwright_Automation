export async function attachApiLog(testInfo, title, response) {
  const text = await response.text();

  await testInfo.attach(title, {
    body: JSON.stringify({
      status: response.status(),
      response: text,
    }, null, 2),
    contentType: 'application/json',
  });
}
