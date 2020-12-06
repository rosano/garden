const { throws, deepEqual } = require('assert');

const mod = require('./controller.js');

describe('GRDError404Middleware', function test_GRDError404Middleware() {

	const _GRDError404Middleware = function (params) {
		return mod.GRDError404Middleware(params.error || new Error(Math.random().toString()), {}, Object.assign({
			OLSKLayoutRender: (function () {}),
		}, params), params.next);
	};

	it('calls next if no match', async function () {
		const error = new Error(Math.random().toString());

		deepEqual(await _GRDError404Middleware({
			error,
			statusCode: 404 + uRandomInt() * uRandomElement(-1, 1),
			next: (function () {
				return Array.from(arguments);
			}),
		}), [error]);
	});

	it('returns res.OLSKLayoutRender', async function () {
		const DataResponse = Math.random().toString();

		deepEqual(await _GRDError404Middleware({
			statusCode: 404,
			OLSKLayoutRender: (function () {
				return Array.from(arguments);
			}),
		}), [require('path').join(__dirname, 'ui-view')]);
	});

});

describe('OLSKControllerSharedErrorHandlers', function test_OLSKControllerSharedErrorHandlers () {
	
	it('references all middlewares', function () {
		deepEqual(mod.OLSKControllerSharedErrorHandlers(), Object.entries(mod).filter(function (e) {
			return e[0].match(/Middleware$/);
		}).map(function (e) {
			return e[1];
		}));
	});

});
