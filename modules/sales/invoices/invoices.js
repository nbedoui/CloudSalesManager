var express = require('express');
var app = express();
var async = require("async");
// DB Access
app.model = require('../../../models/SalesManagerModels');


exports.index = function(req, res){
	if (req.session.loggedIn){
		res.render(__dirname+'/invoices.jade');
	} else {
		res.redirect('/login');
	}

}