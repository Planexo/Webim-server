const server = require('../../app');
const constantes = require('../Constantes');
const auth = require('../Auth/Auth')(constantes); 


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp);

const apipath = constantes.api.path;

var req = { 
	headers:{
		'apikey':constantes.api.key
	}
};
describe('Testing Router', function () {
	it('checks root path',function (done) {
	
		chai.request(server)
            .get(apipath+'/')
            .set('apikey',req.headers.apikey)
            .end(( err,res) => {

            	expect(res.status).to.equal(200);  				

                done(); 
            }); 
	})
}); 