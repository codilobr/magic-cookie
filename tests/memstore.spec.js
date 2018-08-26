const chai = require('chai');
const rp = require('request-promise');

const { MemoryCookieStore } = require('../');

const { expect } = chai;

describe('MemoryCookieStore', () => {
  const jar = rp.jar(new MemoryCookieStore());
  it('without cookie', async () => {
    const response = await rp('https://httpbin.org/cookies', { jar, json: true });
    expect({}).to.deep.equal(response.cookies);
  });
  it('set cookie', async () => {
    const qs = {
      key: 'value',
      anotherkey: 'something',
      someelse: 'content',
    };
    const response = await rp('https://httpbin.org/cookies/set', { qs, jar, json: true });
    expect(qs).to.deep.equal(response.cookies);
  });
  it('replace cookie', async () => {
    const qs = {
      key: 'replaced',
    };
    const expected = {
      key: 'replaced',
      anotherkey: 'something',
      someelse: 'content',
    };
    const response = await rp('https://httpbin.org/cookies/set', { qs, jar, json: true });
    expect(expected).to.deep.equal(response.cookies);
  });
  it('delete cookie', async () => {
    const qs = {
      anotherkey: 'something',
    };
    const expected = {
      key: 'replaced',
      someelse: 'content',
    };
    const response = await rp('https://httpbin.org/cookies/delete', { qs, jar, json: true });
    expect(expected).to.deep.equal(response.cookies);
  });
});
