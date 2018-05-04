var mongoose = require('mongoose');

var VeiculoDataSchema = new mongoose.Schema({  
    placa: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
    marca: {
		type: String,
		required: true,
	},
	tipo: {
		type: String,
		required: true,
	},
	categoriaDeCNH: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	quilometragem: {
		type: String,
		required: true,
	},
	combustivel: {
		type: String,
		required: true,
	},
	usuarioRespondavel: {
		type: String,
		required: true,
	},
}, {collection: 'Veiculo'});  
   
var Veiculo = mongoose.model('VeiculoData', VeiculoDataSchema); 

module.exports = Veiculo;