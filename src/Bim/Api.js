var BimApi = function () {
	var self = {};

	self.IfcToMtlObj = function (ifc, outdir) {
		return {mtl:'to complete', obj:'to complete'}; 
	}
	self.IfcToMtl = function (ifc, outdir) {
		return {mtl:'to complete'}; 
	}
	self.IfcToObj = function (ifc, outdir) {
		return {obj:'to complete'}; 
	}
	self.divideObj = function (obj, outdir) {
		return {parts:'to complete'}; 
	}

	return self;
};

module.exports = BimApi;