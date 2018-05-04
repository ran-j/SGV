var mongoose = require('mongoose');

var DevolucaoDataSchema = new mongoose.Schema({  
	placa: {
		type: String,
		required: true,
	},
    data: {
		type: String,
		required: true,
	},
	nivelDeTanque: {
		type: String,
		required: true,
	},
	quilometragem: {
		type: String,
		required: true,
	},
	entregouNotas: {
		type: String,
		required: true,
	},
	usuarioID: {
		type: String,
		required: true,
	},
}, {collection: 'Devolucao'});  
   
var Registro = mongoose.model('DevolucaoData', DevolucaoDataSchema); 

module.exports = Registro;