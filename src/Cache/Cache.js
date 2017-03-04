'use strict';

var fs = require('fs');
var util = require('util');

/**
 * Classe permettant de gérer le cache
 * @param Constantes
 * @returns {{}}
 */
var cache = function (Constantes) {
    var self = {};
    /**
     * Emplacement du cache
     * @type {string}
     */
    var store = './src/Cache/store.json';

    /**
     * Durée d'expiration d'un cache par défaut, 1 jour
     * @type {number}
     */
    var DEFAULT_EXPIRATION = 86400;

    /**
     * Variable statique pour gérer le contenu du store
     */
    if(cache.content == null){
        cache.content = JSON.parse(fs.readFileSync(store,'utf8'));
    }

    /**
     * Charge le contenu du store en écrasant le contenu actuel
     */
    self.load = function () {
        cache.content = JSON.parse(fs.readFileSync(store,'utf8'));
    };

    /**
     * Efface le contenu du store en écrasant le contenu actuel
     */
    self.clear = function () {
        cache.content = {};
    };

    /**
     * Sauvegarde le contenu du store
     * @returns {boolean}
     */
    self.save = function () {
        try{
            fs.writeFileSync(store,JSON.stringify(cache.content),'utf8');
        }catch(e){
            console.log(e);
            return false;
        }
        return true;
    };

    /**
     * Récupère le contenu du store actuellement en mémoire
     * @returns {*}
     */
    self.getContent = function () {
        return cache.content;
    };

    /**
     * Retourne les clés actuellement sauvegardées dans la version du cache en mémoire
     * @returns {Array}
     */
    self.keys = function () {
        return Object.keys(cache.content) || [];
    };

    /**
     * Met à jour une clé du store et la crée si elle n'existe pas
     * @param key
     * @param expiration [politique,valeur] : un tableau contenant 2 valeurs.
     *  à l'indice 0, une lettre définissant la politique de mise à jour
     *      'n' => NONE, => aucune mise à jour du cache n'est requise
     *      'u' => UPDATE, => mise à jour si les fichiers sources sont plus récents que le cache
     *      't' => TIMEELAPSED, => mise à jour si le temps paramétré est écoulé
     *  à l'indice 1,
     *      si 't' à l'indice 0, un nombre de secondes avant la prochaine mise à jour
     * @param sources  [string] : la liste des fichiers à tracker
     * @returns {{}} : l'objet ajouté
     */
    self.set = function (key, expiration, sources) {
        var cacheItem = {};
        var expiration_policy = {};

        if( expiration[0] == 'u') {
            expiration_policy.pk = 'u';
        }
        else if( expiration[0] == 't') {
            expiration_policy.pk = 't';
            expiration_policy.pv = 1000*(expiration[1] || DEFAULT_EXPIRATION);
        }
        else{
            expiration_policy.pk = 'n';
        }
        cacheItem = expiration_policy;
        cacheItem.s = sources;
        cacheItem.d = new Date().getTime();
        cache.content[key] = cacheItem;
        return cacheItem;
    };

    /**
     * récupère un item du cache par sa clé
     * @param key
     * @param callback
     * @returns {*}
     */
    self.get = function (key, callback) {
        var cacheItem = cache.content[key];
        var error = '';

        if(cacheItem == null)
            error = "Item not found";

        if(callback != null){
            callback(error, key, cacheItem);
        }
        return cacheItem;
    };

    /**
     * récupère plusieurs items du cache par leurs clés
     * @param keys
     * @param callback
     * @returns {{}}
     */
    self.mget = function (keys, callback) {
        var values = {};

        for(var i in keys){
            values[keys[i]] = self.get(keys[i],callback);
        }

        return values;
    };

    /**
     * supprime un item du cache par sa clé
     * @param key
     * @param callback
     */
    self.del = function (key, callback) {
        var copy = cache.content[key];
        var error = '';

        if(copy == null)
            error = "Item not found";
        else{
            delete cache.content[key];
        }

        if(callback != null){
            callback(error, key, copy);
        }
    };

    /**
     * Supprime plusieurs items du cache par leurs clés
     * @param keys
     * @param callback
     */
    self.mdel = function (keys, callback) {
        for(var i in keys){
            self.del(keys[i],callback);
        }
    };

    /**
     * Vérifie si l'item pointé par la clé est encore récent
     * @param key
     * @returns {boolean}
     */
    self.isRecent = function (key) {
        var cacheItem = cache.content[key];
        if(cacheItem == undefined)
            return false;

        if(cacheItem.pk == 'u'){
            // comparer la date des fichiers à la date du cache
            var isrecent = true;

            for(var i in cacheItem.s){
                var file = cacheItem.s[i]; // console.log(file);

                var stats = fs.statSync(file);
                var mtime = new Date(util.inspect(stats.mtime)).getTime();

                if(cacheItem.d < mtime)
                    return false;
            }
        }
        else if(cacheItem.pk == 't'){
            if( (cacheItem.d+cacheItem.pv) < (new Date().getTime()) ){
                return false;
            }
        }else{
            // do nothing
        }

        return true;
    };

    /**
     * Evalue la date d'expiration des caches correspondant aux clés données.
     * Si aucune fonction callback n'est fournie, les clés non à jour sont supprimées
     * @param keys [string] : une clé ou un tableau de clés
     * @param callback
     */
    self.evaluate = function (keys, callback) {
         // evalue toutes les clés du cache. Les vieilles clés sont supprimées
        if(Array.isArray(keys)){
            for(var i in keys){
                var isrecent = self.isRecent(keys[i]);

                if(callback != undefined){
                    callback(keys[i], isrecent);
                }
                else{
                    if(isrecent == false)
                        self.del(keys[i]);
                }
            }
        }else{
            var isrecent = self.isRecent(keys);

            if(callback != undefined){
                callback(keys, isrecent);
            }
            else {
                if (isrecent == false)
                    self.del(keys);
            }
        }


    };

    return self;
};


module.exports = cache;