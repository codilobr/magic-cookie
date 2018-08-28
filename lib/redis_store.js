const debug = require('debug');
const Redis = require('ioredis');
const deasync = require('deasync');

const MemoryCookieStore = require('./memstore');

class CookieRedisStore extends MemoryCookieStore {
  constructor(path, id) {
    super();

    this.redis = new Redis(path);

    this.id = id || 'cookie';

    this.load(() => {
      this.initialized = true;
    });
    deasync.loopWhile(() => !this.initialized);
  }

  load(next) {
    debug('magic-cookie:redis-cookie')('load');
    this.redis.get(this.id, (err, data) => {
      if (err || !data) return next();
      super.loadCookieString(data);
      return next();
    });
  }

  save(next) {
    debug('magic-cookie:redis-cookie')('save', 'call');
    const cookie = JSON.stringify(this.idx);
    this.redis.set(this.id, cookie, next);
  }

  putCookie(cookie, next) {
    debug('magic-cookie:redis-cookie')('putCookie', cookie);
    super.putCookie(cookie, () => {
      this.save(() => {
        next(null);
      });
    });
  }

  removeCookie(domain, path, key, next) {
    debug('magic-cookie:redis-cookie')('removeCookie', 'remove cookie on', domain, path, key);
    super.removeCookie(domain, path, key, () => {
      this.save(() => {
        next(null);
      });
    });
  }

  removeCookies(domain, path, next) {
    debug('magic-cookie:redis-cookie')('removeCookies', 'remove cookies on', domain, path);
    super.removeCookies(domain, path, () => {
      this.save(() => {
        next(null);
      });
    });
  }
}

module.exports = CookieRedisStore;
