'use strict';

var bimapi = require('../Bim/Api')();
var fs = require('fs');

var colors = require('colors');

var IfcCtrl = function(Auth){
	var self = {};

	self.get = function(req, res, next){
		console.log("getting ifc".cyan)  ;

		var file = req.params.file; 
		var fullfile = './data/'+file; 
 
		var ifc = fs.readFileSync(fullfile, 'utf8'); 

		res.json({ifc:ifc});
	}

	self.getParts = function(req, res, next){
		console.log("getting parts of ifc")  ;

		var file = req.params.file; 
		var fullfile = './data/'+file; 
 
		var mtl = fs.readFileSync(fullfile+'.mtl', 'utf8'); 
		var obj = fs.readFileSync(fullfile+'.obj', 'utf8'); 

		res.json({obj:obj,mtl:mtl});
	}

	self.getAll = function(req, res, next){
		console.log("getting all ifc files".cyan)  
		res.json({data:'ifc files'});
	}
	
	/**
	*	Récupère le fichier ifc et le convertit en mtl
	*/
	self.getMtl = function(req, res, next){
		//console.log("getting mtl from ifc") 

		var file = req.params.file; 
		var fullfile = './data/'+file; 
 
		var content = fs.readFileSync(fullfile, 'utf8'); 

		//conversion : à terminer
		//var mtl = bimapi.IfcToMtl('ifc','./data');
 
		res.json({mtl:content});

	}

	self.getObj = function(req, res, next){
		console.log("getting obj from ifc")  
		
		var file = req.params.file; 
		var fullfile = './data/'+file; 
		
		var content = fs.readFileSync(fullfile, 'utf8');

		//conversion : à terminer
		//var obj = bimapi.IfcToObj('ifc','./data');

		res.json({obj: content});
	}

	self.post = function (req, res, next) {
		console.log("posting ifc")

		console.log(req.body) 
		console.log(req.body.directory) 
		console.log(req.body.test) 

		res.json({posted:true});
	}

	return self;
};

module.exports = IfcCtrl;