const puppeteer = require("puppeteer");

(async () => {
const browser = await puppeteer.launch({
  headless: "new",
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});
  const page = await browser.newPage();

const BASE_URL = process.env.BASE_URL || 'http://localhost';

await page.goto(BASE_URL, {
  waitUntil: 'networkidle0'
});
  // injection axe-core
  await page.addScriptTag({
    url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js"
  });

  const results = await page.evaluate(async () => {
    return await axe.run(document, {
      tags: ["wcag2aa"]
    });
  });

  console.log("\n📊 RAPPORT ACCESSIBILITÉ");
  console.log("========================");

  if (results.violations.length > 0) {
    console.log(`❌ ${results.violations.length} violations détectées\n`);

    results.violations.forEach(v => {
      console.log(`- ${v.id}`);
      console.log(`  Impact: ${v.impact}`);
      console.log(`  Description: ${v.description}\n`);
    });

    process.exit(1);
  } else {
    console.log("✅ Aucun problème détecté");
    process.exit(0);
  }

  await browser.close();
})();
