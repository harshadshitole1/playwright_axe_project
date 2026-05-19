const fs = require('fs');
const path = require('path');

async function captureIssueScreenshots(page, name, violations = []) {
  const dir = path.resolve('reports/screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < violations.length; i++) {
    const issue = violations[i];
    const safeId = issue.id.replace(/[^a-z0-9]/gi, '_');
    const fileName = `${name}-${safeId}-${i + 1}.png`;

    await page.screenshot({
      path: path.join(dir, fileName),
      fullPage: true
    });
  }
}

module.exports = { captureIssueScreenshots };
