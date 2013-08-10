var home = require('../modules/home/home');
var crm = require('../modules/crm/crm');
var login = require('../modules/login/login');
var common = require('../modules/common/models/common');
var sales = require('../modules/sales/sales');
var address = require('../modules/sales/customers/addresses');
var contact = require('../modules/sales/contacts/contacts');
var quote = require('../modules/sales/quotes/quotes')
var invoice = require('../modules/sales/invoices/invoices')
var products = require('../modules/sales/products/products')

//app.use(home);
//app.use(login);
//app.use(sales);

module.exports = function(app){
	app.get('/', home.index);


	app.get('/login', login.index);
	app.post('/auth', login.auth);
	app.get('/logout', login.logout);

	//Sales module
	app.get('/sales', sales.index);

	
//customers
	app.get('/sales/customers', sales.customers); //Show customers view

	//app.get('/sales/customerDetails/:id/:active', sales.customerDetails); 
	app.get('/sales/customerInfos/:id', sales.customerInfos);
	//app.get('/sales/customerDetails/:id', sales.customerDetails);
	app.get('/sales/newCustomer', sales.newCustomer);
	app.post('/sales/insertCustomer', sales.insertCustomer);

	app.get('/sales/updateCustomerView/:id', sales.updateCustomerView);
	app.post('/sales/updateCustomer', sales.updateCustomer);

	//Api
	app.post('/list/customers', sales.customersList)
	app.post('/list/customersName', sales.customersNameList)
	//***********************************	


	//address
	//app.post('/api/address', address.getAddressByCustomerId)
	app.post('/sales/insertAddress/:custId', address.insertAddress);
	app.post('/sales/updateAddress/:custId/:id', address.updateAddress);
	app.get('/sales/deleteAddress/:custId/:id', address.deleteAddress);
	
	//maps for unique address
	app.get('/sales/customer/address/maps/:custId/:addressId', sales.maps);
	//app.post('/sales/maps', sales.maps);


	//Contacts
	//app.post('/api/contact', contact.getContactByCustomerId)
	app.post('/sales/insertContact/:custId', contact.insertContact);
	app.post('/sales/updateContact/:custId/:id', contact.updateContact);
	app.get('/sales/deleteContact/:custId/:id', contact.deleteContact);
	
	//Quotes menu
	app.get('/sales/quotes', quote.index);
	app.get('/sales/newQuote', quote.newQuote);
	app.post('/sales/saveQuote', quote.saveQuote);
	app.get('/sales/quotes/:custId/:status', sales.customerQuotations);
	
	//Invoices
	app.get('/sales/invoices', invoice.index);

	//Items
	app.get('/sales/products', products.index);
	app.get('/sales/product/:id', products.productDetails);
	app.post('/sales/updateProduct/:id', products.updateProduct);
	app.get('/sales/newProduct', products.newProduct);
	app.post('/sales/insertProduct', products.insertProduct);
	app.get('/api/product/:id', products.apiProductDetails);
	app.post('/list/products', products.productsList);
	app.post('/list/productsName', products.productsNameList);

	//Quotations
	app.get('/list/quotes', quote.quotesList)

	//CRM
	app.get('/crm', crm.index);
	//Common pages
	app.get('/params', common.params);
	app.get('/params/:param', common.param);
	app.post('/list/:entity', common.paramList);

	//CRUD GST (TVA)
	app.post('/params/update/:entity/:id', common.updateDocument);
	app.post('/params/insert/:entity', common.insertDocument);
	app.delete('/params/delete/:entity', common.deleteDocument);
	app.delete('/list/:entity/:id', common.deleteDocument);

	app.post('/fileupload', sales.uploadLogo);

	
}