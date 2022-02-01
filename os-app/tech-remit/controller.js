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
		
		if (req.path === '/robots.txt') {
			return next();
		}
		
		try {
			const match = req.path.match(/\.(\w+)$/);
			if (match && (match[1] !== 'html')) {
				const source = mod.DataURL(mod.DataDomainMap()[req.hostname], req.path);
				const destination = require('path').join(__dirname, '__download', require('crypto').createHash('md5').update(source).digest('hex') + match[0]);

				if (!require('fs').existsSync(require('path').dirname(destination))){
					require('fs').mkdirSync(require('path').dirname(destination));
				}

				await require('util').promisify(require('stream').pipeline)((await require('node-fetch')(source)).body, require('fs').createWriteStream(destination));

				return res.sendFile(destination);
			}
			
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

		const response = await this._DataRaw(mod.DataURL(mod.DataDomainMap()[params.ParamHostname], params.ParamPath));

		Object.entries(response.headers.raw()).map(function ([key, value]) {
			value.map(function (e) {
				if (!['content-encoding'].includes(key)) {
					params.ParamResponse.set(key, e);
				}
			});
		});

		return this.DataContent(await response.text(), mod.DataDomainMap()[params.ParamHostname]);
	},

	DataDomainMap() {
		return JSON.parse(process.env.GRD_REMIT_MAP);
	},

	_DataRaw: require('node-fetch'),

	DataContent (raw, root) {
		const base = mod._DataRootBase(root);
		return raw.split(root).join('/').split(base).join('').replace('</head>', `\n<meta property="og:image" content="${ process.env.OLSK_LAYOUT_TOUCH_ICON_URL }">\n<link rel="apple-touch-icon" href="${ process.env.OLSK_LAYOUT_TOUCH_ICON_URL }" />\n</head>`);
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
