var express = require('express');
var router = express.Router();

/**
 * Racine de l'application
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
	IFC
--------------------------------------------------------------------
*/
var IfcCtrl = require('../Controller/IfcCtrl')();

var base = '/ifc';
router.get(base+'/:file', IfcCtrl.get);
router.get(base+'/files/:directory', IfcCtrl.getAll);
router.get(base+'/parts/:file', IfcCtrl.getParts);  
router.get(base+'/infos/:file', IfcCtrl.getInfos);
router.get(base+'/mtl/:file', IfcCtrl.getMtl);
router.get(base+'/obj/:file', IfcCtrl.getObj); 
router.post(base, IfcCtrl.post); 



/*
	OBJ
--------------------------------------------------------------------
*/
//TODO
var ObjCtrl = require('../Controller/ObjCtrl')();

base = '/obj';
router.get(base+'/:file/parts', ObjCtrl.getParts);
router.get(base+'/:file/part/:index', ObjCtrl.getPart);
//router.get(base+'/:file', ObjCtrl.getObj);


/*
	MTL
--------------------------------------------------------------------
*/
//TODO
//var MtlCtrl = require('../Controller/MtlCtrl');

//base = '/mtl';
//router.get(base+'/', MtlCtrl.get);
//router.get(base+'/:file', MtlCtrl.getMtl);



module.exports = router;
