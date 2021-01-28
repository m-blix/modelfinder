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
  let error = false;

  if (url) {
    if (!url.startsWith('http')) {
      url = 'http://' + url;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      console.log('page: ' + url);
      await page.goto(url);

      let title = await page.title();

      console.log('detecting...');
      await page.addScriptTag({ path: 'ar-extension/model-detectors.js' });

      let modelUrl = await page.evaluate(getModel);

      if (modelUrl) {
        console.log('model found: ' + modelUrl);
        resp = {
          msg: 'model found',
          url: modelUrl,
          page_title: title
        };
      } else {
        console.log('no model found');
        resp = {
          msg: 'no model found'
        };
      }
    } catch(e) {
      console.log(e);
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

function getModel() {
  let modelUrl = get3DModelFromPage();
  if (modelUrl) {
    console.log(`3D model found (schema): ${modelUrl}`);
  }
  if (!modelUrl) {
    modelUrl = getModelFromModelViewer();
    if (modelUrl) {
      console.log(`3D model found (model-viewer): ${modelUrl}`);
    }
  }
  const GOOGLE_HOST = 'www.google.com';
  if (!modelUrl && location.host === GOOGLE_HOST) {
    console.log(`detect on ${GOOGLE_HOST}`);
    let data = getModelFromGoogleSearch();
    console.log(data);
    if (data) {
      //useViewer = false;
      modelUrl = data.file;
      viewerUrl = data.viewerUrl;
    }
    if (modelUrl) {
      console.log(`3D model found (google-search): ${modelUrl}`);
    }
  }
  const GOOGLE_AC_HOST = 'artsandculture.google.com';
  if (!modelUrl && location.host === GOOGLE_AC_HOST) {
    console.log(`detect on ${GOOGLE_AC_HOST}`);
    modelUrl = getModelFromGoogleArtsAndCulture();
    if (modelUrl) {
      console.log(`3D model found (google arts & culture): ${modelUrl}`);
    }
  }
  const GOOGLE_POLY_HOST = 'poly.google.com';
  if (!modelUrl && location.host === GOOGLE_POLY_HOST) {
    console.log(`detect on ${GOOGLE_POLY_HOST}`);
    modelUrl = getModelFromGooglePoly();
    if (modelUrl) {
      console.log(`3D model found (google poly): ${modelUrl}`);
    }
  }
  const GITHUB_HOST = 'github.com';
  if (!modelUrl && location.host === GITHUB_HOST) {
    console.log(`detect on ${GITHUB_HOST}`);
    modelUrl = getModelFromGitHub();
    if (modelUrl) {
      console.log(`3D model found (github): ${modelUrl}`);
    }
  }
  const GITLAB_HOST = 'gitlab.com';
  if (!modelUrl && location.host === GITLAB_HOST) {
    console.log(`detect on ${GITLAB_HOST}`);
    modelUrl = getModelFromGitLab();
    if (modelUrl) {
      console.log(`3D model found (gitlab): ${modelUrl}`);
    }
  }
  return modelUrl;
}
