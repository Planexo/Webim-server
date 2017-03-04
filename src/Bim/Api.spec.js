const constantes = require('../Constantes'); 
const BimApi = require('./Api')();

var fs = require('fs');
const chai = require('chai'); 
const expect = chai.expect;

var testdata = {
	out:constantes.paths.data,
	ifc:constantes.paths.data+'1.ifc',
	obj:constantes.paths.data+'1.ifc.obj'
}

describe('Testing Api ', function () {
	it('it converts an ifc file to mlt and obj parts', function (done) {
		BimApi.IfcToMtlObj(testdata.ifc, testdata.out,function () {
            var mtl = fs.readFileSync(testdata.ifc+'.mtl', 'utf8');
            var obj = fs.readFileSync(testdata.ifc+'.obj', 'utf8');
            expect(mtl).to.not.equal(null);
            expect(obj).to.not.equal(null);
        });

        var ret = BimApi.IfcToMtlObj(testdata.ifc, testdata.out);

        expect(ret).to.equal(false);

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