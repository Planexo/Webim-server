var Constantes = (function () {
	
	var self = {};

	//Security
	self.API_KEY = "kjlsd4568dfsds564zz";
	self.API_RESTPATH = '/b2w';

	//DB
	self.DB = {
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

	//IFC 



	return self;
})();

module.exports = Constantes;