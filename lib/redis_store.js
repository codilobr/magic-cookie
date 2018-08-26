const debug = require('debug');
const Redis = require('ioredis');
const deasync = require('deasync');
const tough = require('tough-cookie');

const { fromJSON } = tough;

const MemoryCookieStore = require('./memstore');

class CookieRedisStore extends MemoryCookieStore {
  constructor(path, id) {
    super();

    this.redis = new Redis(path);

    // this.idx = super.idx; // idx is memory cache
    this.id = id || 'cookie';

    this.load((err, idx) => {
      if (err) throw err;
      if (idx) {
        this.idx = idx;
      }
      this.initialized = true;
    });
    while (!this.initialized) { deasync.sleep(50); }
  }

  load(next) {
    debug('redis-cookie:load')('call');
    this.redis.get(this.id, (err, data) => {
      if (err) return next(err);
      if (!data) return next();
      const cookies = data ? JSON.parse(data) : null;
      const domains = Object.keys(cookies);
      domains.forEach((domain) => {
        const paths = Object.keys(cookies[domain]);
        paths.forEach((path) => {
          const keys = Object.keys(cookies[domain][path]);
          keys.forEach((key) => {
            if (key !== null) {
              cookies[domain][path][key] =
                fromJSON(JSON.stringify(cookies[domain][path][key]));
            }
          });
        });
      });
      debug('redis-cookie:load')('end');
      return next(null, cookies);
    });
  }

  save(next) {
    debug('redis-cookie:save')('call');
    const cookie = JSON.stringify(this.idx);
    this.redis.set(this.id, cookie, next);
  }

  putCookie(cookie, next) {
    debug('redis-cookie:putCookie')(cookie);
    super.putCookie(cookie, () => {
      this.save(() => {
        next(null);
      });
    });
  }
}

module.exports = CookieRedisStore;
