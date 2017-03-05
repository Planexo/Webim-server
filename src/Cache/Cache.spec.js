const constantes = require('../Constantes');
const Cache = require('./Cache');

var fs = require('fs');
const chai = require('chai');
const expect = chai.expect;

var testdata = {
    out:constantes.paths.data,
    ifc:constantes.paths.data+'1.ifc',
    obj:constantes.paths.data+'1.ifc.obj'
};

describe('Testing Cache system ', function () {
    it('it does ...', function (done) {
        var cache = new Cache();
        cache.load();
        expect(Cache.content).to.not.equal(null);
        expect(Cache.content).to.be.a('object');

        expect(cache.getContent()).to.equal(Cache.content);

        expect(cache.keys()).to.be.a('array');

        cache.set("key",['n'],[testdata.ifc, testdata.obj]);

        var cacheitem = {};
        cache.get("key",function (error, key, item) {
            expect(item.pk).to.equal('n');
            expect(item.s.length).to.equal(2);
            expect(item.s[0]).to.equal(testdata.ifc);
            expect(item.s[1]).to.equal(testdata.obj);
            cacheitem = item;
        });

        expect(cache.get("key")).to.equal(cacheitem);

        //la clé 'key' existe
        cache.getIfRecent("key",function (error, key, item,isrecent) {
            expect(isrecent).to.equal(true);
        });
        //la clé 'key45' n'existe pas
        cache.getIfRecent("key45",function (error, key, item,isrecent) {
            expect(isrecent).to.equal(false);
        });

        expect(cache.get("key")).to.equal(cacheitem);

        cache.set("key2",['n'],[testdata.ifc, testdata.obj]);

        cache.mget(["key","key2"],function (error, key, item) {
            expect(item.pk).to.equal('n');
            expect(item.s.length).to.equal(2);
            expect(item.s[0]).to.equal(testdata.ifc);
            expect(item.s[1]).to.equal(testdata.obj);
        });

        cache.del("key", function (error, key, copy) {
            expect(cache.get(key)).to.equal(null || undefined);
        });

        cache.mdel(["key"], function (error, key, copy) {
            expect(cache.get(key)).to.equal(null || undefined);
        });

        // la clé 'key2' utilise la politique 'n' => pas d'expiration. Donc la clé est toujours récente
        expect(cache.isRecent("key2")).to.equal(true);

        // DEFAULT_EXPIRATION
        cache.set("key3",['t'],[testdata.ifc, testdata.obj]);

        expect(cache.get("key3").pv).to.equal(1000*cache.defaultExpiration());

        cache.set("key3",['u'],[testdata.ifc, testdata.obj]);

        expect(cache.isRecent("key3")).to.equal(true);

        cache.set("key3",['t',1],[testdata.ifc, testdata.obj]);

        expect(cache.isRecent("key3")).to.equal(true);

        //la clé n'est plus à jour
        Cache.content.key3.d = 0;
        expect(cache.isRecent("key3")).to.equal(false);

        cache.set("key3",['t',1],[testdata.ifc, testdata.obj]);

        //Ajout d'un faux fichier. IsRecent renvoie false car isComplete échoue (le fichier n'existe pas)
        Cache.content.key3.s.push('fakefile');
        expect(cache.isRecent("key3")).to.equal(false);

        cache.set("key3",['t',1],[testdata.ifc, testdata.obj]);

        cache.evaluate(["key","key3"],function (key,isrecent) {
            if(key=="key")
                expect(isrecent).to.equal(false);
            if(key=="key3")
                expect(isrecent).to.equal(true);
        });
        cache.evaluate("key3");
        cache.evaluate("key",function (key,isrecent) {
            expect(isrecent).to.equal(false);
        });

        //'key' a été supprimé
        expect(cache.get("key")).to.equal(null || undefined);

        //key3 ne peut plus être récente
        Cache.content.key3.d = 0;
        cache.evaluate(["key3"],function (key,isrecent) {
            expect(isrecent).to.equal(false);
        });
        cache.evaluate("key3",function (key,isrecent) {
            expect(isrecent).to.equal(false);
        });
        cache.evaluate(["key3"]);
        cache.evaluate("key3");

        //console.log(Cache.content);

        //'key3' est encore valide
        expect(cache.get("key3")).to.equal(null || undefined);


        expect(cache.save()).to.equal(true);



        //Cache.content = '\EOF';
        //expect(cache.save()).to.equal(false);



        done();
    });

});