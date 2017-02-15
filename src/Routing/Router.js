var express = require('express');
var router = express.Router();

var Auth = require('../Auth/Auth'); 

/* root */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
	IFC
--------------------------------------------------------------------
*/ 
var IfcCtrl = require('../Controller/IfcCtrl')(Auth);

var base = '/ifc';
router.get(base+'/', IfcCtrl.get);
router.get(base+'/mtl', IfcCtrl.getMtl);
router.get(base+'/mtl/:file', IfcCtrl.getMtl);


/*
	OBJ
--------------------------------------------------------------------
*/
var ObjCtrl = require('../src/Controller/ObjCtrl');

base = '/obj';
//router.get(base+'/', ObjCtrl.get);
//router.get(base+'/:file', ObjCtrl.getObj);


/*
	MTL
--------------------------------------------------------------------
*/
var MtlCtrl = require('../src/Controller/MtlCtrl');

base = '/mtl';
//router.get(base+'/', MtlCtrl.get);
//router.get(base+'/:file', MtlCtrl.getMtl);



module.exports = router;
