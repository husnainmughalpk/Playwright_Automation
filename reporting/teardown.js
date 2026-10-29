import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';

export default async function teardown() {
  const root = path.resolve(__dirname, '..');
  const allureCli = path.join(path.dirname(require.resolve('allure-commandline')), 'bin', 'allure');
  const reportDir = path.join(root, 'allure-report');

  execFileSync(process.execPath, [
    allureCli, 'generate', path.join(root, 'allure-results'), '--clean', '-o', reportDir,
  ], { cwd: root, stdio: 'inherit', windowsHide: true, timeout: 110_000 });

  if (!process.env.CI && process.env.ALLURE_OPEN !== 'never') {
    const server = spawn(process.execPath, [allureCli, 'open', reportDir], {
      cwd: root, detached: true, stdio: 'ignore', windowsHide: true,
    });
    await once(server, 'spawn');
    server.unref();
  }
}
