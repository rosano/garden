const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('GRDError404_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('GRDError404', function test_GRDError404 () {
		
		it('classes OLSKCommon', function () {
			browser.assert.hasClass(GRDError404, 'OLSKCommon');
		});

		it('classes OLSKCommonCapped', function () {
			browser.assert.hasClass(GRDError404, 'OLSKCommonCapped');
		});
	
	});

	describe('GRDError404Identity', function test_GRDError404Identity() {

		it('classes OLSKCommonCard', function () {
			browser.assert.hasClass(GRDError404Identity, 'OLSKCommonCard');
		});

		it('classes OLSKCommonIdentityCard', function () {
			browser.assert.hasClass(GRDError404Identity, 'OLSKCommonIdentityCard');
		});
		
	});

});
