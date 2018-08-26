const { pathMatch } = require('tough-cookie');

exports.matchAll = (domainIndex) => {
  const results = [];
  Object.keys(domainIndex).forEach((curPath) => {
    const pathIndex = domainIndex[curPath];
    Object.keys(pathIndex).forEach((key) => {
      results.push(pathIndex[key]);
    });
  });
  return results;
};

exports.matchRFC = (domainIndex, path) => {
  const results = [];
  // NOTE: we should use path-match algorithm from S5.1.4 here
  // (see : https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/canonical_cookie.cc#L299)
  Object.keys(domainIndex).forEach((cookiePath) => {
    if (pathMatch(path, cookiePath)) {
      const pathIndex = domainIndex[cookiePath];
      Object.keys(pathIndex).forEach((key) => {
        results.push(pathIndex[key]);
      });
    }
  });
  return results;
};
