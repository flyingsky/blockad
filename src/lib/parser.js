/**
 * Created by ramon on 11/16/14.
 */

var fs = require('fs');
var pluralize = require('pluralize');

var UNKNOWN = '_unknown';

/**
 *
 * @param filePath {String}
 * @param options {Object} optional
 * @returns {Object}
 */
exports.parse = function(filePath, options) {
  var content = fs.readFileSync(filePath, options || {encoding: 'utf8'});
  var result = doParse(content);
  return singularize(result);
};

function doParse(content) {
  var lines = content.split('\n');
  var sectionObj = null;
  var result = {};
  lines.forEach(function(line) {
    line = line.trim().toLowerCase();
    if (isIgnored(line)) {
      return;
    }

    var section = isSection(line);
    if (section) {
      sectionObj = [];
      result[section] = sectionObj;
      return;
    }

    if (!sectionObj) {
      sectionObj = [];
      result[UNKNOWN] = sectionObj;
    }

    sectionObj.push(line);
  });

  return result;
}

function isIgnored(line) {
  return !line || line[0] === '#';
}

function isSection(line) {
  if (line.length > 2 && line[0] === '[' && line[line.length - 1] === ']') {
    return line.substr(1, line.length - 2).trim();
  }

  return false;
}

/**
 * Make result properties to simple object if it's not plural
 * @param result {Object}
 * @returns {Object}
 */
function singularize(result) {
  var copyResult = {};
  for(var p in result) {
    var val = result[p];  // by default all val are Array
    if (pluralize.singular(p) === p && val.length <= 1) {
      copyResult[p] = val[0];
    } else {
      copyResult[p] = result[p];
    }
  }

  return copyResult;
}

