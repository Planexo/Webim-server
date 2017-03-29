'use strict';

var cors = require('cors');

var Router = require('./Routing/Router');
var Constantes = require('./Constantes'); 
var Auth = require('./Auth/Auth')(Constantes);
var Cache = require('./Cache/Cache');

/**
 * Cette classe est le coeur de l'application.
 * @param Application : l'application utilisée, ici c'est le module express
 * @returns {{}}
 * @constructor
 */
var Core = function(Application){
	var self = {};

    /**
     * Cette fonction enregistre tous nos middlewares (auth, router, ...) dans l'appication
     * @returns {boolean}
     */
	self.run = function () {
        /**
		 * Au lancement de l'application, on supprime le cache
         */
		var cache = new Cache();
		cache.clear();
		cache.save();

        /**
         * Authorization
         * Ce middleware indique à express qu'on accepte les CORS (Cross Origin Request)
         */
		Application.use(cors());

        /**
         * Authentification
         * Toutes les requetes passent par notre module d'authentification
         */
        Auth.method = Auth.kind.APIKEY;
		Application.use(Auth.authentify);

        /**
         * Route
         * Seules les routes commençant par '/' ou par la valeur de  API_RESTPATH sont acceptées par notre router
         */
		Application.use('/', Router);
		Application.use(Constantes.api.path, Router);

        /**
         * 404 : catch 404 and forward to error handler
         * Les routes qui ne sont pas acceptées, atterissent ici
         */
		Application.use(function(req, res, next) {
			var err = new Error('Route Not Found');
			err.status = 404;
			next(err);
		});

        /**
         * error handler
         * En cas d'erreur, ce middleware s'exécute
         */
		Application.use(function(err, req, res, next) {
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};
console.log(err);
			// render the error page
			res.status(err.status || 500);
			res.json({'error':err.message});
		});

		//pour faciliter le test de la fonction, on renvoie true si tous les middlewares ont été ajoutés
		return true;
	} 

	return self;
};

module.exports = Core;