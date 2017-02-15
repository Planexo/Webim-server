var bimapi = require('../Bim/Api')();
var fs = require('fs');

var IfcCtrl = function(Auth){
	var self = {};

	self.get = function(req, res, next){
		console.log("getting ifc")  
		res.json({data:'ifc'});
	}
	
	self.getMtl = function(req, res, next){
		console.log("getting mtl from ifc") 

		var file = req.params.file; 
		var fullfile = './data/'+file; 
		
		fs.readFile(fullfile, 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  } 
		  res.json({data:data});
		});

		//var mtl = bimapi.IfcToMtl('ifc','./data');
 
		//res.json({data:mtl});
	}

	self.getObj = function(req, res, next){
		console.log("getting obj from ifc")  
		
		var file = req.params.file; 
		var fullfile = './data/'+file; 
		
		fs.readFile(fullfile, 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  } 
		  res.json({data:data});
		});

		//var obj = bimapi.IfcToObj('ifc','./data');

		//res.json({data:obj});
	}

	return self;
};

module.exports = IfcCtrl;