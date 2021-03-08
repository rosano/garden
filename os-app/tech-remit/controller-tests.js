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
			}), [new Error(), next]);
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
		const ParamHostname = uRandomElement(Object.keys(mod.DataDomainMap()));

		const item = [];

		const headers = {
			[Math.random().toString()]: Math.random().toString(),
		};

		await _DataResponseBody({
			ParamHostname,
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
			raw: raw + needle + mod._DataRootNeedle(),
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

describe('_DataRootNeedle', function test__DataRootNeedle() {

	it('returns string', function () {
		deepEqual(mod._DataRootNeedle(), '/index.html');
	});

});

describe('_DataRootBase', function test__DataRootBase() {

	it('throws if not string', function () {
		throws(function () {
			mod._DataRootBase(null);
		}, /GRDErrorInputNotValid/);
	});

	it('throws if without _DataRootNeedle', function () {
		throws(function () {
			mod._DataRootBase(Math.random().toString());
		}, /GRDErrorInputNotValid/);
	});

	it('throws if _DataRootNeedle not at end', function () {
		throws(function () {
			mod._DataRootBase(mod._DataRootNeedle() + Math.random().toString());
		}, /GRDErrorInputNotValid/);
	});

	it('returns string', function () {
		const item = Math.random().toString();
		deepEqual(mod._DataRootBase(item + mod._DataRootNeedle()), item);
	});

});

describe('DataURL', function test_DataURL() {

	const _DataURL = function (params) {
		return mod.DataURL(params.root || Math.random().toString(), params.path || Math.random().toString());
	};

	it('returns url', function () {
		const root = Math.random().toString() + mod._DataRootNeedle();
		const index = uRandomElement(true, false);
		const path = index ? '/' : Math.random().toString();

		deepEqual(_DataURL({
			root,
			path,
		}), mod._DataRootBase(root) + (index ? mod._DataRootNeedle() : path));
	});

});
