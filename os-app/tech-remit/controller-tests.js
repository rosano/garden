const { throws, rejects, deepEqual } = require('assert');

const mod = require('./controller.js');

describe('OLSKControllerGlobalMiddleware', function test_OLSKControllerGlobalMiddleware() {

	const _OLSKControllerGlobalMiddleware = function (params) {
		return Object.assign(Object.assign({}, mod), {
			DataResponseBody: params.DataResponseBody || (function () {
				return [...arguments];
			}),
		}).OLSKControllerGlobalMiddleware(Object.assign({
			hostname: Math.random().toString(),
			path: Math.random().toString(),
		}, params), Object.assign(params.res || params, Object.assign({
			locals: {
				OLSK_SPEC_UI: (function () {
					return false;
				}),
			},
			send: (function () {
				return [...arguments];
			}),
		}, params)), params.next || function () {
			return [...arguments];
		});
	};

	it('calls next if no match', async function () {
		const next = Math.random().toString();

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname: Math.random().toString(),
			next: (function () {
				return next;
			}),
		}), next);
	});

	it('calls DataResponseBody', async function () {
		const hostname = uRandomElement(Object.keys(mod.DataDomainMap()));
		const path = Math.random().toString();
		const res = {
			[Math.random().toString()]: Math.random().toString(),
		};

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname,
			path,
			res,
		}), [[{
			ParamHostname: hostname,
			ParamPath: path,
			ParamResponse: res,
		}, ]]);
	});

	it('returns res.send with DataResponseBody result', async function () {
		const DataResponseBody = Math.random().toString();

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname: uRandomElement(Object.keys(mod.DataDomainMap())),
			send: (function () {
				return [...arguments];
			}),
			DataResponseBody: (function () {
				return DataResponseBody;
			}),
		}), [DataResponseBody]);
	});

	context('error', function () {
		
		it('calls next', async function () {
			const next = Math.random().toString();

			deepEqual(await _OLSKControllerGlobalMiddleware({
				hostname: uRandomElement(Object.keys(mod.DataDomainMap())),
				DataResponseBody: (function () {
					throw new Error(uRandomInt());
				}),
				next: (function () {
					return [...arguments].concat(next);
				}),
			}), [next]);
		});
		
		it('sets res.statusCode', async function () {
			const item = {
				statusCode: Math.random().toString(),
			};
			const error = uRandomInt();

			deepEqual(await _OLSKControllerGlobalMiddleware(Object.assign(item, {
				hostname: uRandomElement(Object.keys(mod.DataDomainMap())),
				DataResponseBody: (function () {
					throw new Error(error);
				}),
				next: (function () {
					return item.statusCode;
				}),
			})), error);
		});
	
	});

});

describe('DataResponseBody', function test_DataResponseBody() {

	const _DataResponseBody = function (params = {}) {
		return Object.assign(Object.assign({}, mod), {
			_DataRaw: (function () {
				return Promise.resolve({
					headers: params.headers || [],
					body: (params._DataRaw || function() {})(...arguments),
				});
			}),
			DataContent: params.DataContent || function () {
				return [...arguments];
			},
		}).DataResponseBody(Object.assign({
			ParamHostname: Math.random().toString(),
			ParamPath: Math.random().toString(),
			ParamResponse: {
				'set': params.set || (function () {}),
			},
		}, params));
	};

	it('rejects if not object', function () {
		return rejects(mod.DataResponseBody(null), /GRDErrorInputNotValid/);
	});

	it('rejects if ParamHostname not string', function () {
		return rejects(_DataResponseBody({
			ParamHostname: null,
		}), /GRDErrorInputNotValid/);
	});

	it('rejects if ParamPath not string', function () {
		return rejects(_DataResponseBody({
			ParamPath: null,
		}), /GRDErrorInputNotValid/);
	});

	it('rejects if ParamResponse not object', function () {
		return rejects(_DataResponseBody({
			ParamResponse: null,
		}), /GRDErrorInputNotValid/);
	});

	it('calls _DataRaw', async function () {
		const ParamHostname = uRandomElement(Object.keys(mod.DataDomainMap()));
		const ParamPath = Math.random().toString();

		deepEqual(await _DataResponseBody({
			ParamHostname,
			ParamPath,
			_DataRaw: (function () {
				return [...arguments].join('');
			}),
			DataContent: (function () {
				return [...arguments].shift();
			}),
		}), mod.DataURL(mod.DataDomainMap()[ParamHostname], ParamPath));
	});

	it('calls ParamResponse.set with _DataRaw.headers', async function () {
		const item = [];

		const headers = {
			[Math.random().toString()]: Math.random().toString(),
		};

		await _DataResponseBody({
			headers,
			'set': (function () {
				item.push([...arguments]);
			}),
		});

		deepEqual(item, Object.entries(headers));
	});

	it('calls DataContent', async function () {
		const ParamHostname = uRandomElement(Object.keys(mod.DataDomainMap()));
		const _DataRaw = Math.random().toString();

		deepEqual(await _DataResponseBody({
			ParamHostname,
			_DataRaw: (function () {
				return _DataRaw;
			}),
			DataContent: (function () {
				return [...arguments];
			}),
		}), [_DataRaw, mod.DataDomainMap()[ParamHostname]]);
	});

});

describe('DataDomainMap', function test_DataDomainMap() {

	it('returns array', function () {
		deepEqual(mod.DataDomainMap(), JSON.parse(process.env.GRD_REMIT_MAP));
	});

});

describe('DataContent', function test_DataContent() {

	const _DataContent = function (params) {
		return mod.DataContent(params.raw || Math.random().toString(), params.needle || Math.random().toString());
	};

	it('returns param1', function () {
		const raw = Math.random().toString();

		deepEqual(_DataContent({
			raw,
		}), raw);
	});

	it('replaces param2', function () {
		const raw = Math.random().toString();
		const needle = Math.random().toString();

		deepEqual(_DataContent({
			raw: needle + raw + needle,
			needle,
		}), raw);
	});

	it('replaces param2 + index.html', function () {
		const raw = Math.random().toString();
		const needle = Math.random().toString();

		deepEqual(_DataContent({
			raw: raw + needle + '/index.html',
			needle,
		}), raw + '/');
	});

	context('meta', function () {
		
		it('inserts og:image', function () {
			const raw = Math.random().toString() + '</head></head>';

			deepEqual(_DataContent({
				raw,
			}), raw.replace('</head>', `<meta property="og:image" content="${ process.env.OLSK_LAYOUT_TOUCH_ICON_URL }"></head>`));
		});
	
	});

});

describe('DataURL', function test_DataURL() {

	const _DataURL = function (params) {
		return mod.DataURL(params.root || Math.random().toString(), params.path || Math.random().toString());
	};

	it('returns url', function () {
		const root = Math.random().toString();
		const path = Math.random().toString();

		deepEqual(_DataURL({
			root,
			path,
		}), root + path);
	});

	it('replaces /', function () {
		const root = Math.random().toString();

		deepEqual(_DataURL({
			root,
			path: '/',
		}), root + '/index.html');
	});

	context('_GRD_REF', function () {
		
		it('replaces if _GRD_REF_DIR', function () {
			deepEqual(_DataURL({
				root: mod.DataDomainMap()[process.env._GRD_REF_DOMAIN],
				path: process.env._GRD_REF_DIR + uRandomElement('', '/'),
			}), process.env._GRD_REF_TEMPLATE + process.env._GRD_REF_DIR + '/');
		});

		it('ignores if root or alphanumeric', function () {
			const path = uRandomElement('/', '/' + Date.now().toString(36));

			deepEqual(_DataURL({
				root: mod.DataDomainMap()[process.env._GRD_REF_DOMAIN],
				path,
			}), mod.DataDomainMap()[process.env._GRD_REF_DOMAIN] + (path === '/' ? '/index.html' : path));
		});
	
	});

});
