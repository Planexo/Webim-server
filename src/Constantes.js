/**
 * Cette fonction anonyme contient toutes les constantes de l'application
 */
var Constantes = (function () {
	
	var self = {};

    /**
     * Constantes relatives à l'api
     * @type {{key, path}}
     */
	self.api = {
        key : "kjlsd4568dfsds564zz",
        path : '/b2w_1'
    };

    /**
     * Chemins
     * @type {{}}
     */
    self.paths = {
        data : './data/'
    };

    /**
     * Constantes relatives à la base de données
     * @type {{dev: {engine: string, host: string, name: string, user: string, pass: string}, prod: {engine: string, host: string, name: string, user: string, pass: string}}}
     */
	var DB = {
		dev:{
			engine:'mysql',
			host:'localhost',
			name:'dbtest',
			user:'',
			pass:''
		},
		prod:{
			engine:'mysql',
			host:'md-vps15-03',
			name:'blixitdb',
			user:'blixitdb',
			pass:''
		}
	};

    /**
     * fonction permettant de récupérer les constantes relatives à la base de données
     */
    self.db = (function (env) {
        return DB[env];
    })();

	return self;
})();

module.exports = Constantes;