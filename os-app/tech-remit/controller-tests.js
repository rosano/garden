const { deepEqual } = require('assert');

const mod = require('./controller.js');

describe('DataDomainMap', function test_DataDomainMap() {

	it('returns array', function () {
		deepEqual(mod.DataDomainMap(), JSON.parse(process.env.GRD_REMIT_MAP));
	});

});
