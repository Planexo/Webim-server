/**
 * Cette classe fait office d'interface entre l'application et les outils BIM
 * @returns {{}}
 * @constructor
 * TODO : compléter la liste des fonctions
 */
var BimApi = function () {
	var self = {};

    /**
     * Exemple : R2cupère les parties obj et mtl d'un fichier ifc
     * @param ifc
     * @param outdir
     * @returns {{mtl: string, obj: string}}
     * @constructor
     */
	self.IfcToMtlObj = function (ifc, outdir) {
		return {mtl:'to complete', obj:'to complete'}; 
	}
    /**
     * Exemple
     * @param ifc
     * @param outdir
     * @returns {{mtl: string}}
     * @constructor
     */
	self.IfcToMtl = function (ifc, outdir) {
		return {mtl:'to complete'}; 
	}
    /**
     * Exemple
     * @param ifc
     * @param outdir
     * @returns {{obj: string}}
     * @constructor
     */
	self.IfcToObj = function (ifc, outdir) {
		return {obj:'to complete'}; 
	}
    /**
     * Exemple
     * @param obj
     * @param outdir
     * @returns {{parts: string}}
     */
	self.divideObj = function (obj, outdir) {
		return {parts:'to complete'}; 
	}

	return self;
};

module.exports = BimApi;