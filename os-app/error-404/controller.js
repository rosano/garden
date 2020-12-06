const mod = {

	GRDError404Middleware (err, req, res, next) {
		if (res.statusCode !== 404) {
			return next(err);
		}

		return res.OLSKLayoutRender(require('path').join(__dirname, 'ui-view'));
	},

	OLSKControllerRoutes () {
		if (process.env.NODE_ENV !== 'development') {
			return [];
		}

		return [{
			OLSKRoutePath: '/404',
			OLSKRouteMethod: 'get',
			OLSKRouteSignature: 'GRDError404StubRoute',
			OLSKRouteFunction (req, res, next) {
				return res.OLSKLayoutRender(require('path').join(__dirname, 'ui-view'));
			},
			OLSKRouteLanguageCodes: ['en'],
		}];
	},

	OLSKControllerSharedErrorHandlers () {
		return [
			mod.GRDError404Middleware,
		];
	},

};

Object.assign(exports, mod);
