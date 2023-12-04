const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('GRDError404_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('GRDError404', function test_GRDError404 () {
		
		it('classes OLSKDecor', function () {
			return browser.assert.hasClass(GRDError404, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			return browser.assert.hasClass(GRDError404, 'OLSKDecorCapped');
		});
	
	});

	describe('GRDError404Crown', function test_GRDError404Crown() {

		it('classes OLSKCommonCard', function () {
			return browser.assert.hasClass(GRDError404Crown, 'OLSKCommonCard');
		});

		it('classes OLSKCommonCrownCard', function () {
			return browser.assert.hasClass(GRDError404Crown, 'OLSKCommonCrownCard');
		});
		
	});

});
