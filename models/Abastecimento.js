var mongoose = require('mongoose');

var AbastecimentoDataSchema = new mongoose.Schema({  
	placa: {
		type: String,
		required: true,
	},
    data: {
		type: String,
		required: true,
	},
	Valor: {
		type: String,
		required: true,
	},
	litros: {
		type: String,
		required: true,
	},
	usuarioMatricola: {
		type: String,
		required: true,
	},
}, {collection: 'Abastecimento'});  
   
var Registro = mongoose.model('AbastecimentoData', AbastecimentoDataSchema); 

module.exports = Registro;