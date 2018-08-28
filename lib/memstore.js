
const debug = require('debug');

const { fromJSON, MemoryCookieStore: ToughMemoryCookieStore } = require('tough-cookie');

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

  loadCookieString(cookie) {
    let cookies;
    if (typeof cookie === 'string') {
      cookies = cookie ? JSON.parse(cookie) : null;
    } else if (typeof cookie === 'object') {
      cookies = cookie;
    } else {
      return;
    }
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
    this.idx = cookies;
  }

  loadPuppeteerCookie(puppeteerCookie) {
    debug('magic-cookie:memstore')('puppeteerCookie');
    const idx = {};

    puppeteerCookie.forEach((cookie) => {
      const d = new Date();
      if (!idx[cookie.domain]) {
        idx[cookie.domain] = {};
      }
      if (!idx[cookie.domain][cookie.path]) {
        idx[cookie.domain][cookie.path] = {};
      }
      if (!idx[cookie.domain][cookie.path][cookie.name]) {
        idx[cookie.domain][cookie.path][cookie.name] = {};
      }
      idx[cookie.domain][cookie.path][cookie.name] = {
        key: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        hostOnly: true,
        creation: d.toISOString(),
        lastAccessed: d.toISOString(),
      };
    });

    this.loadCookieString(idx);
  }

  getPuppeteerCookie() {
    debug('magic-cookie:memstore')('getPuppeteerCookie');
    const cookies = [];
    const domains = Object.keys(this.idx);
    domains.forEach((domain) => {
      const paths = Object.keys(this.idx[domain]);
      paths.forEach((path) => {
        const keys = Object.keys(this.idx[domain][path]);
        keys.forEach((key) => {
          const cookie = this.idx[domain][path][key];
          cookies.push({
            name: cookie.key,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            httpOnly: cookie.httpOnly,
            secure: cookie.secure,
            session: cookie.session,
          });
        });
      });
    });
    return cookies;
  }
}

module.exports = MemoryCookieStore;
