var express = require('express');
var app = express();
var async = require("async");
// DB Access
app.model = require('../../../models/SalesManagerModels');


exports.index = function(req, res){
	if (req.session.loggedIn){
		res.render(__dirname+'/quotations.jade');
	} else {
		res.redirect('/login');
	}

}

exports.newProducst = function(req, res){
    if (req.session.loggedIn){
        res.render(__dirname+'/quotation.jade');
    } else {
        res.redirect('/login');
    }

}

exports.productList = function(req, res){
    if (req.session.loggedIn){
        console.log("accountid="+req.session.accountId);
        
        res.send([{"code":"code1", "product":"product1"}, {"code":"code2", "product":"product2"}, {"code":"code3", "product":"product3"}, {"code":"code4", "product":"product4"}])
        /*
        app.model.getQuotations(req.session.accountId, null, null, function(err, result){
            if(!err){
                //console.log(result);
                res.send(result);
            } else
            {
                console.log("Erreur = "+err);
                res.render('../../views/error', {error:err});
            }
        });
        */

    } else {
        res.redirect('/login');
    }
}
    