var mongoose = require('mongoose');

var ManutencaoDataSchema = new mongoose.Schema({  
	placa: {
		type: String,
		required: true,
	},
  	data: {
		type: String,
		required: true,
	},
	valor: {
		type: String,
		required: true,
	},
	detalhes: {
			type: String,
			required: true,
	},
	tipo: {
			type: String,
			required: true,
	},
	dataprevista: {
			type: String,
			required: true,
	},
	usuarioMatricola: {
		type: String,
		required: true,
	},
}, {collection: 'Manutencao'});  
   
var Registro = mongoose.model('ManutencaoData', ManutencaoDataSchema); 

module.exports = Registro;