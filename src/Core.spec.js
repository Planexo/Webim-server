const server = require('../app');
const constantes = require('./Constantes'); 
var core = require('./Core')(server); 


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp);

const apipath = constantes.API_RESTPATH;

describe('Testing Application Core', function () {
	it('checks configuration settings', function (done) {
		let db = {host:'localhost'};
		core.setDB(db);

		expect(core.getDB()).to.equal(db); 

		done();
	})

	it('checks if all middlewares were registered', function (done) { 

		let ret = core.run();

		expect(ret).to.equal(true); 

		done();
	})

	it('checks notFound function', function (done) { 
		chai.request(server)
            .get(apipath+'/bad_route')   
            .end(( err,res) => {   
                expect(res.status).to.equal(404); 
            	done(); 
            });  
	})
})