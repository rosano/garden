const { throws, deepEqual } = require('assert');

const mod = require('./controller.js');

describe('OLSKControllerGlobalMiddleware', function test_OLSKControllerGlobalMiddleware() {

	const _OLSKControllerGlobalMiddleware = function (params) {
		return Object.assign(Object.assign({}, mod), {
			_DataRaw: (function () {
				return params._DataRawReject || Promise.resolve({
					headers: [],
					body: (params._DataRaw || function() {})(...arguments),
				});
			}),
		}).OLSKControllerGlobalMiddleware(Object.assign({
			hostname: Math.random().toString(),
			path: Math.random().toString(),
		}, params), Object.assign(params, Object.assign({
			locals: {
				OLSK_SPEC_UI: (function () {
					return false;
				}),
			},
			send: (function () {
				return [].concat(...arguments);
			}),
		}, params)), params.next || function () {});
	};

	it('calls _DataRaw if match', async function () {
		const hostname = uRandomElement(Object.keys(mod.DataDomainMap()));
		const path = Math.random().toString();

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname,
			path,
			_DataRaw: (function () {
				return Array.from(arguments);
			}),
		}), [mod.DataURL(mod.DataDomainMap()[hostname], path)]);
	});

	it('calls next', async function () {
		const next = Math.random().toString();

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname: Math.random().toString(),
			next: (function () {
				return next;
			}),
		}), next);
	});

	it('returns res.send', async function () {
		const _DataRaw = Math.random().toString();

		deepEqual(await _OLSKControllerGlobalMiddleware({
			hostname: uRandomElement(Object.keys(mod.DataDomainMap())),
			send: (function () {
				return Array.from(arguments);
			}),
			_DataRaw: (function () {
				return _DataRaw;
			}),
		}), [_DataRaw]);
	});

	context('error', function () {
		
		it('calls next', async function () {
			const next = Math.random().toString();
			deepEqual(await _OLSKControllerGlobalMiddleware({
				hostname: uRandomElement(Object.keys(mod.DataDomainMap())),
				_DataRawReject: Promise.reject(uRandomInt()),
				next: (function () {
					return Array.from(arguments).concat(next);
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
				_DataRawReject: Promise.reject(error),
				next: (function () {
					return item.statusCode;
				}),
			})), error);
		});
	
	});

});

describe('DataDomainMap', function test_DataDomainMap() {

	it('returns array', function () {
		deepEqual(mod.DataDomainMap(), JSON.parse(process.env.GRD_REMIT_MAP));
	});

});

describe('DataContent', function test_DataContent() {

	const _DataContent = function (params) {
		return mod.DataContent(params.raw || Math.random().toString(), params.needle);
	};

	it('returns result with substitutions', function () {
		const raw = Math.random().toString();
		const needle = Math.random().toString();

		deepEqual(_DataContent({
			raw: needle + raw + needle,
			needle,
		}), raw);
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
