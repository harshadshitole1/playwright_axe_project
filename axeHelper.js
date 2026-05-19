const { AxeBuilder } = require('@axe-core/playwright');
const axeConfig = require('../config/axeConfig.js');

async function runAxe(page) {
  return new AxeBuilder({ page })
    .withTags(axeConfig.tags || ['wcag2a', 'wcag2aa'])
    .exclude(axeConfig.exclude || [])
    .include('body')
    .analyze();
}

module.exports = { runAxe };
