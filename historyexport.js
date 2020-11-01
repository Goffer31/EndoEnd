const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');

let workoutslinks = require('./workoutslinks.json');

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
    await client.goto(workoutslinks[0]);
    await client.evaluate(() => {
        let dropdown = document.getElementsByClassName('dropdown-menu menu workoutHeadline-editMenu eoWorkoutEditMenu ng-isolate-scope');
        dropdown[0].children[11].click();
    });
    //browser.disconnect();
})()