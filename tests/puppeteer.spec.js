const chai = require('chai');
const rp = require('request-promise');
const puppeteer = require('puppeteer');
const querystring = require('querystring');

const { MemoryCookieStore } = require('../');

const { expect } = chai;

describe('Puppeteer', () => {
  let jar;
  const qs = {
    key: 'value',
    anotherkey: 'something',
    someelse: 'content',
  };
  it('set cookie on puppetter and get on request', async () => {
    const url = `https://httpbin.org/cookies/set?${querystring.stringify(qs)}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const cookies = await page.cookies();
    await browser.close();

    const cookieMemory = new MemoryCookieStore();
    cookieMemory.loadPuppeteerCookie(cookies);
    jar = rp.jar(cookieMemory);
    const response = await rp(url, { jar, json: true });
    expect(qs).to.deep.equal(response.cookies);
  });
});
