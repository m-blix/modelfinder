const express = require('express');
const app = express();
const port = 8001;

const puppeteer = require('puppeteer');

const detectors = require('./detectors');

app.get('/', (req, res) => {
  res.send('modelfinder');
});

app.get('/api', async (req, res) => {
  let url = req.query.url;

  let resp = {};
  let error = false;

  if (url) {
    if (!url.startsWith('http')) {
      url = 'http://' + url;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      await page.goto(url);

      let title = await page.title();

      let modelUrl = await page.evaluate(() => {
        return 'test.glb';
      });

      resp = {
        msg: 'model found',
        url: modelUrl,
        title: title
      };
    } catch(e) {
      resp = {
        msg: 'invalid page'
      };
    }

    await browser.close();

  } else {
    resp = {
      msg: "'url' parameter not provided"
    };
  }
  res.json(resp);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
