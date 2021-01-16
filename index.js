const express = require('express');
const app = express();
const port = 8001;

const puppeteer = require('puppeteer');


app.get('/', (req, res) => {
  res.send('modelfinder');
});

app.get('/api', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  let title = await page.title();
  //await page.screenshot({path: 'example.png'});

  await browser.close();

  let resp = {
    msg: 'model found',
    url: 'http://site.com/model.glb',
    title: title
  };
  res.json(resp);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
