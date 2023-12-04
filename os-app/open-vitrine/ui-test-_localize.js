const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe('GRDVitrine_Localize-' + OLSKRoutingLanguage, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes title', function() {
			return browser.assert.text('title', uLocalized('GRDVitrineTitle'));
		});

		it('localizes meta[description]', function() {
			return browser.assert.attribute('meta[name=description]', 'content', uLocalized('GRDVitrineDescription'));
		});

		it('localizes GRDVitrineCrownName', function () {
			return browser.assert.text(GRDVitrineCrownName, uLocalized('GRDVitrineTitle'));
		});

		it('localizes GRDVitrineCrownBlurb', function () {
			return browser.assert.text(GRDVitrineCrownBlurb, uLocalized('GRDVitrineDescription'));
		});

	});

});
