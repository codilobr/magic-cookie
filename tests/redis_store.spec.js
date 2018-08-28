const chai = require('chai');
const uuid = require('uuid').v4();
const Redis = require('ioredis');
const rp = require('request-promise');

const redis = new Redis();

const { RedisStore } = require('../');

const { expect } = chai;

describe('RedisStore', async () => {
  let jar;
  const db = uuid;
  it('without cookie', async () => {
    jar = rp.jar(new RedisStore(null, db));
    await redis.del(db);
    const response = await rp('https://httpbin.org/cookies', { jar, json: true });
    expect({}).to.deep.equal(response.cookies);
  });
  it('set cookie', async () => {
    jar = rp.jar(new RedisStore(null, db));
    const qs = {
      key: 'value',
      anotherkey: 'something',
      someelse: 'content',
    };
    const response = await rp('https://httpbin.org/cookies/set', { qs, jar, json: true });
    expect(qs).to.deep.equal(response.cookies);
  });
  it('get cookie', async () => {
    jar = rp.jar(new RedisStore(null, db));
    const expected = {
      key: 'value',
      anotherkey: 'something',
      someelse: 'content',
    };
    const response = await rp('https://httpbin.org/cookies', { jar, json: true });
    expect(expected).to.deep.equal(response.cookies);
  });
  it('replace cookie', async () => {
    jar = rp.jar(new RedisStore(null, db));
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
    jar = rp.jar(new RedisStore(null, db));
    const qs = {
      anotherkey: 'something',
    };
    const expected = {
      key: 'replaced',
      someelse: 'content',
    };
    const response = await rp('https://httpbin.org/cookies/delete', { qs, jar, json: true });
    await redis.del(db);
    expect(expected).to.deep.equal(response.cookies);
  });
});
