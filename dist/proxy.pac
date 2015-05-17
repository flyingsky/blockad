var ALLOW = 'PROXY 10.0.0.28:8888';
var DENY = 'PROXY 10.0.0.28:8080';

function FindProxyForURL(url, host) {
  url = url.toLowerCase();
  host = host.toLowerCase();

  if (!isSupportedProtocol(GetProtocol(url))) {
    return ALLOW;
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

var hostRegexps = [
/mobads\.baidu\.com/,
/hm\.baidu\.com/,
/.*\.domob\.org/,
/.*\.duomeng\.org/,
/.*\.duomeng\.net/,
/.*\.duomeng\.cn/,
/.*\.domob\.com\.cn/,
/iadsdk\.apple\.com/,
/apiconfig\.adwo\.com/,
/\.mopub\.com/,
/\.googlesyndication\.com/,
/\.doubleclick\.net/,
/\.admob\.com/,
/\.gstatic\.com/,
/fbexternal-a\.akamaihd\.net/,
/\.chartboost\.com/,
/\.applovin\.com/,
/\.qwapi\.com/
];

var urlRegexps = [
/cpro\.baidustatic\.com\/cpro\/ui\//,
/cpro2\.baidustatic\.com\/cpro\/ui\//,
/cbjs\.baidu\.com\/js\/o\.js/,
/wn\.pos\.baidu\.com\/adx\.php/,
/.*\.domob\.cn\/a/,
/.*\.adwo\.com\/adweb7/,
/.*\.adsmogo\.mobi\/ad\/.*/,
/.*\.adsmogo\.org\/ad\/.*/,
/.*\.adsmogo\.org\/cf\/.*/,
/.*\.adsmogo\.com\/nimp\/.*/,
/.*\.adsmogo\.net\/ad\/.*/,
/.*\.adsmogo\.com\/ad\/.*/,
/ek\.my1000g\.com\/ads\/ini\.aspx/,
/i\.w\.inmobi\.com\/showad\.asm/,
/mobi\.adsage\.com\/sdk_j\/default\.js/,
/mws\.adsage\.com\/mobisage\/sdk\/st\/.*/,
/graph\.facebook\.com\/network_ads/,
/.*guomob\.com\/data\/ads/,
/.*presselite\.com\/iphone\/pushnotification\/interstitiel\/interstitiel\.xml/,
/mi\.gdt\.qq\.com\/gdt_mview\.fcg/,
/news\.l\.qq\.com\/app/,
/soma\.smaato\.net\/oapi\/reqad\.jsp/,
/w\.m\.taobao\.com\/api\/q/,
/m\.variflight\.com\/.*\/admob_request\.asp/,
/wbapp\.mobile\.sina\.cn\/interface\/f\/ttt\/v3\/wbpullad\.php/,
/wbapp\.mobile\.sina\.cn\/interface\/win\/winad\.php/,
/sdkapp\.mobile\.sina\.cn\/interface\/sdk\/sdkad\.php/
];