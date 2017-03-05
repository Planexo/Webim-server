'use strict';

var bimapi = require('../Bim/Api')();
var Constantes = require('../Constantes');
var cache = require('../Cache/Cache')();

var fs = require('fs');
var colors = require('colors');

/**
 * Cette classe fait office de controleur pour tout ce qui concerne directment les fichiers ifc
 * @returns {{}}
 * @constructor
 */
var IfcCtrl = function(){
	var self = {};

    /**
	 * Cette fonction renvoie le fichier ifc demandé
     * @param req
     * @param res
     * @param next
     */
	self.get = function(req, res, next){
		console.log("getting ifc".cyan)  ;

		var file = req.params.file; 
		var fullfile = Constantes.paths.data+file;
 
		var ifc = fs.readFileSync(fullfile, 'utf8');

		res.json({ifc:ifc}); 
	}

    /**
     * Cette fonction renvoie les parties mtl et obj du fichier ifc demandé
     * @param req
     * @param res
     * @param next
     */
	self.getParts = function(req, res, next){
		console.log("getting parts of ifc".cyan)  ;

		var file = req.params.file; 
		var fullfile = Constantes.paths.data+file;

		var cacheName = 'getPartsof'+fullfile;

		//On vérifie si ce cache existe et s'il est à jour. Si oui, on renvoie directement les fichiers demandés
        if( cache.getIfRecent(cacheName) ){
            console.log('Generated with cache system');

            var mtl = fs.readFileSync(fullfile+'.mtl', 'utf8');
            var obj = fs.readFileSync(fullfile+'.obj', 'utf8');

            res.json({obj:obj,mtl:mtl});
            return;
        }


        bimapi.IfcToMtlObj(
            fullfile, /* ifc */
            fullfile+'.obj', /* fichier obj attendu */
            function (error, stdout, stderr) {  /* fonction callback */

                if(stderr.length == 0){
                    console.log("[Bim API :: IfcToMtlObj] transformed ifc to obj".green);

                    var mtl = fs.readFileSync(fullfile+'.mtl', 'utf8');
                    var obj = fs.readFileSync(fullfile+'.obj', 'utf8');

                    //on crée une entrée dans le cache avec la clé 'cachename'
                    cache.set(cacheName,['u'],
                        [
                            fullfile+'.mtl',
                            fullfile+'.obj'
                        ]);
                    //on sauvegarde cette liste de fichiers dans le cache avec la clé 'cachename'
                    cache.save();

                    //on renvoie la réponse
                    res.json({obj:obj,mtl:mtl});
                }else{
                    console.log("[Bim API :: IfcToMtlObj] failed to transform ifc to obj".red);

                    // 520 = Http Unknown Error
                    res.status(520);

                    //on renvoie l'erreur
                    res.json({error:error,stderr:stderr});
                }
            }
        );
	}

    /**
     * Cette fonction renvoie tous les fichiers ifc du répertoire demandé
     * @param req
     * @param res
     * @param next
     */
	self.getAll = function(req, res, next){
		console.log("getting all ifc files".cyan)  
		res.json({data:'ifc files'});
	}

    /**
     * Cette fonction renvoie la partie mtl fichier ifc demandé
     * @param req
     * @param res
     * @param next
     */
	self.getMtl = function(req, res, next){
		console.log("getting mtl from ifc".cyan) 

		var file = req.params.file; 
		var fullfile = './data/'+file; 
 
		var content = fs.readFileSync(fullfile, 'utf8'); 

		//conversion : à terminer
		//var mtl = bimapi.IfcToMtl('ifc','./data');
 
		res.json({mtl:content});

	}

    /**
     * Cette fonction renvoie la partie obj du fichier ifc demandé
     * @param req
     * @param res
     * @param next
     */
	self.getObj = function(req, res, next){
		console.log("getting obj from ifc".cyan)  
		
		var file = req.params.file; 
		var fullfile = './data/'+file; 
		
		var content = fs.readFileSync(fullfile, 'utf8');

		//conversion : à terminer
		//var obj = bimapi.IfcToObj('ifc','./data');

		res.json({obj: content});
	}

    /**
     * Cette fonction sauvegarde le fichier ifc recu
     * @param req
     * @param res
     * @param next
     */
	self.post = function (req, res, next) {
		console.log("posting ifc".cyan)

		/*console.log(req.body) 
		console.log(req.body.directory) 
		console.log(req.body.test) */

		res.json({posted:true});
	}

	return self;
};

module.exports = IfcCtrl;