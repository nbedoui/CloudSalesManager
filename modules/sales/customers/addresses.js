exports.updateAddress = function(req, res){
    var _id = req.params.id;
    var customerId = req.params.custId;
    var data = req.body;
    console.log("**********************************")
    console.log("Update Address _id:"+_id+" - data="+JSON.stringify(data));

    
    app.model.updateSubDocument("CustomerModel", customerId, "addresses._id", _id, data, function(err, doc){
        if(err){
            console.log("Erreur :"+err);
            res.send(500, {error:err});
            console.log("**********************************")
        } else {
            res.redirect("/sales/customerDetails/"+customerId+"/address");
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
    
    //data.customer_owner=req.session.userId;
    app.model.Customer.findById(customerId, function(err, customer){
        if (err){
            console.log("Erreur : "+err);
            res.send(500, {error:err})
        } else 
        {
            customer.addresses.push(data);
            customer.save(function(err){
                if (err){
                    console.log("Erreur : "+err);
                    res.send(500, {error:err})
                } else {
                    res.redirect("/sales/customerDetails/"+customerId+"/address");
                }
            })
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
            customer.save(function(err){
                if (err){
                    console.log("Erreur : "+err);
                    res.send(500, {error:err})
                } else {
                    res.redirect("/sales/customerDetails/"+customerId+"/address");
                }
            })
        }
        
    })

}