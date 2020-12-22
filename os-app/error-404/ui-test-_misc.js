const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('GRDError404_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('GRDError404', function test_GRDError404 () {
		
		it('classes OLSKDecor', function () {
			browser.assert.hasClass(GRDError404, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			browser.assert.hasClass(GRDError404, 'OLSKDecorCapped');
		});
	
	});

	describe('GRDError404Crown', function test_GRDError404Crown() {

		it('classes OLSKCommonCard', function () {
			browser.assert.hasClass(GRDError404Crown, 'OLSKCommonCard');
		});

		it('classes OLSKCommonCrownCard', function () {
			browser.assert.hasClass(GRDError404Crown, 'OLSKCommonCrownCard');
		});
		
	});

});
