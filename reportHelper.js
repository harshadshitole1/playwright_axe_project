const fs = require('fs');
const path = require('path');
const { createHtmlReport } = require('axe-html-reporter');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

function generateReports(results, name, browserName) {
  const basePath = path.resolve('reports');
  const htmlPath = path.join(basePath, 'html');
  const jsonPath = path.join(basePath, 'json');

  ensureDir(htmlPath);
  ensureDir(jsonPath);

  const criticalCount = results.violations.filter(v =>
    ['critical', 'serious'].includes(v.impact)
  ).length;

  const fileBaseName = `${name}-${browserName}-${criticalCount}issues-${runTimestamp}`;

  fs.writeFileSync(
    path.join(jsonPath, `${fileBaseName}.json`),
    JSON.stringify(results, null, 2)
  );

  const html = createHtmlReport({
    results,
    options: { reportFileName: `${fileBaseName}.html` }
  });

  fs.writeFileSync(path.join(htmlPath, `${fileBaseName}.html`), html);

  console.log(`
    📊 Accessibility Summary:
    URL: ${name}
    Browser: ${browserName}
    Total Violations: ${results.violations.length}
    Critical/Serious: ${criticalCount}
    Report: ${fileBaseName}.html
  `);

  return { htmlPath, jsonPath, fileBaseName };
}

module.exports = { generateReports };