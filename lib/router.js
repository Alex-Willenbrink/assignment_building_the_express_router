'use strict';

const url = require('url');

// Private method to extract POST
// data from a request
// Calls done() to resolve the wrapping
// promise when finished
var _extractPostData = (req, done) => {
  var body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    done();
  });
};

const router = {};

router.methods = [
  'post',
  'get'
];

router.routes = {};

router.methods.forEach((method) => {
  router.routes[method] = {};

  router[method] = (path, callback) => {
    router.routes[method][path] = callback;
  }
});

router.handle = (req, res) => {
  // Obtain the method from the request object
  let method = req.method.toLowerCase();


  // Get the path from the request object
  let path = url.parse(req.url).pathname;

  // This is where we make the routes dynamically
  if(router.routes[method][path] !== undefined) {
    let p = new Promise((resolve, reject) => {
			// Make sure the mether being requested is supported.
      if(router.methods.includes(method)) {
        switch (method) {
          case 'post':
            // TODO: REMEMBER TO FIGURE THIS OUT LATER
            // Add logic to extract post data before we respond to the client.
            break;
          default:
            resolve();
        }
      } else {
        reject("Something went wrong!!");
      }
    });

		// Handle promise resolving and rejection.
		p.then(() => {
			router.routes[method][path](req, res);
		}, result => {
			if (typeof result === 'string') {
				console.error(result);
			}
			res.statusCode = 404;
			res.end('404 Not Found, dude!');
		});

    router.routes[method][path](req, res);
  }
}

module.exports = router;