const p = require("puppeteer-core");
const http = require("http"), fs = require("fs"), path = require("path");

const root = "E:\\webbed\\webbed_site-main\\webbed_site-main\\out";
const types = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.txt':'text/plain','.xml':'application/xml','.woff2':'font/woff2','.mp4':'video/mp4','.gif':'image/gif' };
const server = http.createServer((req,res)=>{
  const pth = decodeURIComponent(req.url.split('?')[0]);
  let fp = path.join(root, pth);
  if (pth === '/' || pth.endsWith('/')) fp = path.join(fp, 'index.html');
  if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp, 'index.html');
  if (!fs.existsSync(fp)) { fp = path.join(root, pth + '.html'); }
  if (!fs.existsSync(fp)) { fp = path.join(root, '404.html'); res.statusCode = 404; }
  if (!fs.existsSync(fp)) { res.statusCode = 404; res.end('nf'); return; }
  const ext = path.extname(fp); res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  fs.createReadStream(fp).pipe(res);
});

(async () => {
  await new Promise((res) => server.listen(4199, res));
  const exe = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await p.launch({ headless: true, args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"], executablePath: exe });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:4199/about", { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 5000));

  const info = await page.evaluate(() => {
    const spacers = Array.from(document.querySelectorAll(".pin-spacer"));
    return {
      totalH: document.documentElement.scrollHeight,
      spacers: spacers.map((s) => ({
        h: Math.round(s.getBoundingClientRect().height),
        top: Math.round(s.getBoundingClientRect().top),
        cls: (s.className && s.className.toString().slice(0, 30)) || "",
      })),
      stories: Array.from(document.querySelectorAll("[data-about-founding-story]")).map((s) => ({
        outerH: Math.round(s.getBoundingClientRect().height),
        cls: s.className.toString().slice(0, 60),
      })),
    };
  });
  console.log(JSON.stringify(info, null, 1));

  // Now scroll in small steps from hero start, log founding cards progress + document height
  console.log("\n=== scroll trace ===");
  for (let i = 0; i < 160; i++) {
    await page.mouse.move(720, 450);
    await page.mouse.wheel({ deltaY: 150 });
    await new Promise((r) => setTimeout(r, 60));
    const s = await page.evaluate(() => {
      const secs = Array.from(document.querySelectorAll("main > *"));
      const box = (el) => el ? (() => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bot: Math.round(r.bottom) }; })() : null;
      const founder = document.querySelector("[data-about-founding-story]");
      let cardT = null;
      if (founder) {
        cardT = Array.from(founder.querySelectorAll("div")).slice(-6);
      }
      return {
        y: Math.round(scrollY),
        totalH: document.documentElement.scrollHeight,
        hero0: box(secs[0]),
        founded: box(document.querySelector("[data-about-founding-story]")),
        slide: founder && founder.getAttribute("data-active-story-slide"),
        card1op: founder ? getComputedStyle(founder.querySelectorAll("div")[34] || founder).opacity.slice(0,4) : null,
      };
    });
    if (i % 5 === 0 || !s.founded || (s.founded.bot > 0 && s.founded.bot < 2000)) {
      console.log(`y=${String(s.y).padStart(5)} totalH=${s.totalH} slide=${s.slide} hero0=${JSON.stringify(s.hero0)} founded=${JSON.stringify(s.founded)}`);
    }
  }
  await browser.close();
  server.close();
})().catch((e) => { console.error("ERR", e); process.exit(1); });