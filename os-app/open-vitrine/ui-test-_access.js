const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	GRDVitrine: '.GRDVitrine',
	
	GRDVitrineCrown: '.GRDVitrineCrown',
	GRDVitrineCrownIcon: '.GRDVitrineCrownIcon',
	GRDVitrineCrownName: '.GRDVitrineCrownName',
	GRDVitrineCrownBlurb: '.GRDVitrineCrownBlurb',
}).map(function (e) {
	return global[e.shift()] = e.pop();
});

describe('GRDVitrine_Access', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('shows GRDVitrine', function() {
		return browser.assert.elements(GRDVitrine, 1);
	});
	
	it('shows GRDVitrineCrown', function() {
		return browser.assert.elements(GRDVitrineCrown, 1);
	});
	
	it('shows GRDVitrineCrownIcon', function() {
		return browser.assert.elements(GRDVitrineCrownIcon, 1);
	});
	
	it('shows GRDVitrineCrownName', function() {
		return browser.assert.elements(GRDVitrineCrownName, 1);
	});

	it('shows GRDVitrineCrownBlurb', function () {
		return browser.assert.elements(GRDVitrineCrownBlurb, 1);
	});
	
});
