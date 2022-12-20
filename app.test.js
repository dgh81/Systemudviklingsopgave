const {getTop10Users} = require('./app');
const puppeteer = require('puppeteer');
const { default: mongoose } = require('mongoose');

//Unit test:
test('test getTop10Users', async() => {
 let top10 = await getTop10Users();
 mongoose.connection.close();
 top10 = top10.length;
 expect(top10).toBeGreaterThan(0);
}, 10000);

// Interface test:
test('test af program-menu', async () => {
 const browser = await puppeteer.launch({
  headless: false,
  slowMo: 80,
  args: ['--window-size=1600, 1000'],
  defaultViewport: {width: 1900, height: 1080}
 });
 const page = await browser.newPage();
 await page.goto('http://localhost:3000/');
 await page.click('div#menuToggle');
}, 10000);