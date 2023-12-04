const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('GRDRobots_Misc', function () {

	it('sends text', async function () {
		return browser.assert.deepEqual(await (await browser.fetch('http://localhost' + kDefaultRoute.OLSKRoutePath)).text(), 'User-agent: *\nAllow: /\n');
	});

});
