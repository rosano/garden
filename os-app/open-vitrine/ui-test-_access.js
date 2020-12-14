const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	GRDVitrine: '.GRDVitrine',
	
	GRDVitrineCrown: '.GRDVitrineCrown',
	GRDVitrineCrownIcon: '.GRDVitrineCrownIcon',
	GRDVitrineCrownName: '.GRDVitrineCrownName',
	GRDVitrineCrownBlurb: '.GRDVitrineCrownBlurb',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('GRDVitrine_Access', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('shows GRDVitrine', function() {
		browser.assert.elements(GRDVitrine, 1);
	});
	
	it('shows GRDVitrineCrown', function() {
		browser.assert.elements(GRDVitrineCrown, 1);
	});
	
	it('shows GRDVitrineCrownIcon', function() {
		browser.assert.elements(GRDVitrineCrownIcon, 1);
	});
	
	it('shows GRDVitrineCrownName', function() {
		browser.assert.elements(GRDVitrineCrownName, 1);
	});

	it('shows GRDVitrineCrownBlurb', function () {
		browser.assert.elements(GRDVitrineCrownBlurb, 1);
	});
	
});
