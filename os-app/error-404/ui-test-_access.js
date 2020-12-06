const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	GRDError404: '.GRDError404',
	
	GRDError404Identity: '.GRDError404Identity',
	GRDError404IdentityName: '.GRDError404IdentityName',
	
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
	
	it('shows GRDError404Identity', function() {
		browser.assert.elements(GRDError404Identity, 1);
	});
	
	it('shows GRDError404IdentityName', function() {
		browser.assert.elements(GRDError404IdentityName, 1);
	});

	it('shows GRDError404Content', function () {
		browser.assert.elements(GRDError404Content, 1);
	});

});
