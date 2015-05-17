var sys = require('sys');
var static = require('node-static');

var fileServer = new static.Server('.');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response, function (err, result) {
      if (err) {
        if (request.url === '/') {
          sys.log('/ redirect to proxy.pac');
          return fileServer.serveFile('dist/proxy.youku.pac', 200, {}, request, response);
        }

        sys.error('Error serving ' + request.url + ' - ' + err.message + ' - ' + err.status);
        response.writeHead(err.status, err.headers);
        response.end();
      } else {
        sys.log('Access ' + request.url);
      }
    });
  }).resume();
}).listen(8080);