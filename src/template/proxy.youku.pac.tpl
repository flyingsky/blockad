var ALLOW = '<%= proxy.allow %>';
var DENY = '<%= proxy.deny %>';

function FindProxyForURL(url, host) {
  url = url.toLowerCase();
  host = host.toLowerCase();

  if (!isSupportedProtocol(GetProtocol(url))) {
    return ALLOW;
  }

  if (youku && youku !== FindProxyForURL) {
    var proxy = youku(url, host);
    if (proxy && proxy.toLowerCase() !== 'direct') {
      return proxy;
    }
  }

  if (isDenied(host, hostRegexps) || isDenied(url, urlRegexps)) {
    return DENY;
  }

  return ALLOW;
}

function GetProtocol(url) {
  if (url) {
    var indexOfFirstColon = url.indexOf(':');
    if (indexOfFirstColon >= 0) {
      return url.substr(0, indexOfFirstColon);
    }
  }

  return null;
}

function isSupportedProtocol(protocol) {
  return protocol === 'http' || protocol === 'https';
}

function isDenied(str, regexFilters) {
  for (var i = 0; i < regexFilters.length; i++) {
    if (regexFilters[i].test(str)) {
      return true;
    }
  }
  return false;
}

var hostRegexps = <%= hostRegexps %>;

var urlRegexps = <%= urlRegexps %>;

var youku = (function(){
  <%= youkuPac %>;
  return FindProxyForURL;
})();