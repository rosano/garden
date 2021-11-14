exports.OLSKControllerRoutes = function() {
	return [{
		OLSKRoutePath: '/robots.txt',
		OLSKRouteMethod: 'get',
		OLSKRouteSignature: 'GRDRobotsRoute',
		OLSKRouteFunction (req, res, next) {
			return res.send('User-agent: *\nAllow: /\n');
		},
	}];
};
