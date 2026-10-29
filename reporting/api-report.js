const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const resultsDir = path.join(root, 'allure-results');
const outputFile = path.join(root, 'allure-report', 'api-summary.html');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

async function readApiResults() {
  const files = await fs.readdir(resultsDir);
  const results = [];

  for (const file of files.filter((name) => name.endsWith('-result.json'))) {
    const result = JSON.parse(await fs.readFile(path.join(resultsDir, file), 'utf8'));
    const labels = result.labels || [];
    if (!labels.some(({ name, value }) => name === 'parentSuite' && value === 'api')) continue;

    results.push({
      name: result.name || 'Unnamed API test',
      status: result.status || 'unknown',
      suite: labels.find(({ name }) => name === 'suite')?.value || 'API tests',
      duration: Math.max(0, (result.stop || 0) - (result.start || 0)),
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

function render(results) {
  const count = (status) => results.filter((test) => test.status === status).length;
  const passed = count('passed');
  const failed = count('failed') + count('broken');
  const skipped = count('skipped');
  const total = results.length;
  const passRate = total ? Math.round((passed / total) * 100) : 0;
  const cards = [
    ['Total', total, 'total'],
    ['Passed', passed, 'passed'],
    ['Failed / Broken', failed, 'failed'],
    ['Skipped', skipped, 'skipped'],
  ].map(([label, value, style]) => `<article class="stat ${style}"><span>${label}</span><strong>${value}</strong></article>`).join('');
  const testCards = results.map((test) => `
    <article class="test">
      <div><span class="status ${escapeHtml(test.status)}">${escapeHtml(test.status)}</span><small>${escapeHtml(test.suite)}</small></div>
      <h2>${escapeHtml(test.name)}</h2>
      <p>${(test.duration / 1000).toFixed(1)}s</p>
    </article>`).join('') || '<p class="empty">No API test results found. Run the API project first.</p>';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>API Test Summary</title>
  <style>
    :root { font-family: Inter, system-ui, Arial, sans-serif; color: #17233b; background: #f4f7fb; }
    * { box-sizing: border-box; }
    body { margin: 0; }
    main { max-width: 1100px; margin: 0 auto; padding: 44px 24px 72px; }
    header { display: flex; justify-content: space-between; align-items: start; gap: 24px; margin-bottom: 28px; }
    .eyebrow { color: #315bd6; font-weight: 800; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; }
    h1 { font-size: clamp(30px, 4vw, 46px); margin: 8px 0; letter-spacing: -.04em; }
    .subtitle, .generated { color: #64748b; margin: 0; }
    a { color: #315bd6; text-decoration: none; font-weight: 700; }
    a:hover { text-decoration: underline; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .stat, .summary, .test { background: #fff; border: 1px solid #e5eaf2; border-radius: 18px; box-shadow: 0 6px 22px rgba(30, 46, 82, .05); }
    .stat { padding: 22px; border-top: 4px solid #94a3b8; }
    .stat span { display: block; color: #64748b; font-size: 14px; }
    .stat strong { display: block; font-size: 36px; margin-top: 8px; }
    .stat.passed { border-color: #1aa674; } .stat.failed { border-color: #e05555; } .stat.skipped { border-color: #e6a23c; }
    .summary { margin: 18px 0 34px; padding: 22px; }
    .summary-head { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 12px; }
    .bar { height: 12px; background: #e9edf5; border-radius: 20px; overflow: hidden; }
    .bar-fill { width: ${passRate}%; height: 100%; background: #1aa674; border-radius: inherit; }
    .section-title { font-size: 21px; margin: 0 0 16px; }
    .tests { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .test { padding: 20px; }
    .test > div { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .test h2 { font-size: 16px; line-height: 1.4; margin: 14px 0 8px; }
    .test p, .test small { margin: 0; color: #64748b; }
    .status { display: inline-block; padding: 5px 10px; border-radius: 100px; background: #e8edf5; color: #475569; font-size: 12px; font-weight: 800; text-transform: capitalize; }
    .status.passed { background: #def7ec; color: #087e54; }
    .status.failed, .status.broken { background: #fde9e9; color: #b42332; }
    .status.skipped { background: #fff2d9; color: #925e00; }
    .empty { color: #64748b; }
    @media (max-width: 700px) { header { display: block; } .stats, .tests { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 450px) { .stats, .tests { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <header><div><div class="eyebrow">Playwright API automation</div><h1>API Test Summary</h1><p class="subtitle">Latest results from the API project</p></div><a href="./index.html">Open full Allure report →</a></header>
    <section class="stats" aria-label="Result counts">${cards}</section>
    <section class="summary"><div class="summary-head"><span>Pass rate</span><span>${passRate}%</span></div><div class="bar" role="progressbar" aria-valuenow="${passRate}" aria-valuemin="0" aria-valuemax="100"><div class="bar-fill"></div></div></section>
    <h2 class="section-title">Test cases</h2><section class="tests">${testCards}</section>
    <p class="generated">Generated ${escapeHtml(new Date().toLocaleString())}</p>
  </main>
</body>
</html>`;
}

async function main() {
  const results = await readApiResults();
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, render(results), 'utf8');
  console.log(`API summary created: ${outputFile} (${results.length} tests)`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
