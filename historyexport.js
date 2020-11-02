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
    //console.log('https://www.endomondo.com/rest/v1/users/' + workoutslinks[0].split('/users/')[1]+'/export?format=TCX');
    try {
        await client.goto('https://www.endomondo.com/rest/v1/users/' + workoutslinks[0].split('/users/')[1]+'/export?format=TCX');
    } catch(error){
        console.log('Error: ' + error);
    }
    
    /*await client.evaluate(() => {
        let dropdown = document.getElementsByClassName('dropdown-menu menu workoutHeadline-editMenu eoWorkoutEditMenu ng-isolate-scope');
        dropdown[0].children[11].click();
    });

    await client.evaluate(() => {
        let dropdown = document.getElementsByClassName('col-xs-12');
        dropdown[0].children[0].click();
    });*/

    //browser.disconnect();
})()