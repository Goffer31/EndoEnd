const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');

let workoutslinks = require('./workoutslinks.json');
console.log(workoutslinks);
//Get content of an opened page with specified url
let getBrowserPageClient = async function (browser, url) {
    //If url is specified, try to find page with url and return the client. If page with url wasn't found, return null
    if (url !== null) {
      let page = await browser.targets();
      for (let i = 0; i < page.length; i++) {
        let tempPage = await page[i].page();
        if (
          tempPage &&
          (tempPage.target()._targetInfo.url.replace(/[0-9]/g, '') === url ||
            tempPage.target()._targetInfo.url.indexOf(url) !== -1)
        ) {
          return {
            page: tempPage,
            client: tempPage._client,
          };
        }
      }
      return null;
    }
  };

(async () => {
    let chromeURL;

    try {
        chromeURL = await fetch('http://127.0.0.1:9222/json/version');
      } catch (error) {
        console.log('Error: ' + error);
      }
    const parsedChromeEndpoint = await chromeURL.json();

    const browser = await puppeteer.connect({
        browserWSEndpoint: parsedChromeEndpoint.webSocketDebuggerUrl,
        defaultViewport: null,
    });

    let client = await browser.newPage();
    client.goto(workoutslinks[0]);
    console.log(client);
    
    let urls = await client.page.evaluate(() => {
        let arr = document.getElementsByClassName('history-item-content ng-scope');
        let hrefarr = [];
        for(let i = 0; i < arr.length; i++){
            hrefarr.push(arr[i].href);
        }
        return hrefarr;
    });

    for(let i = 0; i < urls.length; i++){
        if(!workoutslinks.includes(urls[i])){
            workoutslinks.push(urls[i]);
        }
    }
    fs.writeFile('workoutslinks.json', JSON.stringify(workoutslinks), () => { });
    browser.disconnect();
    console.log(workoutslinks.length);
})()
