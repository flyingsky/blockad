/**
 * Created by ramon on 11/11/14.
 */
var path = require('path');
var fs = require('fs');

var _ = require('lodash');

var ruleParser = require('./src/lib/ruleParser');

function getTemplateData(isPro) {
  var data = {
    proxy: {
      allow: 'DIRECT',
      deny: 'PROXY baidu.com:80'
    },
    hostRegexps: '[]',
    urlRegexps: '[]',
    youkuPac: fs.readFileSync('src/template/unblock_youku.pac', {encoding: 'utf8'})
  };

  if (!isPro) {
    var localIp = lookupLocalIp();
    data.proxy.allow = 'PROXY ' + localIp + ':8888'; // proxy to charles proxy
    data.proxy.deny = 'PROXY ' + localIp + ':8080';  // proxy to local server
  }

  return _.extend(data, ruleParser.parse(path.resolve('./src/rule')));
}

function lookupLocalIp() {
  var ens = _.pick(require('os').networkInterfaces(), ['en1', 'en0']);
  var detail = _.find(ens && (ens.en1 || ens.en0), {family:'IPv4'});
  return detail && detail.address;
}

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      configFiles: {
        files: 'Gruntfile.js',
        options: {
          reload: true
        },
        tasks: ['proxyPac']
      },

      src: {
        files: ['src/template/**', 'src/rule/**/*.r'],
        tasks: ['proxyPac']
      }
    },

    template: {
      proxyPac: {
        options: {
          data: null  // placeholder for template data
        },
        files: {
          'dist/proxy.pac': ['src/template/proxy.pac.tpl'],
          'dist/proxy.youku.pac': ['src/template/proxy.youku.pac.tpl']
        }
      }
    },

    uglify: {
      proxyPac: {
        files: {
          'dist/proxy.pac': ['dist/proxy.pac'],
          'dist/proxy.youku.pac': ['dist/proxy.youku.pac']
        }
      }
    },

    gitcommit: {
      options: {
        verbose: true
      },
      github: {
        options: {
          message: 'check in pac file'
        },
        files: [{
          src: ["proxy.pac", "proxy.youku.pac"],
          expand: true,
          cwd: "./dist"
        }]
      }
    },

    gitpush: {
      options: {
        verbose: true
      },
      github: {}
    },

    shell: {
      publishSae: {
        command: 'build/publish.sh ' + 'dist/proxy.youku.pac'
      }
    }
  });

  grunt.registerTask('proxyPac', 'generate dist/proxy.pac', function(isPro) {
    var templateData = getTemplateData(isPro);
    grunt.config('template.proxyPac.options.data', templateData);

    var tasks = ['template'];
    if (isPro) {
      tasks.push('uglify');
    }
    grunt.task.run(tasks);
  });

  grunt.registerTask('publish', function(server) {
    server = server || 'github';
    grunt.log.writeln('deploy to: ' + server);

    if (server === 'github') {
      grunt.task.run(['gitcommit:github', 'gitpush:github']);
    } else {
      grunt.log.writeln('server is not supported: ' + server);
    }
  });

  grunt.registerTask('deploy', 'deploy pac file to server', function(server) {

    grunt.task.run(['proxyPac:pro', 'publish']); // TODO: distribute
  });

  // `grunt` or `grunt default` output dev proxy.pac
  // `grunt default:pro` output pro proxy.pac
  grunt.registerTask('default', function(isPro) {
    var proxyPacTask = 'proxyPac' + (isPro ? ':true' : '');
    grunt.task.run([proxyPacTask, 'watch']);
  });
};

