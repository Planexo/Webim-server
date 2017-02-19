const server = require('../../app');
const constantes = require('../Constantes');
const auth = require('../Auth/Auth')(constantes); 


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect

chai.use(chaiHttp);

const apipath = constantes.API_RESTPATH;

var req = { 
	headers:{
		'apikey':constantes.API_KEY
	}
};
describe('Testing Router', function () {
	it('checks root path',function (done) {
	
		chai.request(server)
            .get(apipath+'/')  
            .end(( err,res) => {   

            	expect(res.status).to.equal(200);  				

                done(); 
            }); 
	})
}); 