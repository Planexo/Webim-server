'use strict';
/**
sources 
https://stackoverflow.com/questions/319530/restful-authentication
- json web token(jwt) : http://blog.inovia-conseil.fr/?p=236
- api authentification : https://la-cascade.io/api-authentification/
*/
var Auth = function(Constantes){ 
	
	var self = {};

	Auth.kind = {
		NONE: 0,
		HTTP : 1,
		COOKIES : 2,
		OAUTH2 : 3,
		QUERY : 4,

	}

	//cette valeur est modifiable
	self.method = Auth.kind.NONE;

	if(typeof Auth.authentified == 'undefined'){
		Auth.authentified = {
			is:false,
			method: self.method,
			data:null
		};
	}

	self.authentify = function (req, res, next){

		let reason = {text:''};

		Auth.authentified.is = false; 
		Auth.authentified.method = self.method;

		switch (self.method) {
			case Auth.kind.HTTP:
				http(req,res,reason);				
				break;
			case Auth.kind.COOKIES:
				cookies(req,res,reason);
				break;
			case Auth.kind.OAUTH2:
				oauth2(req,res,reason);
				break;
			case Auth.kind.QUERY:
				query(req,res,reason); 
				break;
			default: 
				Auth.authentified.is = true; 
				break;
		}
		 
		if(Auth.authentified.is){			
			next();
		}else{
			res.status(401) ;
  			res.json({error:"The authentification failed : "+reason.text});
		}
	}

	self.isAuthentified = function(){
		return Auth.authentified;
	}

	var http = function (req,res,reason) {
		// Récupération du header Authorization 
		// Création d'un token en partant des données de l'utilisateur
		// comparaison entre le token et le header
		Auth.authentified.is = true;
		//console.log("Authentified with http")
	};

	var cookies = function (req,res,reason) {
		Auth.authentified.is = true;
		//console.log("Authentified with cookies")
	};

	var oauth2 = function (req,res,reason) {
		if(typeof req.headers.apikey == 'undefined'){
			reason.text = "The header 'apikey' is missing";
			return;
		}

		if(req.headers.apikey != Constantes.API_KEY){
			reason.text = "The value expected for the header 'apikey' is not correct";
			return;
		}

		Auth.authentified.is = true;
		Auth.authentified.data = {
			apikey:req.headers.apikey
		};

		//console.log("Authentified with oauth2 and apikey : "+Constantes.API_KEY);
	};

	var query = function (req,res,reason) {
		Auth.authentified.is = true;
		//console.log("Authentified with query")
	};

	return self;

};

module.exports = Auth;