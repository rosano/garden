// How to get node.js HTTP request promise without a single dependency https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
const uGet = function (inputData) {
  return new Promise((resolve, reject) => {
    (inputData.startsWith('https') ? require('https') : require('http')).get(inputData, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
      	return reject(new Error(response.statusCode));
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
		
		if (!this.DataURL) {
			Object.assign(this, mod); // #hotfix-oldskool-middleware-this
		}

		if (!mod.DataDomainMap()[req.hostname]) {
			return next();
		}
		
		try {
			return res.send(await this.DataResponseBody({
				ParamHostname: req.hostname,
				ParamPath: req.path,
				ParamResponse: res,
			}));
		} catch (error) {
			const code = parseInt(error.message);

			res.statusCode = isNaN(code) ? 500 : code;

			return next(isNaN(code) ? error : new Error());
		}
	},

	// DATA

	async DataResponseBody (params) {
		if (typeof params !== 'object' || params === null) {
			return Promise.reject(new Error('GRDErrorInputNotValid'));
		}

		if (typeof params.ParamHostname !== 'string') {
			return Promise.reject(new Error('GRDErrorInputNotValid'));
		}

		if (typeof params.ParamPath !== 'string') {
			return Promise.reject(new Error('GRDErrorInputNotValid'));
		}

		if (typeof params.ParamResponse !== 'object' || params.ParamResponse === null) {
			return Promise.reject(new Error('GRDErrorInputNotValid'));
		}

		const result = await this._DataRaw(mod.DataURL(mod.DataDomainMap()[params.ParamHostname], params.ParamPath));

		Object.entries(result.headers).map(function (e) {
			params.ParamResponse.set(...e);
		});

		return this.DataContent(result.body, mod.DataDomainMap()[params.ParamHostname]);
	},

	DataDomainMap() {
		return JSON.parse(process.env.GRD_REMIT_MAP);
	},

	_DataRaw: uGet,

	DataContent (raw, needle) {
		return raw.split(needle + '/index.html').join('/').split(needle).join('').replace('</head>', `<meta property="og:image" content="${ process.env.OLSK_LAYOUT_TOUCH_ICON_URL }"></head>`);
	},

	_DataRootNeedle () {
		return '/index.html';
	},

	_DataRootBase (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('GRDErrorInputNotValid');
		}

		if (inputData.slice(-(mod._DataRootNeedle().length)) !== mod._DataRootNeedle()) {
			throw new Error('GRDErrorInputNotValid');
		}

		return inputData.split(mod._DataRootNeedle()).shift();
	},

	DataURL (root, path) {
		const base = mod._DataRootBase(root);
		return base + (path === '/' ? mod._DataRootNeedle() : path);
	},

};

Object.assign(exports, mod);
