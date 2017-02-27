const server = require('../../app');
const constantes = require('../Constantes');
const auth = require('./Auth')(constantes);


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp);

const apipath = constantes.api.path;
const apikey = constantes.api.key;

describe('Authentify user without checking anything', function () {
	it('does not check the user',function (done) { 
		chai.request(server)
            .get(apipath+'/ifc/1.ifc') 
            .set('apikey',apikey)  
            .end(( err,res) => {

            	res.req.headers = res.req._headers;

            	expect(res.status).to.equal(200);  

            	auth.authentify(res.req,res,function () {});
            	expect(auth.isAuthentified().is).to.equal(true); 

                done(); 
            });
	});
});

describe('Authentify user with http verification', function () {

	it('authentifies user ',function (done) {  
		chai.request(server)
            .get(apipath+'/ifc/1.ifc') 
            .set('apikey',apikey)  
            .end(( err,res) => {  

            	res.req.headers = res.req._headers;

            	expect(res.status).to.equal(200);   

            	auth.method = auth.kind.HTTP;
            	auth.authentify(res.req,res,function () {});
				expect(auth.isAuthentified().is).to.equal(true); 

                done(); 
            });
	});
});

describe('Authentify user with cookies verification', function () {

	it('authentifies user ',function (done) {  
		chai.request(server)
            .get(apipath+'/ifc/1.ifc') 
            .set('apikey',apikey)  
            .end(( err,res) => {  

            	res.req.headers = res.req._headers;

            	expect(res.status).to.equal(200);   

            	auth.method = auth.kind.COOKIES;
            	auth.authentify(res.req,res,function () {});
				expect(auth.isAuthentified().is).to.equal(true); 

                done(); 
            });
	});
});

describe('Authentify user with OAUTH2 verification', function () {

	it('authentifies user',function (done) {  
		chai.request(server)
            .get(apipath+'/ifc/1.ifc') 
            .set('apikey',apikey)  
            .end(( err,res) => {  

            	res.req.headers = res.req._headers;

            	expect(res.status).to.equal(200);   

            	auth.method = auth.kind.OAUTH2;
            	auth.authentify(res.req,res,function () {});
				expect(auth.isAuthentified().is).to.equal(true); 

                done(); 
            });
	});
});

describe('Authentify user with query verification', function () {

	it('authentifies user ',function (done) {  
		chai.request(server)
            .get(apipath+'/ifc/1.ifc') 
            .set('apikey',apikey)  
            .end(( err,res) => {  

            	res.req.headers = res.req._headers;

            	expect(res.status).to.equal(200);   

            	auth.method = auth.kind.QUERY;
            	auth.authentify(res.req,res,function () {});
				expect(auth.isAuthentified().is).to.equal(true); 

                done(); 
            });
	});
});

describe('Authentify user with apikey verification', function () {

	it('authentifies user if apikey is correct',function (done) {  
		chai.request(server)
            .get(apipath+'/ifc/1.ifc') 
            .set('apikey',apikey)  
            .end(( err,res) => {  

            	res.req.headers = res.req._headers;

            	expect(res.status).to.equal(200);   

            	auth.method = auth.kind.APIKEY;
            	auth.authentify(res.req,res,function () {});
				expect(auth.isAuthentified().is).to.equal(true); 

                done(); 
            });
    });
	it('doesnt authentify user if apikey is wrong ',function (done) {  
        //mauvaise clé
        chai.request(server)
            .get(apipath+'/ifc/1.ifc') 
            .set('apikey','BAD KEY')  
            .end(( err,res) => {    

            	res.req.headers = res.req._headers; 
            	auth.method = auth.kind.APIKEY;
            	auth.authentify(res.req,res,null);

            	expect(res.status).to.equal(401); 

				expect(auth.isAuthentified().is).to.equal(false); 

                done(); 
            });
    });
	it('doesnt authentify user if apikey is not defined ',function (done) { 
        //clé non fournie
        chai.request(server)
            .get(apipath+'/ifc/1.ifc')  
            .end(( err,res) => {  

            	res.req.headers = res.req._headers; 
            	auth.method = auth.kind.APIKEY;
            	auth.authentify(res.req,res,null);

            	expect(res.status).to.equal(401); 
				expect(auth.isAuthentified().is).to.equal(false); 

                done(); 
            });
	});
});
 