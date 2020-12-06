// How to get node.js HTTP request promise without a single dependency https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
const uGet = function (inputData) {
  return new Promise((resolve, reject) => {
    (inputData.startsWith('https') ? require('https') : require('http')).get(inputData, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
      	return reject(new Error('Error: ' + response.statusCode));
      }

      const body = [];

      response.on('data', function (chunk) {
      	return body.push(chunk);
      });

      response.on('end', function () {
      	return resolve(body.join(''))
      });
    }).on('error', reject);
  });
};

const mod = {

	async OLSKControllerGlobalMiddleware (req, res, next) {
		if (!this.DataResponse) {
			Object.assign(this, mod); // #hotfix-oldskool-middleware-this
		}

		if (!mod.DataDomainMap()[req.hostname]) {
			return next();
		}
		
		return res.send(await this.DataResponse(mod.DataDomainMap()[req.hostname], req.path));
	},

	// DATA

	DataDomainMap() {
		return JSON.parse(process.env.GRD_REMIT_MAP);
	},

	_DataContent: uGet,

	DataResponse (root, path) {
		return this._DataContent(root + (path === '/' ? '/index.html' : path));
	},

};

Object.assign(exports, mod);
