const path = require('path');
const { test, expect } = require('@playwright/test');
const { runAxe } = require('../../utils/axeHelper');
const { generateReports } = require('../../utils/reportHelper');
const { captureIssueScreenshots } = require('../../utils/screenshotHelper');
const { sendReportEmail } = require('../../utils/emailHelper');

const baseURL = process.env.BASE_URL;

test('Accessibility Report', async ({ page, browserName }) => {
  if (!baseURL) throw new Error("❌ BASE_URL not defined");

  await page.goto(baseURL);
  await page.waitForSelector('body', { timeout: 15000 });

  const results = await runAxe(page);
  const pageTitle = (await page.title()) || 'no-title';
  const safeTitle = pageTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  const { htmlPath, jsonPath, fileBaseName } =
    generateReports(results, safeTitle, browserName);

  await captureIssueScreenshots(page, `${safeTitle}-${browserName}`, results.violations);

  const criticalIssues = results.violations.filter(v =>
    ['critical', 'serious'].includes(v.impact)
  );

  if (criticalIssues.length > 0) {
    await sendReportEmail(
      process.env.DEV_EMAIL,
      `Accessibility Report - ${safeTitle}`,
      `Found ${criticalIssues.length} critical/serious issues. See attached reports.`,
      [
        path.join(htmlPath, `${fileBaseName}.html`),
        path.join(jsonPath, `${fileBaseName}.json`)
      ]
    );
  }

  expect(criticalIssues.length).toBe(0);
});


// Playwright Commands:

// npm install
// npm install @axe-core/playwright axe-html-reporter
// npx playwright test
// npx playwright show-report
// npm install dotenv

// GIT Commands:

// git status → Check changes
// git add <file> → Stage a file
// git add . → Stage all files
// git commit -m "message" → Commit changes
// git push origin <branch> → Push changes
// current remotes:  git remote -v
//Remove the GitHub remote: git remote remove origin
