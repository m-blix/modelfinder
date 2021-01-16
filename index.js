const express = require('express');
const app = express();
const port = 8001;

const puppeteer = require('puppeteer');


app.get('/', (req, res) => {
  res.send('modelfinder');
});

app.get('/api', async (req, res) => {
  let url = req.query.url;

  let resp = {};

  if (url) {
    if (!url.startsWith('http')) {
      url = 'http://' + url;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    let title = await page.title();
    //await page.screenshot({path: 'example.png'});


    await browser.close();

    resp = {
      msg: 'model found',
      url: 'http://site.com/model.glb',
      title: title
    };
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
