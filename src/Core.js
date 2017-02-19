var Router = require('./Routing/Router');
var Constantes = require('./Constantes'); 
var Auth = require('./Auth/Auth')(Constantes); 

var Core = function(Application){
	var self = {};

	if(typeof Core.config == 'undefined'){
		Core.config = {
			db:null
		};
	}

	self.setDB = function (value) {		
		Core.config.db = Constantes.DB[value]; 
	};
	self.getDB = function () {		
		return Core.config.db;
	}

	self.run = function (argument) { 
		//Authorization 
		//-------------------------------------------------------------------------
		Application.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
    		res.header("Access-Control-Allow-Headers", "X-Requested-With");
    		next();
    	});

		//Authentification
		//-------------------------------------------------------------------------
		if(Application) 
			Application.use(Auth.authentify);
		
		//Route 
		//-------------------------------------------------------------------------
		if(Application) {
			Application.use('/', Router);
			Application.use(Constantes.API_RESTPATH, Router);
		}

		//404 : catch 404 and forward to error handler
		//------------------------------------------------------------------------- 
		if(Application) 
		Application.use(function(req, res, next) {
			var err = new Error('Route Not Found');
			err.status = 404;
			next(err);
		});

		// error handler
		//-------------------------------------------------------------------------
		if(Application) 
		Application.use(function(err, req, res, next) {
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// render the error page
			res.status(err.status || 500);
			res.json({'error':err.message});
		});

	} 

	return self;
};

module.exports = Core;