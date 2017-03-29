'use strict';

var bimapi = require('../Bim/Api')();
var Constantes = require('../Constantes');
var cache = require('../Cache/Cache')();

var fs = require('fs');
var colors = require('colors');
var spawn = require('child_process').spawnSync;

/**
 * Cette classe fait office de controleur pour tout ce qui concerne directment les fichiers ifc
 * @returns {{}}
 * @constructor
 */
var ObjCtrl = function() {
    var self = {};

    /**
     * Récupère une partie d'un fichier obj
     * @param req
     * @param res
     * @param next
     */
    self.getPart = function(req, res, next) {
        console.log("getting a part of obj".cyan);

        var index = req.params.index;
        var file = req.params.file;
        var fullfile = Constantes.paths.data + file;

        if( ! fs.existsSync(fullfile)){
            res.json({error:"Ce fichier n'a pas été trouvé. "});
            return ;
        }

        var content = fs.readFileSync(fullfile+''+index+'.objpart', 'utf8');
        res.json({content : content});

    };

    /**
     * Récupère toutes les parties du fichier obj demandé
     * @param req
     * @param res
     * @param next
     */
    self.getParts = function(req, res, next) {
        console.log("getting parts of obj".cyan);

        var file = req.params.file; // obj file
        var fullfile = Constantes.paths.data + file;
        var fullfileMtl = fullfile.replace(/\.obj$/g,".mtl");
        var directory = '';

        console.log(fullfileMtl);

        if( ! fs.existsSync(fullfile) || ! fs.existsSync(fullfileMtl)){
            res.json({error:"Ce fichier n'a pas été trouvé. "});
            return ;
        }

        var K = 0;
        var mtl = fs.readFileSync(fullfileMtl, 'utf8');;
        if( ! fs.existsSync(fullfile+'.global.json') ){
            console.log("Génération de l'objet en cours ...");

            directory = fullfile+'d/';
            if( ! fs.existsSync(directory) ){
                fs.mkdirSync(directory);
            }

            K = bimapi.divideObj(Constantes.paths.data, file, K, directory);

        }else{
            var global = JSON.parse( fs.readFileSync(fullfile+'.global.json','utf8') );
            directory = global.repertoire;
            K = global.parts.length;
        }


        var content = [];
        if(K > 1){
            for(var i = 0; i<K; ++i){
                content.push(fs.readFileSync( directory + file+''+i+'.objpart', 'utf8'));
            }
        }else{
            content.push(fs.readFileSync(fullfile, 'utf8'))
        }

        res.json({mtl:mtl, parts: content});

    };

    return self;
};

module.exports = ObjCtrl;
