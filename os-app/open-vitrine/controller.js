exports.OLSKControllerUseLivereload = function() {
	return process.env.NODE_ENV === 'development';
};

exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'GRDVitrineRoute',
		OLSKRouteFunction (req, res, next) {
			return res.OLSKExpressLayoutRender(require('path').join(__dirname, 'ui-view'));
		},
		OLSKRouteLanguageCodes: ['en'],
	}];
};
