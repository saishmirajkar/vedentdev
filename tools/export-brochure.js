// Re-export brochure/index.html to PDF after editing it.
// Usage (from the repo root):  python3 -m http.server 8000 &  then  node tools/export-brochure.js
// Needs Playwright: npm i -D playwright && npx playwright install chromium
const { chromium } = require('playwright');
const url = process.argv[2] || 'http://localhost:8000/brochure/index.html';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  });
  await page.pdf({ path: 'brochure/Vedant-Residency-Brochure.pdf', width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('Saved brochure/Vedant-Residency-Brochure.pdf');
})();
