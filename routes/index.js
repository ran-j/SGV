var express = require('express');
var router = express.Router();

//"tabelas" no bando de dados
var User = require('../models/User');
var Limpeza = require('../models/Limpeza');
var Veiculo = require('../models/Veiculos');
var Registro = require('../models/Registro');
var Devolucao = require('../models/Devolucao');
var Manutencao = require('../models/Manutencao');
var Abastecimento = require('../models/Abastecimento');

var doc = "";

router.get('/popularbd', function (req, res, next) {
  var userData = {
    matricula: "660684",
    nome: "Ranieri Abreu Silva Junior",
    dataDeNascimento: "07/07/1995",
    funcao: "Gerente",
    categoria: "Gerente",
    perfil: "Gerente",
    password: "123",
  }

  var userData2 = {
    matricula: "660685",
    nome: "Ameliana da Silva Ferreira",
    dataDeNascimento: "03/12/1994",
    funcao: "Motorista",
    categoria: "Categoria B,Categoria C",
    perfil: "Atendente",
    password: "123",
  }
  
  User.create(userData2, function (error, user) {
    if (error) {
    return next(error);
    } else {
     console.log("foi");
    }
  });

  User.create(userData, function (error, user) {
    if (error) {
    return next(error);
    } else {
     console.log("foi");
    }
  });

  var VeiculoData = {
    placa: "DYC4050",
    marca: "Ford",
    tipo: "Carro",
    categoriaDeCNH: "Categoria B",
    status: "Disponível",
    quilometragem: "84000",
    combustivel: "Cheio",
    usuarioRespondavel: "Ninguém",
  }

  Veiculo.create(VeiculoData, function (error, user) {
    if (error) {
    return next(error);
    } else {
    return res.redirect('/');
    }
  });

});

//Verifica se o usuário está logado
function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    res.render('IndexViews/login', {msg: "Voce precisa está logado para visualizar esta página"});  
  }
}

// GET rota inicial
router.get('/', function (req, res, next) {
  if (req.session && req.session.userId) {
    res.redirect('/home');
  }else{
    res.render('IndexViews/login', {msg: doc});
  }  
});

// GET rota inicio depois de logado
router.get('/home', requiresLogin, function (req, res, next) {

  User.userhaspermission(req.session.userId, function (error, result,RUser) {
    try {
      var UserName = RUser.nome.split(" "); 
    }catch (e) {
      UserName =""
      console.log(e); // passa o objeto de exceção para o manipulador de erro
    }
       
    if (result == 1) {
      res.render('IndexViews/IndexAdmin',{msg: UserName[0]});      
    } else {
      res.render('IndexViews/IndexNormal',{msg: UserName[0]});
    }   
  });

});

router.get('/trocasenha', requiresLogin, function (req, res, next) {

    User.userhaspermission(req.session.userId, function (error, result,RUser) {

      if (result == 1) {
        res.render('trocasenha',{msg: doc, MostrarDados : 1});      
      } else {
        res.render('trocasenha',{msg: doc, MostrarDados : 1});
      }   
    });
  
  });
  

router.get('/logout',requiresLogin, function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

//POST de login
router.post('/', function (req, res, next) {  
  if (req.body.matricula && req.body.logpassword) {	  

    User.authenticate(req.body.matricula, req.body.logpassword, function (error, user) {
      if (error || !user) {
        res.render('IndexViews/login', {msg: "Senha ou matrícula incorreta"});
      } else {
        req.session.userId = user._id;
        req.session.matricula = user.matricula;
        return res.redirect('/home');
      }
    });   
   
  } else {
    console.log(req.body.matricula);
    res.render('IndexViews/login', {msg: "Favor preencher todos os campos"});
  }
  
})

//POST de troca de senha
router.post('/trocasenha',requiresLogin, function (req, res, next) {  
  if (req.body.pwdAntiga && req.body.pwdNova && req.body.ConfirmapwdNova) {	  

    if(req.body.pwdNova == req.body.ConfirmapwdNova){
      User.changepwd(req.session.userId, req.body.ConfirmapwdNova, function (error, userR) {
        if (userR != 1) {
          res.render('trocasenha', {msg: "Erro ao realizar troca de senha", MostrarDados : 3});
        } else {
          res.render('trocasenha', {msg: "Troca de senha realizada com sucesso", MostrarDados : 4});
        }
      });   
    }else{
      res.render('trocasenha', {msg: "As senhas devem ser iguais", MostrarDados : 3});
    } 
   
  } else {
    console.log(req.body.matricula);
    res.render('trocasenha', {msg: "Favor preencher todos os campos", MostrarDados : 3});
  }
  
})

module.exports = router;