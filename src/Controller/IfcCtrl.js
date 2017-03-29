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
        //if( cache.getIfRecent(cacheName) ){
            console.log('Generated with cache system');

            var mtl = fs.readFileSync(fullfile+'.mtl', 'utf8');
            var obj = fs.readFileSync(fullfile+'.obj', 'utf8');

            res.json({obj:obj,mtl:mtl});
            return;
        //}


        bimapi.IfcToMtlObj(
            fullfile, /* ifc */
            fullfile+'.obj', /* fichier obj attendu */
            function (error, stdout, stderr) {  /* fonction callback */

                if(error == undefined || error == null){
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
                    res.json({error:"[Bim API :: IfcToMtlObj] failed to transform ifc to obj"});
                }
            }
        );
	};

    /**
     * Récupère les infos :
     * Si le fichier est trop petit pour etre pdécoupé, on renvoie l'obj au lieu de du global.json
     * @param req
     * @param res
     * @param next
     */
    self.getInfos = function(req, res, next){

        var file = req.params.file;

        var ifcfile = Constantes.paths.data + file;
        var globalfile = Constantes.paths.data + file + '.obj.global.json';
        var mtlfile = Constantes.paths.data + file + '.mtl';

        var mtl = fs.readFileSync(mtlfile, 'utf8');

        if( ! fs.existsSync(globalfile)){

            if( ! fs.existsSync(ifcfile)){
                res.json({infos:null,mtl:mtl});
            }else{
                console.log("Génération de l'objet en cours ...".cyan);

                var directory = ifcfile+'.objd/';
                if( ! fs.existsSync(directory) ){
                    fs.mkdirSync(directory);
                }

                //on renvoie la réponse avant la découpe
                res.json({infos:null,mtl:mtl});

                //Découpe
                var K = 0;
                K = bimapi.divideObj(Constantes.paths.data, file+'.obj', K, directory);

                // Si le fichier ne peut pas être découpé, on génère un global.json à la volée
                if( K <2){
                    var global = {
                        repertoire: directory,
                        parts:[{
                            filename: file+'.obj'
                        }]
                    };

                    try{
                        fs.writeFileSync(globalfile, JSON.stringify(global), 'utf8');
                    }catch(e){
                        return;
                    }
                }
            }

        }else{

            var infos = fs.readFileSync(globalfile, 'utf8');
            res.json({infos:infos,mtl:mtl});

        }
    };

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
		var fullfile = './data/'+file+'.mtl';
 
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
		var fullfile = './data/'+file+'.obj';

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

		console.log(req.body)
		console.log(req.body.file)
        console.log(req.body.directory)

        var file = req.body.filename || '';
        var fileContent = req.body.fileContent || '';
        var directory = req.body.directory || '';

		if(file.length == 0 || file == undefined){
            res.status(520);
            res.json({error: "Aucun fichier n'a été soumis."});
            return;
        }
        file = Constantes.paths.data + directory + file;

		// Ecriture du fichier

        try{
            fs.writeFileSync(file, fileContent, 'utf8');
        }catch(e){
            res.status(520);
            res.json({error: "L'écriture du fichier a échoué."});
            return;
        }

        //Découpage automatique

        bimapi.IfcToMtlObj(
            file,
            file+'.obj',
            function (error, stdout, stderr) {

                if(stderr.length == 0){
                    console.log("[Bim API :: IfcToMtlObj] transformed ifc to obj".green);

                    var obj = fs.readFileSync(file+'.obj', 'utf8');

                    bimapi.divideObj(obj, Constantes.paths.data + directory);

                    //on renvoie la réponse
                    res.json({posted:true});
                }else{
                    console.log("[Bim API :: IfcToMtlObj] failed to transform ifc to obj".red);

                    // Si le post a échoué, on supprime tout
                    fs.unlink(file, function(err){ });
                    fs.unlink(file+'.obj', function(err){ });
                    fs.unlink(file+'.mtl', function(err){ });

                    // 520 = Http Unknown Error
                    res.status(520);

                    //on renvoie l'erreur
                    res.json({posted:false, error:error,stderr:stderr});
                }
            }
        );

	};

	return self;
};

module.exports = IfcCtrl;