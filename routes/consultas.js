var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Limpeza = require('../models/Limpeza');
var Veiculo = require('../models/Veiculos');
var Registro = require('../models/Registro');
var Devolucao = require('../models/Devolucao');
var Manutencao = require('../models/Manutencao');
var Abastecimento = require('../models/Abastecimento');

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

//GET com listas de serviços
router.get('/veiculos/servicos/:id/:us', requiresLogin, function (req, res, next) {
    
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
        
        if (result == 1) {
                    
            var manu = Manutencao.find({"placa" : req.params.id, "usuarioMatricola":req.params.us})
              .then(function(manu) {    
                Abastecimento.find({"placa" : req.params.id, "usuarioMatricola":req.params.us})
                .then(function(abast) {    
                    Limpeza.find({"placa" : req.params.id, "usuarioMatricola":req.params.us})
                    .then(function(lim) {               
                        res.render('PesquisaViews/servicosRealizados', {Manut: manu, Abaste:abast, Limp:lim, placa:req.params.id});  
                    });
                });
            });

        } else {
            return res.redirect('/home');
        }   
     
    });
       
});

//GET com a tela de usuários habilitados para o veiculo em questão
router.get('/veiculos/manutencao/:id', requiresLogin, function (req, res, next) {
    
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
        
        if (result == 1) {
            Manutencao.find({"placa" : req.params.id})
              .then(function(doc) {    
                res.render('PesquisaViews/detalhesManutencao', {docs: doc , placa :req.params.id});            
            });
  
        } else {
            return res.redirect('/home');
        }   
     
    });
       
});

//GET com a tela de usuários habilitados para o veiculo em questão
router.get('/usuarios/habilitados/paraveicolo/:id', requiresLogin, function (req, res, next) {
    
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
        
        if (result == 1) {
            var Categoria = req.params.id.split(",");
            User.find()
              .then(function(doc) {    
                var aux3 = [];
                var VerificarCategoria = doc.filter(function (docfilter, index, array) {
                    var aux = docfilter.categoria.split(",");
                    var axu2 = aux.filter(function (element, index, array) {      
                        if(Categoria.indexOf(element) != -1){
                            aux3.push(docfilter);
                        }
                    });                    
                    return axu2; 
                });
                res.render('PesquisaViews/usuariosHabilitados', {docs: aux3});
            });
  
        } else {
            return res.redirect('/home');
        }   
     
    });
       
});

// GET com a tela de todos os usuarios habilitados
router.get('/usuarios/habilitados', requiresLogin, function (req, res, next) {
    
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
        
        if (result == 1) {
   
            User.find({'funcao':'Motorista'})
              .then(function(doc) {
				var Categoria = ["Categoria A","Categoria B","Categoria C","Categoria D","Categoria E"];
                var aux3 = [];
                var VerificarCategoria = doc.filter(function (docfilter, index, array) {
                    var aux = docfilter.categoria.split(",");
                    var axu2 = aux.filter(function (element, index, array) {      
                        if(Categoria.indexOf(element) != -1){
							if(aux3.indexOf(docfilter) == -1){
								aux3.push(docfilter);
							}							
                        }
                    });                    
                    return axu2; 
                });				  
                res.render('PesquisaViews/usuariosHabilitados', {docs: aux3});
            });
  
        } else {
            return res.redirect('/home');
        }   
     
    });
       
});

//GET com a tela de veículos em minha responsabilidade
router.get('/veiculos/responsabilidade/minha', requiresLogin, function (req, res, next) {
    
    Veiculo.find({ 'usuarioRespondavel' : req.session.matricula }, function (err, veiculoR) {
        if(typeof veiculoR === 'undefined' || !veiculoR || veiculoR.length == 0){                         
            res.render('PesquisaViews/veiculosNaMinhaResponsabilidade', {MostrarDados : 3, erro : "Voce não está como responsavel de nem um veículo"});
        } else{
            res.render('PesquisaViews/veiculosNaMinhaResponsabilidade', {MostrarDados : 1 ,Veiculo : veiculoR});           
        }                                     
    });
       
});

// GET  com a tela de todos os veiculos disponiveis
router.get('/veiculos/disponiveis', requiresLogin, function (req, res, next) {
    
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
        
        if (result == 1) {
   
            Veiculo.find({"status" : "Disponível"})
              .then(function(docs) {
              res.render('PesquisaViews/veiculosDisponiveis', {docs: docs});
            });
  
        } else {
            return res.redirect('/home');
        }   
     
    });
});
    
// GET  com a tela de todos os veiculos em manutenção  
router.get('/veiculos/manutencao', requiresLogin, function (req, res, next) {
    
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
        
        if (result == 1) {
   
            Veiculo.find({"status" : "Manutenção"})
              .then(function(docs) {
                res.render('PesquisaViews/veiculosEmManutencao', {docs: docs});
            });
  
        } else {
            return res.redirect('/home');
        }   
     
    });
       
});
   
// GET  com a tela de veiculo por matricula do usuario
router.get('/veiculos/porusuario', requiresLogin, function (req, res, next) {
    
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
        
        if (result == 1) {
            res.render('PesquisaViews/veiculosPorUsuario', {MostrarDados : 0});                  
        } else {
            return res.redirect('/home');
        }   
     
    });
       
});
 
 
//POSTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//POST rquisição para localizar veiculo responsavel por um veículo
router.post('/veiculos/porusuario',requiresLogin, function(req, res, next) {	
    
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
    
        if (result == 1) {
           if (req.body.matricula){            
    
            User.find({ 'matricula' : req.body.matricula }, function (err, userR) {    
                if(typeof userR === 'undefined' || !userR || userR.length == 0){                         
                    res.render('PesquisaViews/veiculosPorUsuario', {MostrarDados : 3, erro : "Usuário não localizado"});
                } else{
                    Veiculo.find({ 'usuarioRespondavel' : userR[0].matricula }, function (err, veiculoR) {
                        if(typeof veiculoR === 'undefined' || !veiculoR || veiculoR.length == 0){                         
                            res.render('PesquisaViews/veiculosPorUsuario', {MostrarDados : 3, erro : "Usuário não está responsavel por nem um veículo"});
                        } else{
                            res.render('PesquisaViews/veiculosPorUsuario', {MostrarDados : 1 ,Veiculo : veiculoR, User : userR});                                               
                        }                                     
                    });
                }        
            });
            }      
        } else {
           res.end('Acesso negado');
        }   
    }); 
   
});


module.exports = router;