var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Limpeza = require('../models/Limpeza');
var Veiculo = require('../models/Veiculos');
var Registro = require('../models/Registro');
var Devolucao = require('../models/Devolucao');
var Manutencao = require('../models/Manutencao');
var Abastecimento = require('../models/Abastecimento');

var doc = "";

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

//GET para redirecionar o usuário que tentar dar GET no POST
router.get('/ordem',requiresLogin, function (req, res, next) {    
  res.redirect('/consultas/veiculos/responsabilidade/minha');  
});

//GET com a tela para castro de ordem de serviço
router.get('/ordem/:id',requiresLogin, function (req, res, next) {    
  res.render('CadastroViews/cadastroDeOrdem', {msg: req.params.id,MostrarDados: 1});   
});

// GET rota para cadastro de usuário
router.get('/usuarios', requiresLogin, function (req, res, next) {
  
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
  
      if (result == 1) {
        res.render('CadastroViews/cadastroDeUsuario', {msg: doc});     
      } else {
        return res.redirect('/home');
      }   
  
    });
});
  
// GET rota para cadastro de veiculos
router.get('/veiculos', requiresLogin, function (req, res, next) {
  
    User.userhaspermission(req.session.userId, function (error, result,RUser) {
      
        if (result == 1) {
           res.render('CadastroViews/cadastroDeVeiculos', {msg: doc});    
        } else {
           return res.redirect('/home');
        }   
      
    });
     
});

//POSTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//POST requisição para cadastro de veiculos
router.post('/veiculos',requiresLogin, function(req, res, next) {	
  
    User.userhaspermission(req.session.userId, function (error, result) {
      if (result == 1) {
        
        if (req.body.placa &&
          req.body.marca &&
          req.body.tipo &&
          req.body.categoriaDeCNH &&
          req.body.status &&
          req.body.quilometragem &&
          req.body.combustivel) {
  
          var VeiculoData = {
            placa: req.body.placa,
            marca: req.body.marca,
            tipo: req.body.tipo,
            categoriaDeCNH: req.body.categoriaDeCNH,
            status: req.body.status,
            quilometragem: req.body.quilometragem,
            combustivel: req.body.combustivel,
            usuarioRespondavel: "Ninguém",
          }
  
          Veiculo.create(VeiculoData, function (error, user) {
            if (error) {
              return next(error);
              console.log(error);
            } else {
              res.end("Cadastro realizado com sucesso");
            }
            
          });
          
        } else {
          res.end('Favor preencher todos os campos');
        }
              
      } else {
        res.end('Acesso negado');
      }
  
    }); 
  
});
  
//POST requisição para cadastro de usuarios
router.post('/usuarios',requiresLogin, function(req, res, next) {	
     
    User.userhaspermission(req.session.userId, function (error, result) {
      if (result == 1) {
        
          if (req.body.nome &&
              req.body.dataDeNascimento &&
              req.body.funcao &&
              req.body.categoria &&
              req.body.perfil &&
              req.body.password) {
        
              console.log("Realizando cadastro de usuário");
        
              var userData = {
                matricula: Math.floor(Math.random() * 9000000) + 1000000,
                nome: req.body.nome,
                dataDeNascimento: req.body.dataDeNascimento,
                funcao: req.body.funcao,
                categoria: req.body.categoria,
                perfil: req.body.perfil,
                password: req.body.password,
              }
        
              User.create(userData, function (error, user) {
                  if (error) {                  
                    if(error.code == 11000){
                      res.end('Matícula já está em uso');
                    }else{
                      console.log(error);
                      res.end('Erro interno ao realizar o cadastro');
                    }                  
                  } else {                  
                    res.end('Cadastro realizado com sucesso');                     
                  }
              });
  
              } else {
                res.end('Favor preencher todos os campos');
              }
              
      } else {
        res.end('Acesso negado');
      }
  
    }); 
    
});


//POST requisição para cadastro de ordem
router.post('/ordem',requiresLogin, function(req, res, next) {	
        
  if (req.body.Identificador){
      if(req.body.Identificador == 1){
          if(req.body.placa && req.body.data && req.body.valor && req.body.litros){

            var AbastecimentoData = {
              placa: req.body.placa,
              data: req.body.data,
              Valor: req.body.valor,
              litros: req.body.litros,
              usuarioMatricola: req.session.matricula,
            }

            Abastecimento.create(AbastecimentoData, function (error, user) {
              if (error) {                  
                console.log(error);
                res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 3, Retorno: "Erro interno ao realizar o cadastro"});                   
              } else {                  
                res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 4, Retorno: "Cadastro de Abastecimento realizado com sucesso"});                    
              }
            });
          }else{
            res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 3, Retorno: "Favor preencher todos os campos"}); 
          }
      }else if(req.body.Identificador == 2){
        if(req.body.placa && req.body.data && req.body.valor){
           
          var LimpezaData = {
            placa: req.body.placa,
            data: req.body.data,
            valor: req.body.valor,
            usuarioMatricola: req.session.matricula,
          }
          
          Limpeza.create(LimpezaData, function (error, user) {
            if (error) {                  
              console.log(error);
              res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 3, Retorno: "Erro interno ao realizar o cadastro"});                   
            } else {                  
              res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 4, Retorno: "Cadastro de limpeza realizado com sucesso"});                    
            }
          });

        }else{
          res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 3, Retorno: "Favor preencher todos os campos"}); 
        }

      }else if(req.body.Identificador == 3){
        if(req.body.placa && req.body.data && req.body.valor && req.body.detalhes && req.body.tipo && req.body.previsao){

          var ManutencaoData = {
            placa: req.body.placa,
            data: req.body.data,
            valor: req.body.valor,
            detalhes: req.body.detalhes,
            tipo: req.body.tipo,
            dataprevista: req.body.previsao,
            usuarioMatricola: req.session.matricula,
          }

          Manutencao.create(ManutencaoData, function (error, user) {
            if (error) {                  
              console.log(error);
              res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 3, Retorno: "Erro interno ao realizar o cadastro"});                   
            } else { 
              Veiculo.find({"placa" : req.body.placa})
              .then(function(doc) {     
                Veiculo.findById(doc[0]._id, function(err, doc) {
                  if (err) {
                    console.error('error, no entry found');
                  }
                  doc.status = "Manutenção";     
                  doc.save();
                });
              });              

              res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 4, Retorno: "Cadastro de manutenção realizado com sucesso"});                    
            }
          });

        }else{
          res.render('CadastroViews/cadastroDeOrdem', {msg: req.body.placa, MostrarDados: 3, Retorno: "Favor preencher todos os campos"}); 
        }

      }
  }

      
                    
});

module.exports = router;
