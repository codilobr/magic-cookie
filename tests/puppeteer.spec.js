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
  const urlSet = `https://httpbin.org/cookies/set?${querystring.stringify(qs)}`;
  const urlGet = 'https://httpbin.org/cookies/get';
  it('set cookie on puppetter and get on request', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(urlSet, { waitUntil: 'networkidle2' });

    const cookies = await page.cookies();

    await browser.close();

    const cookieMemory = new MemoryCookieStore();
    cookieMemory.loadPuppeteerCookie(cookies);
    jar = rp.jar(cookieMemory);
    const response = await rp(urlGet, { jar, json: true });
    expect(qs).to.deep.equal(response.cookies);
  });
  it('set cookie on request and get on puppeteer', async () => {
    const cookieMemory = new MemoryCookieStore();

    jar = rp.jar(cookieMemory);
    await rp(urlSet, { jar, json: true });

    const cookies = cookieMemory.getPuppeteerCookie();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto(urlGet, { waitUntil: 'networkidle2' });
    const bodyHandle = await page.$('body');
    const response = await page.evaluate(body => JSON.parse(body.innerText), bodyHandle);

    await browser.close();

    expect(qs).to.deep.equal(response.cookies);
  });
});
