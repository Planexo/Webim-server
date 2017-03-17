'use strict';

var spawn = require('child_process').spawnSync;
var fs = require('fs');

var Constantes = require('../Constantes');

var isWindows = /^win/.test(process.platform);

/**
 * Cette classe fait office d'interface entre l'application et les outils BIM
 * @returns {{}}
 * @constructor
 * TODO : compléter la liste des fonctions
 */
var BimApi = function () {
	var self = {};

    /**
     * Liste des exécutables
     * @type {{ifcObj: string, ifcConvert: string}}
     */
	var executables = {
	    ifcObj: isWindows ? "" : "bin/IfcObj",
	    ifcConvert: isWindows ? "bin\\IfcConvert.exe" : "bin/IfcConvert"
    };

    /**
     * Exemple : R2cupère les parties obj et mtl d'un fichier ifc
     * @param ifc
     * @param outfile
     * @param callback : La fonction à appeler quand la commande s'est exécutée
     * @returns {boolean}
     * @constructor
     */
	self.IfcToMtlObj = function (ifc, outfile, callback) {
	    //si la fonction callback n'est pas défini par l'appelant, on retourne false
        if(callback == null)
            return false;

        //la commande IfcOpenShell
	    var cmd = executables.ifcConvert ;
	    var args = [ifc, outfile];

	    if( ! fs.existsSync(ifc)){
	        try{
	            throw new ("Le fichier demandé n'existe pas.");
            }catch (e){
                callback(e,undefined,e.message);
            }
            return false;
        }

	    //Permet de voir quelle commande a été exécutée (regarder la console Server :p )
        console.log('EXEC : ' + cmd)

        var ret ;
	    if(isWindows){
	        // Sous windows, on exécute le programme cmd.exe auquel on passe tous les paramètres pour exécuter notre commande
	        args = ['/c',cmd].concat(args);
	        ret = spawn(process.env.comspec,args);
        }else{
            ret = spawn(cmd,args);
        }

        callback(ret.error, ret.stdout, ret.stderr);

        return true;
	};
    /**
     * Exemple
     * @param ifc
     * @param outdir
     * @returns {{mtl: string}}
     * @constructor
     */
	self.IfcToMtl = function (ifc, outdir) {
		return {mtl:'to complete'}; 
	};
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