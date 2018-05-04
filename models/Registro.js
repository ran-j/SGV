var mongoose = require('mongoose');

var RegistroDataSchema = new mongoose.Schema({   
    dataInicial: {
		type: String,
		required: true,
	},
	quilometragem: {
		type: String,
		required: true,
	},
	nivelDeTanque: {
		type: String,
		required: true,
	},
	usuarioRespondaveID: {
		type: String,
		required: true,
	},
	veiculoPlaca: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
}, {collection: 'Registro'});  
   
var Registro = mongoose.model('RegistroData', RegistroDataSchema); 

module.exports = Registro;