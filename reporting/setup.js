import fs from 'node:fs/promises';
import path from 'node:path';

export default async function setup() {
  const root = path.resolve(__dirname, '..');

  await fs.rm(path.join(root, 'allure-results'), { recursive: true, force: true });
  await fs.rm(path.join(root, 'allure-report'), { recursive: true, force: true });
}
