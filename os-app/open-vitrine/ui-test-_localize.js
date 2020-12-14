const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe(`GRDVitrine_Localize-${ OLSKRoutingLanguage }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('GRDVitrineTitle'));
		});

		it('localizes meta[description]', function() {
			browser.assert.attribute('meta[name=description]', 'content', uLocalized('GRDVitrineDescription'));
		});

		it('localizes GRDVitrineCrownName', function () {
			browser.assert.text(GRDVitrineCrownName, uLocalized('GRDVitrineTitle'));
		});

		it('localizes GRDVitrineCrownBlurb', function () {
			browser.assert.text(GRDVitrineCrownBlurb, uLocalized('GRDVitrineDescription'));
		});

	});

});
