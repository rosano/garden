// How to get node.js HTTP request promise without a single dependency https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
const uGet = function (inputData) {
  return new Promise((resolve, reject) => {
    (inputData.startsWith('https') ? require('https') : require('http')).get(inputData, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
      	return reject(response.statusCode);
      }

      const body = [];

      response.on('data', function (chunk) {
      	return body.push(chunk);
      });

      response.on('end', function () {
      	return resolve({
      		headers: response.headers,
      		body: body.join(''),
      	})
      });
    }).on('error', reject);
  });
};

const mod = {

	async OLSKControllerGlobalMiddleware (req, res, next) {
		if (res.locals.OLSK_SPEC_UI()) {
			return next();
		}
		
		if (!this.DataResponse) {
			Object.assign(this, mod); // #hotfix-oldskool-middleware-this
		}

		if (!mod.DataDomainMap()[req.hostname]) {
			return next();
		}
		
		try {
			const result = await this.DataResponse(mod.DataDomainMap()[req.hostname], req.path);
			
			Object.entries(result.headers).map(function (e) {
				res.set(...e);
			});

			return res.send(result.body);
		} catch (error) {
			res.statusCode = error;

			return next();
		}
	},

	// DATA

	DataDomainMap() {
		return JSON.parse(process.env.GRD_REMIT_MAP);
	},

	_DataContent: uGet,

	DataResponse (root, path) {
		if (root === mod.DataDomainMap()[process.env._GRD_REF_DOMAIN] && (path.startsWith(process.env._GRD_REF_DIR) || path !== '/' && !path.match(/^\/[a-z0-9]+$/))) {
			root = process.env._GRD_REF_TEMPLATE;

			if (path.match(process.env._GRD_REF_DIR)) {
				path = (process.env._GRD_REF_DIR + '/').split('//').join('/');
			}
		}

		return this._DataContent(root + (path === '/' ? '/index.html' : path));
	},

};

Object.assign(exports, mod);
