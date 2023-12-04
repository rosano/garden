const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe('GRDError404_Localize-' + OLSKRoutingLanguage, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes title', function() {
			return browser.assert.text('title', uLocalized('GRDError404Title'));
		});

		it('localizes GRDError404CrownName', function () {
			return browser.assert.text(GRDError404CrownName, uLocalized('GRDError404Title'));
		});

		it('localizes GRDError404Content', function () {
			return browser.assert.text(GRDError404Content, uLocalized('GRDError404ContentText'));
		});

	});

});
