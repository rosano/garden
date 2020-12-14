const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('GRDVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('GRDVitrine', function () {
		
		it('classes OLSKCommon', function () {
			browser.assert.hasClass(GRDVitrine, 'OLSKCommon');
		});

		it('classes OLSKCommonCapped', function () {
			browser.assert.hasClass(GRDVitrine, 'OLSKCommonCapped');
		});
	
	});

	describe('GRDVitrineCrown', function test_GRDVitrineCrown() {

		it('classes OLSKCommonCard', function () {
			browser.assert.hasClass(GRDVitrineCrown, 'OLSKCommonCard');
		});

		it('classes OLSKCommonCrownCard', function () {
			browser.assert.hasClass(GRDVitrineCrown, 'OLSKCommonCrownCard');
		});
		
	});

	describe('GRDVitrineCrownIcon', function () {

		it('sets role', function () {
			browser.assert.attribute(GRDVitrineCrownIcon, 'role', 'presentation');
		});

		it('sets src', function () {
			browser.assert.attribute(GRDVitrineCrownIcon, 'src', process.env.OLSK_EXPRESS_IDENTITY_ICON_URL);
		});

	});

});
