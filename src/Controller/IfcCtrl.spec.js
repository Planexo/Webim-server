const server = require('../../app');
const constantes = require('../Constantes');
const auth = require('../Auth/Auth')(constantes);
const IfcCtrl = require('./IfcCtrl')(auth);

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp);

const apipath = constantes.api.path;

var req = { 
	headers:{
        apikey:constantes.api.key
	},
	params:{
		file:'1.ifc',
		unknownfile:'dlsjjfsfdsmflfsklfdf.ifc',
		mtlfile:'1.ifc.mtl',
		objfile:'1.ifc.obj'
	}
};

describe('Testing Ifc Controller', function () {
	it('checks get function',function (done) {
	
		chai.request(server)
            .get(apipath+'/ifc/'+req.params.file)
            .set('apikey',req.headers.apikey)
            .end(( err,res) => {

            	res.json = function (objet) {
            		expect(objet).to.not.equal(null); 
            	};
 
            	var response = IfcCtrl.get(req,res,null);

                expect(res.status).to.equal(200);
                done();
            }); 
	})
	it('checks getParts function',function (done) {

	    // Test quand ca marche
		chai.request(server)
            .get(apipath+'/ifc/parts/'+req.params.file)
            .set('apikey',req.headers.apikey)
            .end(( err,res) => {
            	res.json = function (objet) {
            		expect(objet.obj).to.not.equal(null); 
            		expect(objet.mtl).to.not.equal(null); 
            	};
 
            	var response = IfcCtrl.getParts(req,res,null);
                expect(res.status).to.equal(200);
            });
        //Test quand ca ne devrait pas en utilisant 'unknownfile'
        chai.request(server)
            .get(apipath+'/ifc/parts/'+req.params.unknownfile)
            .set('apikey',req.headers.apikey)
            .end(( err,res) => {

                res.json = function (objet) {
                    expect(objet.error).to.not.equal(null);
                    expect(objet.stderr).to.not.equal(null);
                };

                var response = IfcCtrl.getParts(req,res,null);
                expect(res.status).to.equal(520);
            });


        done();
    })
	it('checks getAll function',function (done) {
	
		chai.request(server)
            .get(apipath+'/ifc/files/'+req.params.file)
            .set('apikey',req.headers.apikey)
            .end(( err,res) => {   


            	res.json = function (objet) {
            		expect(objet.data).to.not.equal(null);  
            	};
 
            	var response = IfcCtrl.getAll(req,res,null);
                expect(res.status).to.equal(200);

        done();
            }); 
	})
	it('checks getMtl function',function (done) {
	
		chai.request(server)
            .get(apipath+'/ifc/mtl/'+req.params.mtlfile)
            .set('apikey',req.headers.apikey)
            .end(( err,res) => {

            	res.json = function (objet) {
            		expect(objet.mtl).to.not.equal(null);  
            	};
 
            	var response = IfcCtrl.getMtl(req,res,null);

                expect(res.status).to.equal(200);

        done();
            }); 
	})
	it('checks getObj function',function (done) {

            chai.request(server)
            .get(apipath+'/ifc/obj/'+req.params.objfile)
            .set('apikey',req.headers.apikey)
            .end(( err,res) => {

            	res.json = function (objet) {
            		expect(objet.obj).to.not.equal(null);  
            	};
 
            	var response = IfcCtrl.getObj(req,res,null);

                expect(res.status).to.equal(200);

                done();
            }); 
	})
	it('checks post function',function (done) {

		chai.request(server)
            .post(apipath+'/ifc')
            .set('apikey',req.headers.apikey)
            .end(( err,res) => {

            	res.json = function (objet) {
            		expect(objet.posted).to.equal(true);  
            	};
 
            	var response = IfcCtrl.post(req,res,null);

                expect(res.status).to.equal(200);
                done();
            }); 
	})
})

