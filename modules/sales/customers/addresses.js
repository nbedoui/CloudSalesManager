var express = require('express');
var app = express();
var async = require("async");
// DB Access
app.model = require('../../../models/SalesManagerModels');

/*
exports.getAddressByCustomerId = function(req, res){
    if (req.session.loggedIn){
        var customerId = req.body.custId;
        var addressType = req.body.addressType;
        console.log("**********************************")
        console.log("Get address customerId:"+customerId+" - addressType="+addressType);

        
        app.model.getSubDocument("Customer", customerId, "addresses", "addressType", addressType, function(err, doc){
                                
            if(err){
                console.log("Erreur :"+err);
                res.send(500, {error:err});
                console.log("**********************************")
            } else {
                console.log("address = "+ doc);
                res.send(doc);
                console.log("**********************************")
            }
        });
        
    } else {
        res.redirect("/login");
    }

}
*/
exports.updateAddress = function(req, res){
    var _id = req.params.id;
    var customerId = req.params.custId;
    var data = req.body;
    console.log("**********************************")
    console.log("Update Address _id:"+_id+"- data="+JSON.stringify(data));
    app.model.updateDocument("Address", _id, data, function(err, doc){
        if(err){
            console.log("Erreur :"+err);
            res.send(500, {error:err});
            console.log("**********************************")
        } else {
            res.redirect("/sales/customerInfos/"+customerId);
            console.log("**********************************")
        }
    });
}


exports.insertAddress = function(req, res){

    var customerId = req.params.custId;
    var data = req.body;
    console.log("**********************************")
    console.log("Insert Address customer_id:"+customerId+" - data="+JSON.stringify(data));
    //data.account_id=req.session.accountId;
    app.model.insertDocument("Address", data, function(err, address){
        if(err){
            console.log("Erreur :"+err);
            res.send(500, {error:err});
        } else {
            app.model.Customer.update({_id:customerId}, {"$push":{addresses:address._id}}, function(err, numberAffected, raw){
                if(err){
                    console.log("Erreur :"+err);
                    res.send(500, {error:err});
                } else {
                    res.redirect("/sales/customerInfos/"+customerId);
                }
            });
        }
    });
    
}

exports.deleteAddress = function(req, res){

    var _id = req.params.id;
    var customerId = req.params.custId;
    console.log("**********************************")
    console.log("Delete Address customer_id:"+customerId);
    
    app.model.Customer.findById(customerId, function(err, customer){
        if (err){
            console.log("Erreur : "+err);
            res.send(500, {error:err})
        } else 
        {
            customer.addresses.pull(_id);
            app.model.deleteDocument("Address", _id, function(err){
                if (err){
                    console.log("Erreur : "+err);
                    res.send(500, {error:err})
                } else 
                {
                    customer.save(function(err){
                        if (err){
                            console.log("Erreur : "+err);
                            res.send(500, {error:err})
                        } else {
                            res.redirect("/sales/customerInfos/"+customerId);
                        }
                    })
                }
            });
        }
        
    });

}