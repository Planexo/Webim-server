var BimApi = function () {
	var self = {};

	self.IfcToMtlObj = function (ifc, outdir) {
		return {mtl:null, obj:null}; 
	}
	self.IfcToMtl = function (ifc, outdir) {
		return {mtl:null}; 
	}
	self.IfcToObj = function (ifc, outdir) {
		return {obj:null}; 
	}
	self.divideObj = function (obj, outdir) {
		return {parts:null}; 
	}

	return self;
};

module.exports = BimApi;