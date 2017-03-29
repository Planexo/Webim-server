'use strict';

var spawn = require('child_process').spawnSync;
var fs = require('fs');

var Constantes = require('../Constantes');

var isWindows = /^win/.test(process.platform);

/**
 * Cette classe fait office d'interface entre l'application et les outils BIM
 * @returns {{}}
 * @constructor
 */
var BimApi = function () {
	var self = {};

    /**
     * vitesse de navigation du client en Ko/s réupérée dans un store par exemple.
     * on se calibre sur la 2.75G
     *
     * https://fr.wikipedia.org/wiki/3G
     *
     * http://www.supportduweb.com/scripts_tutoriaux-code-source-44-evaluer-la-vitesse-de-connexion-en-javascript.html
     *
     * @type {number}
     */
    var vitesseConnexion = 512;

    /**
     * temps minimal souhaité pour afficher une part de l'objet demandé
     * @type {number}
     */
    var tempsMinimal = 2;

    /**
     * Divise un fichier en plusieurs parties égales
     * @param objSize
     * @returns {Array}
     */
    self.numberOfParts = function (objSize) {
        var parts =   ((objSize/1000) / vitesseConnexion) / tempsMinimal ;
        return parseInt( parts );
    };

    /**
     * Liste des exécutables
     * @type {{ifcObj: string, ifcConvert: string}}
     */
	var executables = {
        objCuter: "bin/ObjCuter/cmake-build-debug/ObjCuter",
	    ifcObj: (isWindows ? "" : "bin/IfcObj"),
	    ifcConvert: (isWindows ? "bin\\IfcConvert.exe" : "bin/IfcConvert")
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
	self.divideObj = function (objpath, objname, K,  outdir, callback) {
        var size = fs.statSync(objpath+objname).size;

        if( ! K){
            K = self.numberOfParts(size);
        }

        //Si la connexion peut supporter un objet entier, pas besoin de le découper

        var ret = spawn(executables.objCuter,[objpath, objname, K, outdir]);

        if(callback)
            callback(ret.error, ret.stdout, ret.stderr);

        return K >= 2 ? K : 1;
	};

	return self;
};

module.exports = BimApi;