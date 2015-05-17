/**
 * Created by ramon on 11/16/14.
 */
var path = require('path');
var fs = require('fs');

var parser = require('./parser');

/**
 * @param dir {String}
 * @returns {{hostRegexps: string, urlRegexps: string}}
 */
exports.parse = function(dir) {
  var hostRegexps = [];
  var urlRegexps = [];
  collectRegexps(collectRuleFiles(dir), hostRegexps, urlRegexps);

  return {
    hostRegexps: toArrayString(hostRegexps),
    urlRegexps: toArrayString(urlRegexps)
  };
};

/**
 * return sorted hostFiles and urlFiles by file name, which is beginning with priority level. 0 is top priority.
 * @param dir {String}
 * @returns {[string]}
 */
function collectRuleFiles(dir) {
  var ruleFiles = [];

  doCollectRuleFiles(dir, '.r', ruleFiles);

  function fileCompare(f1, f2) { return path.basename(f1) > path.basename(f2);}

  return ruleFiles.sort(fileCompare);
}

/**
 *
 * @param dir {String}
 * @param ext {String} optional, such as '.r' or '.m'
 * @param ruleFiles {[String]} pass out parameter
 */
function doCollectRuleFiles(dir, ext, ruleFiles) {
  if (arguments.length === 2) {
    ruleFiles = ext;
    ext = null;
  }

  function isExpectedExt(file) {
    return !ext || (path.extname(file) === ext);
  }

  var files = fs.readdirSync(dir);
  var childDirs = [];
  files.forEach(function(file) {
    var filePath = path.join(dir, file);
    var fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory()) {
      childDirs.push(filePath);
    } else if (fileStat.isFile() && isExpectedExt(file)) {
      ruleFiles.push(filePath);
    }
  });

  childDirs.forEach(function(childDir) {
    doCollectRuleFiles(childDir, ruleFiles);
  });
}

function toArrayString(arr) {
  return '[\n' + (arr ? arr.join(',\n') : '') + '\n]';
}

function collectRegexps(files, hostRegexps, urlRegexps) {
  files.forEach(function(file) {
    collectRegexpsFromFile(file, hostRegexps, urlRegexps);
  });
}

function collectRegexpsFromFile(filePath, hostRegexps, urlRegexps) {
  var result = parser.parse(filePath);

  function rulesToRegexps(rules, regexps) {
    rules && rules.forEach(function(rule) {
      var regex = '/' + escapeRegExp(rule) + '/';
      regexps.push(regex);
    });
  }

  rulesToRegexps(result.hosts, hostRegexps);
  rulesToRegexps(result.urls, urlRegexps);
}

function escapeRegExp(string){
  return string.replace(/([.+?^${}()|\[\]\/\\])/g, "\\$1").replace(/\*/g, "\.*");
}