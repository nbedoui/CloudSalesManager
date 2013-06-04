
var express = require('express');
var app = express();

// DB Access
app.model = require('../../models/SalesManagerModels');

exports.index = function(req, res){
	
    if (req.session.loggedIn){
        //console.log('Appel de la page principale..')
        app.model.getModuleList(req.session.accountId, function(err, moduleList){
            console.log("moduleList="+moduleList);
        res.render(__dirname+'/home.jade', {moduleList:moduleList});
         });
    } else {
        res.redirect('/login');
    }
    
};