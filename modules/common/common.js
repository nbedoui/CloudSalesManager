var express = require('express');
var app = express();
// DB Access
app.model = require('../../models/SalesManagerModels');


exports.params = function(req, res){
	if (req.session.loggedIn){
		res.render(__dirname+'/params.jade');
	} else {
		res.redirect('/login');
	}

};

//TVA
exports.gst = function(req, res){
	if (req.session.loggedIn){
		app.model.getList('Gst', req.session.accountId, -1, -1, function(err, result){
            if(!err){
            	console.log("TVA="+result);
                res.render(__dirname+'/GST/gst.jade', {model:result});
            } else
            {
                console.log("Erreur = "+err);
                res.render('../../views/error', {error:err});
            }
        });
	} else {
		res.redirect('/login');
	}


};

//Insert Document

exports.insertDocument = function(req, res){
	if (req.session.loggedIn){
		var entity =  req.params.entity;
	    var data = req.body;
	    data.account_id=req.session.accountId;
	    console.log("data="+JSON.stringify(data));
	    app.model.insertDocument(entity, data, function(err, record){
	        if(!err){
        	    if (record){
                	console.log("record="+record);
                    res.send(record);
                } else {
                    res.send(404);
                }
            } else {
            	res.send(500, {error:err});
            }
	    });
	} else {
	    res.redirect("/login");
	}
};


//Delete Entity
exports.deleteDocument = function(req, res){
	if (req.session.loggedIn){
		var entity =  req.params.entity;
		console.log("body = "+JSON.stringify(req.body));
	    var id = req.body._id;
	    console.log("Delete "+entity+" id="+id);
        //var obj = eval(entity);
        app.model.deleteDocument(entity, id, function(err, record){
	        if(!err){
        	    res.send(200);
            } else {
            	res.send(500, {error:err});
            }
	    });
    } else {
        res.redirect("/");
    }
}

//Update TVA
exports.updateDocument = function(req, res){
	//Update entity
	if (req.session.loggedIn){
		var entity =  req.params.entity;
	    var id = req.params.id;
	    var data = req.body;

	    app.model.updateDocument(entity, id, data, function(err, record){
	        if(!err){
	        		if (record){
	                    res.send(record);
	                } else {
	                    res.send(404);
	                }
	            } else {
	            	res.send(500, {error:err});
	            }
	        });
	    } else {
	        res.redirect("/login");
	    }


};