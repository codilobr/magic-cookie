# Cookie Redis Store

Supports Redis >= 2.6.12 and (Node.js >= 6).

## Description
Another redis store for tough-cookie module.

## Install
```shell
$ npm install magic-cookie
```

## Basic Usage
``` javascript
const rp = require('request-promise');

const { MemoryCookieStore } = require('magic-cookie');

const jar = rp.jar(new MemoryCookieStore());

(async () => {
  const qs = {
    key: 'value',
    anotherkey: 'something',
    someelse: 'content',
  };

  const response = await rp('https://httpbin.org/cookies/set', { qs, jar, json: true });

  console.log(response);
})();
```

## Import cookie from Puppeteer to Request
Use the loadPuppeteerCookie() method to import a Puppeteer cookie.

``` javascript
const rp = require('request-promise');
const puppeteer = require('puppeteer');
const querystring = require('querystring');

const { MemoryCookieStore } = require('./');

(async () => {
  const qs = {
    key: 'value',
    anotherkey: 'something',
    someelse: 'content',
  };
  const url = `https://httpbin.org/cookies/set?${querystring.stringify(qs)}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const cookies = await page.cookies();

  await browser.close();

  const cookieMemory = new MemoryCookieStore();
  cookieMemory.loadPuppeteerCookie(cookies);

  const jar = rp.jar(cookieMemory);

  const response = await rp(url, { jar, json: true });
  console.log(response);
})();
```

## Import cookie from Request to Puppeteer
Use the loadPuppeteerCookie() method to import a Puppeteer cookie.

``` javascript
const rp = require('request-promise');
const puppeteer = require('puppeteer');

const { MemoryCookieStore } = require('magic-cookie');

(async () => {
  const qs = {
    key: 'value',
    anotherkey: 'something',
    someelse: 'content',
  };
  const urlSet = 'https://httpbin.org/cookies/set';
  const urlGet = 'https://httpbin.org/cookies';

  const cookieMemory = new MemoryCookieStore();

  const jar = rp.jar(cookieMemory);
  await rp(urlSet, { qs, jar, json: true });

  const cookies = cookieMemory.getPuppeteerCookie();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setCookie(...cookies);
  await page.goto(urlGet, { waitUntil: 'networkidle2' });
  const bodyHandle = await page.$('body');
  const response = await page.evaluate(body => JSON.parse(body.innerText), bodyHandle);

  await browser.close();
  console.log(response);
})();
```
## Options

  * `path` **optional** You can specify which Redis address to connect. [*default:* 'localhost:6379 db 0']
  * `id` **optional** ID for each redis store so that we can use multiple stores with the same redis database [*default:* 'default']

``` javascript
const rp = require('request-promise');

const CookieRedisStore = require('magic-cookie');

// Connect to 127.0.0.1:6380, db 4, using password "authpassword" and stores on key "my-cookie"
const jar = rp.jar(new CookieRedisStore('redis://:authpassword@127.0.0.1:6380/4', 'my-cookie'));

(async () => {
  const qs = {
    key: 'value',
    anotherkey: 'something',
    someelse: 'content',
  };

  const response = await rp('https://httpbin.org/cookies/set', { qs, jar, json: true });

  console.log(response);
})();

```
