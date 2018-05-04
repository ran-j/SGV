var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Veiculo = require('../models/Veiculos');
var Registro = require('../models/Registro');
var Devolucao = require('../models/Devolucao');

//Função para verificar se o usuário está logado
function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      res.render('IndexViews/login', {msg: "Voce precisa estar logado para visualizar esta pagina"});  
    }
}
  
//GET com a tela para requisitar adquirir um veiculo
router.get('/adquiri',requiresLogin, function (req, res, next) {
    res.render('AdquirirViews/adquirirveiculo', {MostrarDados: 2});
});

//GET com a tela para devolver adquirir um veiculo
router.get('/devolver',requiresLogin, function (req, res, next) {
    Veiculo.find({ 'usuarioRespondavel' : req.session.matricula }, function (err, veiculoR) {
        if(typeof veiculoR === 'undefined' || !veiculoR || veiculoR.length == 0){                         
            res.render('DevolverViews/DevolverVeiculo', {MostrarDados : 3, erro : "Voce não está como responsavel de nem um veículo"});
        } else{ 
            res.render('DevolverViews/DevolverVeiculo', {MostrarDados : 1 ,Veiculo : veiculoR});
        }                                     
    });
});

//GET para redirecionar para redirecionar tela para /veiculos/adquiri pois a rota /veiculo e um POST
router.get('/veiculo',requiresLogin, function (req, res, next) {
    res.redirect('/veiculos/adquiri');
});

//POSTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

 //POST para mostrar informaçõe do veiculo
router.post('/veiculo',requiresLogin, function(req, res, next) {	
 
    if (req.body.placa){            

        Veiculo.find({ 'placa' : req.body.placa}, function (err, veiculoR) {
            if(typeof veiculoR === 'undefined' || !veiculoR || veiculoR.length == 0){                         
                res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 3, erro : "Veículo não localizado"});
            } else{                    
                if(veiculoR[0].usuarioRespondavel != 'Ninguém'){
                    res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 3, erro : "Veículo está sobre a responsabilidade de outro usuário"});
                }else{
                    if(veiculoR[0].status != 'Disponível'){                        
                        res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 3, erro : "Veículo não está disponível"});
                    }else{
                        res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 1 ,Veiculo : veiculoR}); 
                    }                                   
                }                                                
            }                                     
        });

    }else{
		res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 3, erro : "Favor informar a placa"});
	}

});

//POST requisição para adquirir um veículo
router.post('/adquiri',requiresLogin, function (req, res, next) {
    if (req.body.placa && req.body.quilometragem && req.body.niveldeTanque){  
       
        User.findById(req.session.userId)
        .exec(function (error, CurrentUser) {
          if (error) {
            console.log(err);
        }else {
            var categoaria = CurrentUser.categoria.split(",");
            Veiculo.find({ 'placa' : req.body.placa, 'status' : 'Disponível'}, function (err, veiculoR) {
                if(typeof veiculoR === 'undefined' || !veiculoR || veiculoR.length == 0){                         
                    res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 3, erro : "Veículo não localizado ou não está disponivel"});
                } else{    
                        var veiculoRCategoria = veiculoR[0].categoriaDeCNH.split(",");                         
    
                        var VerificarCategoria = veiculoRCategoria.filter(function (element, index, array) {
                            if(categoaria.indexOf(element) == 0)
                                return 1;
                        });
    
                        if(VerificarCategoria.length == 1){
                            var RegistroData = {
                                dataInicial: new Date().toLocaleDateString("pt-BR"),
                                quilometragem: req.body.quilometragem,
                                nivelDeTanque: req.body.niveldeTanque,
                                usuarioRespondaveID: req.session.matricula,
                                veiculoPlaca: req.body.placa,
                                status: "Ativo",
                            }
        
                            Registro.create(RegistroData, function (error, user) {
                                if (error) {                
                                    console.log(error);
                                    res.end('Erro interno ao realizar o cadastro');
                                } else {                             
        
                                    Veiculo.findById(veiculoR[0]._id, function(err, doc) {
                                        if (err) {
                                          console.error('error, no entry found');
                                        }
                                        doc.usuarioRespondavel = req.session.matricula;     
                                        doc.save();
                                    })
                                    res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 4 ,erro : "Veículo adquirido"});
                                }
                            });
                        }else{
                            res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 3, erro : "Voce não possui categoaria para adquirir este veículo"});
                        }
                                                                    
                }                                     
            });
        }   
        });
    }else{
        res.render('AdquirirViews/AdquirirVeiculo', {MostrarDados : 3 ,erro : "Favor informa todos os campos"});
    }
});

//POST requisição para devolver um veículo
router.post('/devolver',requiresLogin, function (req, res, next) {
    if (req.body.placa && req.body.quilometragem && req.body.niveldeTanque && req.body.data  && req.body.notasentreges){  

        Veiculo.find({ 'placa' : req.body.placa}, function (err, veiculoR) {
            if(typeof veiculoR === 'undefined' || !veiculoR || veiculoR.length == 0){                         
                res.render('DevolverViews/DevolverVeiculo', {MostrarDados : 3, erro : "Veículo não localizado ou não está disponivel"});
            } else{
                    Veiculo.findById(veiculoR[0]._id, function(err, doc) {
                        if (err) {
                          console.error('error, no entry found');
                        }
                        doc.usuarioRespondavel = "Ninguém";     
                        doc.save();
                    })
                    Registro.find({ 'usuarioRespondaveID' : req.session.matricula, 'veiculoPlaca' : req.body.placa , 'status' : 'Ativo'}, function (err,registroR) {
                        if (err) {
                            console.error('error, no entry found');
                        }
                        registroR[0].status = 'Desativado';
                        registroR[0].save();

                        var DevolucaoData = {
                            placa: req.body.placa,
                            data: req.body.data,                            
                            nivelDeTanque: req.body.niveldeTanque,
                            quilometragem: req.body.quilometragem,
                            entregouNotas: req.body.notasentreges,
                            usuarioID: req.session.matricula,
                        }

                        Devolucao.create(DevolucaoData, function (error, user) {
                            if (error) {
                              return next(error);
                              console.log(error);
                            } else {
                                res.render('DevolverViews/DevolverVeiculo', {MostrarDados : 4, erro : "Veículo devolvido"});   
                            }
                        });
                                                                         
                    });
                }                                                
            
        });
    }else{
        res.render('DevolverViews/DevolverVeiculo', {MostrarDados : 3 ,erro : "Favor preencher todos os campos"});
    }
});

module.exports = router;