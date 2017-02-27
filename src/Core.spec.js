const server = require('../app');
const constantes = require('./Constantes'); 
var core = require('./Core')(server); 


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp);

const apipath = constantes.api.path;
const apikey = constantes.api.key;

describe('Testing Application Core', function () {

	it('checks if all middlewares were registered', function (done) { 

		var ret = core.run();

		expect(ret).to.equal(true); 

		done();
	})

	it('checks notFound function', function (done) { 
		chai.request(server)
            .get(apipath+'/bad_route')
            .set('apikey',apikey)
            .end(( err,res) => {   
                expect(res.status).to.equal(404); 
            	done(); 
            });  
	}) 
})