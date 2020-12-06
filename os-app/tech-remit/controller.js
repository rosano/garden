const mod = {

	// DATA

	DataDomainMap() {
		return JSON.parse(process.env.GRD_REMIT_MAP);
	},

};

Object.assign(exports, mod);
