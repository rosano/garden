const mod = {

	OLSKControllerRoutes() {
		return [{
			OLSKRoutePath: '/',
			OLSKRouteMethod: 'get',
			OLSKRouteSignature: 'GRDVitrineStubRoute',
			OLSKRouteFunction(req, res, next) {
				return res.send('/');
			},
			OLSKRouteLanguageCodes: ['en'],
		}];
	},

};

Object.assign(exports, mod);
