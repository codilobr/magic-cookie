
const debug = require('debug');

const { MemoryCookieStore: ToughMemoryCookieStore } = require('tough-cookie');

class MemoryCookieStore extends ToughMemoryCookieStore {
  findCookie(domain, path, key, next) {
    debug('memstore:findCookie')(domain, path, key);
    super.findCookie(domain, path, key, next);
  }

  findCookies(domain, path, next) {
    debug('memstore:findCookies')(domain, path);
    super.findCookies(domain, path, next);
  }

  putCookie(cookie, next) {
    debug('memstore:putCookie')(cookie);
    super.putCookie(cookie, next);
  }

  updateCookie(oldCookie, newCookie, next) {
    debug('memstore:updateCookie')(oldCookie, newCookie);
    super.updateCookie(oldCookie, newCookie, next);
  }

  removeCookie(domain, path, key, next) {
    debug('memstore:removeCookie')(domain, path, key);
    super.removeCookie(domain, path, key, next);
  }

  removeCookies(domain, path, next) {
    debug('memstore:removeCookies')(domain, path);
    super.removeCookies(domain, path, next);
  }

  getAllCookies(next) {
    debug('memstore:getAllCookies')('call');
    super.getAllCookies(next);
  }
}

module.exports = MemoryCookieStore;
