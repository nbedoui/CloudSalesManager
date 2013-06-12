/**
 * Created with IntelliJ IDEA.
 * User: nbedoui
 * Date: 04/03/13
 * Time: 15:07
 * To change this template use File | Settings | File Templates.
 */
var mwSchemas = require('./SalesManagerModels');

function sleep(milliSeconds){
    var startTime = new Date().getTime(); // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}

var saveCallBack = function(err){
    if (err){
        return console.log(err);
    };
    //sleep(100);
    return console.log('Data inserted successfully.');
};
/*
var gst = new mwSchemas.GST();
gst.tauxGST = 5.5;
gst.save(saveCallBack());

var gst = new mwSchemas.GST();
gst.tauxGST = 7;
gst.save(saveCallBack());

var gst = new mwSchemas.GST();
gst.tauxGST = 19.6;
gst.save(saveCallBack());

//gst.save({tauxGST:7}, saveCallBack());
//gst.save({tauxGST:19.6}, saveCallBack());

var phoneType = new mwSchemas.PhoneType({phoneType:'Standard'});
phoneType.save(saveCallBack);

var phoneType = new mwSchemas.PhoneType({phoneType:'Bureau'});
phoneType.save(saveCallBack);

var phoneType = new mwSchemas.PhoneType({phoneType:'Mobile'});
phoneType.save(saveCallBack);


var status = new mwSchemas.Status({status:'Prospect'});
status.save(saveCallBack);

var status = new mwSchemas.Status({status:'Client'});
status.save(saveCallBack);

var status = new mwSchemas.Status({status:'Contact'});
status.save(saveCallBack);
*/

/*
var account = new mwSchemas.Account({
    accountCode : 'A001',
    accountName : 'Marwael SARL',
    description : 'Marwael Sarl',
    website : 'http://www.marwael.fr',
    logo:'/images/logos/marwael-logo.png',
    industry:'Informatique',
    address: [{
        addressType : 'Facturation',
        street : '34, chemin des prieurs',
        zipCode : '95500',
        city : 'Le thillay',
        country : 'France'
    }]
});

account.save(saveCallBack);

var user = new mwSchemas.User({
    email:'nabil.bedoui@marwael.fr',
    password: 'marwael',
    name : {
        first: 'Nabil',
        last: 'BEDOUI'
    },
    active:true,
    account_id: '514875281ff5939706000006'
    }
);

user.save(saveCallBack);


var address = new mwSchemas.AddressAccount({
  "account_id" : "5173c6ed96e2cdb3d2155f1d",
  "addressType" : "Facturation",
  "street" : "34, chemin des prieurs",
  "zipCode" : "95500",
  "city" : "Le thillay",
  "country" : "France"
});

address.save(saveCallBack);

var address = new mwSchemas.AddressAccount({
    "account_id" : "5173c6ed96e2cdb3d2155f1d",
    "addressType" : "Correspondance",
      "street" : "17, rue de l'étang",
      "zipCode" : "93200",
      "city" : "Tremblay en France",
      "country" : "France"

});

address.save(saveCallBack);
*/
//mwSchemas.Customer.findByIdAndRemove("517e78e9dd9a60fd5a8fa85d", saveCallBack);

/*
var customer = new mwSchemas.Customer({ 
  "account_id" : "5173c6ed96e2cdb3d2155f1d",
  "customer_owner" : "514875d1f4fcecab06000006",
  "customerCode" : "C005",
  "customerName" : "Customer 5",
  "description" : "description" });
customer.save(saveCallBack);


var module = new mwSchemas.Module({
  "moduleName":"crm"
})
module.save(saveCallBack);

var moduleAuth = new mwSchemas.ModuleAuth({
  "module_id":"5188d2f2fc35b74103000003",
  "account_id" : "5173c6ed96e2cdb3d2155f1d",
  "active":false
})
moduleAuth.save(saveCallBack);

var customer = new mwSchemas.Customer(
{ "account_id" : "5173c6ed96e2cdb3d2155f1d",
  "customer_owner" : "514875d1f4fcecab06000006",
  "customerCode" : "C022",
  "customerName" : "Customer 22",
  "description" : "description",
  "addresses":["51794b35a440e5bd0400004d"] }
)
  customer.save(saveCallBack);
  */

  var addressType = new mwSchemas.AddressType({
    addressType : "Facturation"
  })

  addressType.save(saveCallBack);