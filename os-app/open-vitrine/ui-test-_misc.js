const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('GRDVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('GRDVitrine', function () {
		
		it('classes OLSKDecor', function () {
			return browser.assert.hasClass(GRDVitrine, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			return browser.assert.hasClass(GRDVitrine, 'OLSKDecorCapped');
		});
	
	});

	describe('GRDVitrineCrown', function test_GRDVitrineCrown() {

		it('classes OLSKCommonCard', function () {
			return browser.assert.hasClass(GRDVitrineCrown, 'OLSKCommonCard');
		});

		it('classes OLSKCommonCrownCard', function () {
			return browser.assert.hasClass(GRDVitrineCrown, 'OLSKCommonCrownCard');
		});
		
	});

	describe('GRDVitrineCrownIcon', function () {

		it('sets role', function () {
			return browser.assert.attribute(GRDVitrineCrownIcon, 'role', 'presentation');
		});

		it('sets src', function () {
			return browser.assert.attribute(GRDVitrineCrownIcon, 'src', process.env.OLSK_EXPRESS_IDENTITY_ICON_URL);
		});

	});

});
