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
        var fullfile = Constantes.paths.data + file+'d/'+file+index+'.objpart';

        if( ! fs.existsSync(fullfile)){
            res.status(520);
            res.json({error:"Ce fichier n'a pas été trouvé. "});
            return ;
        }

        var content = fs.readFileSync(fullfile, 'utf8');

        res.json({content : content});

    };

    return self;
};

module.exports = ObjCtrl;
