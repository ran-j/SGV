var mongoose = require('mongoose');

var LimpezaDataSchema = new mongoose.Schema({  
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
	usuarioMatricola: {
		type: String,
		required: true,
	},
}, {collection: 'Limpeza'});  
   
var Registro = mongoose.model('LimpezaData', LimpezaDataSchema); 

module.exports = Registro;