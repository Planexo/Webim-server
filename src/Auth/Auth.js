'use strict';
/**
sources 
https://stackoverflow.com/questions/319530/restful-authentication
- json web token(jwt) : http://blog.inovia-conseil.fr/?p=236
- api authentification : https://la-cascade.io/api-authentification/
*/
/**
 * Classe gérant l'authentification des requêtes
 * @param Constantes : la classe de configuration
 * @returns {{}}
 * @constructor
 */
var Auth = function(Constantes){ 
	
	var self = {};

    /**
     * Les types d'authentification possibles.
     * @type {{NONE, HTTP, COOKIES, OAUTH2, QUERY, APIKEY}}
     */
	self.kind = {
        NONE: 0,
        HTTP : 1,
        COOKIES : 2,
        OAUTH2 : 3,
        QUERY : 4,
        APIKEY : 5
    };

	//cette valeur est modifiable

    /**
     * Method d'authentification, par défaut aucune
     * @type {*}
     */
    self.method = self.kind.NONE;

    /**
     * Variable d'authentification
     */
    if(typeof Auth.authentified == 'undefined'){
		Auth.authentified = {
			is:false,
			method: self.method,
			data:null
		};
	}

    /**
     * Vérifie si la dernière requête a été authentifiée en consultant l'état de 'Auth.authentified'
     * @returns {{is: boolean, method: *, data: null}|*}
     */
    self.isAuthentified = function(){
        return Auth.authentified;
    };

    /**
     * Permet d'authentifier une requete
     * @param req
     * @param res
     * @param next
     */
	self.authentify = function (req, res, next){
	    console.log("TRYING TO AUTH");
	    console.log(req.headers);

	    //Le text à renvoyer en cas d'échec d'authentification
		var reason = {text:''};

		//initialisation de la variable d'authentification
		Auth.authentified.is = false; 
		Auth.authentified.method = self.method;

		switch (self.method) {
			case self.kind.HTTP:
				http(req,res,reason);				
				break;
			case self.kind.COOKIES:
				cookies(req,res,reason);
				break;
			case self.kind.OAUTH2:
				oauth2(req,res,reason);
				break;
			case self.kind.QUERY:
				query(req,res,reason); 
				break;
			case self.kind.APIKEY:
				apikey(req,res,reason);  console.log("WITH APIKEY");
				break;
			default: 
				Auth.authentified.is = true; 
				break;
		}
        console.log(Auth.authentified);
        console.log(reason.text);

		if(Auth.authentified.is){  	
			next();
		}else{
			try {
				res.status(401) ;
				res.json({error:"The authentification failed : "+reason.text});
			} catch(e) {
				//pour les tests
				res.status = 401 ; 
			}			
		}
	};

    /**
     * Authentification par la méthode 'basic http'
     * @param req
     * @param res
     * @param reason
     */
	var http = function (req,res,reason) {
		// Récupération du header Authorization 
		// Création d'un token en partant des données de l'utilisateur
		// comparaison entre le token et le header
		Auth.authentified.is = true;
		//console.log("Authentified with http")
	};

    /**
     * Authentification par la méthode 'cookies'
     * @param req
     * @param res
     * @param reason
     */
	var cookies = function (req,res,reason) {
		Auth.authentified.is = true;
		//console.log("Authentified with cookies")
	};

    /**
     * Authentification par la méthode 'oauth2'
     * @param req
     * @param res
     * @param reason
     */
	var oauth2 = function (req,res,reason) {
		Auth.authentified.is = true;
		//console.log("Authentified with oauth2 and apikey : "+Constantes.api.key);
	};

    /**
     * Authentification par la méthode 'query'
     * @param req
     * @param res
     * @param reason
     */
	var query = function (req,res,reason) {
		Auth.authentified.is = true;
		//console.log("Authentified with query")
	};

    /**
     * Authentification par clé
     * @param req
     * @param res
     * @param reason
     */
	var apikey = function (req,res,reason) {
		if(typeof req.headers.apikey == 'undefined'){ console.log(req.headers.apikey);
			reason.text = "The header 'apikey' is missing";
			return;
		}

		if(req.headers.apikey != Constantes.api.key){
			reason.text = "The value expected for the header 'apikey' is not correct";
			return;
		}

		Auth.authentified.is = true;
		Auth.authentified.data = {
			apikey:req.headers.apikey
		};
		console.log("Authentified with apikey")
	};

	return self;

};
 
module.exports = Auth; 