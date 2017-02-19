const constantes = require('../Constantes'); 
const BimApi = require('./Api')();


const chai = require('chai'); 
const expect = chai.expect;

var testdata = {
	out:'/data/',
	ifc:'/data/1.ifc',
	obj:'/data/1.ifc.obj'
}

describe('Testing Api ', function () {
	it('it converts an ifc file to mlt and obj parts', function (done) {
		var ret = BimApi.IfcToMtlObj(testdata.ifc, testdata.out);
		expect(ret.mtl).to.not.equal(null);
		expect(ret.obj).to.not.equal(null);
		done();
	})
	it('it converts an ifc file to mlt', function (done) {
		var ret = BimApi.IfcToMtl(testdata.ifc, testdata.out);
		expect(ret.mtl).to.not.equal(null); 
		done();
	})
	it('it converts an ifc file to obj', function (done) {
		var ret = BimApi.IfcToObj(testdata.ifc, testdata.out); 
		expect(ret.obj).to.not.equal(null);
		done();
	})
	it('it converts an ifc file to obj', function (done) {
		var ret = BimApi.divideObj(testdata.obj, testdata.out); 
		expect(ret.parts).to.not.equal(null);
		done();
	})
})