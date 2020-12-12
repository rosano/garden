const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	GRDError404: '.GRDError404',
	
	GRDError404Crown: '.GRDError404Crown',
	GRDError404CrownName: '.GRDError404CrownName',
	
	GRDError404Content: '.GRDError404Content',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('GRDError404_Access', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('shows GRDError404', function() {
		browser.assert.elements(GRDError404, 1);
	});
	
	it('shows GRDError404Crown', function() {
		browser.assert.elements(GRDError404Crown, 1);
	});
	
	it('shows GRDError404CrownName', function() {
		browser.assert.elements(GRDError404CrownName, 1);
	});

	it('shows GRDError404Content', function () {
		browser.assert.elements(GRDError404Content, 1);
	});

});
