(function($){
			$(document).ready(function(){
				// load a language
				
				numeral.language('fr', {
					delimiters: {
						thousands: ' ',
						decimal: ','
					},
					abbreviations: {
						thousand: 'k',
						million: 'm',
						billion: 'b',
						trillion: 't'
					},
					ordinal : function (number) {
						return number === 1 ? 'er' : 'ème';
					},
					currency: {
						symbol: '€'
					}
				});

				//ajax send data
				var sendData = function(method, url, data, callback){
					$.ajax({
						type: method,
						url:url,
						data:data,
						success: function(data, textStatus, xhr){
							callback(null, {data:data, msg:textStatus});
						},
						error: function(xhr, textStatus, error){
							var msg ="Impossible de modifier l'élément sélectionné : ";
							switch (xhr.status) {
								case 404: {
									msg += "Problème de connexion avec le serveur";
									break;
								}
								case 500: {
									var responseText = $.parseJSON(xhr.responseText);
									var error = responseText.error;
									msg += error.name+" : "+error.errmsg;
									break;
								}
							}
							callback(error, {data:null, msg:msg});
						}
					});
				}
				

				//Source for customer name
				var customerSource= function (query, process) {
					console.log("query="+query);

					customers = [];
					map = {};
					
					sendData('POST', '/list/customersName', {q:query}, function(err, result){

						console.log("result="+JSON.stringify(result));
						var data = result["data"];
						console.log("data="+JSON.stringify(data));
						
						
						$.each(data, function (i, customer) {
							
							map[customer.customerName] = customer;
							customers.push(customer.customerName);
						});

						process(customers);
					});
				}
				
				var customerMatcher = function(item){
					console.log("item="+JSON.stringify(item));
					var qr = this.query.trim().toLowerCase();
					console.log("qr="+qr);
					if (item.toLowerCase().indexOf(qr) == 0){
						return true;
					}
				}
				var customerHiglighter = function(item){
					var regex = new RegExp('('+this.query+')', 'gi');
					return item.replace(regex, '<span style="color:red">$1</span>');
				}

				
				var customerUpdater = function(item){
					selectedCustomer = map[item];
					var custId = selectedCustomer._id;
					sendData('POST', '/api/address/', {"custId":custId, "addressType":"1"}, function(err, data){
						var address = data["data"];
						console.log("address="+JSON.stringify(address));
						var addressStr = '<strong>'+selectedCustomer.customerName+'</strong><br/>';
						addressStr += address.street+'<br/>';
						addressStr += address.zipCode+" , "+ address.city+'<br/>';
						addressStr += address.country;
						$("#customerInfos").html(addressStr);
					});
					return item;
				}
				
				$('#customerName').typeahead({source: customerSource, matcher:customerMatcher, highlighter:customerHiglighter, updater:customerUpdater}) 
				
				var calcQuotationLine = function(lineID){
					var quantity = $("#quantity-"+lineID).val();
					var price = $("#productSalesPrice-"+lineID).val();
					var amount =  quantity * price;
					$("#amount-"+lineID).val(numeral(amount).format('0 0.00'));
					var discount = amount * $("#productSalesDiscount-"+lineID).val() / 100;
					var amountAfterDiscount = amount - discount;
					$("#amountAfterDiscount-"+lineID).val(numeral(amountAfterDiscount).format('0 0.00'));

					calcAll();
				}

				var calcAll = function(){
					var size = $(".productCode").size();
					var amount = 0;
					var discount = 0;
					var gst = 0;
					for (var i=1; i < 3; i++){
						amount = amount + 1*$("#amount-"+i).val();
						console.log("i="+i+"  amount="+amount);
						discount = discount + $("#amount-"+i).val() * $("#productSalesDiscount-"+i).val()/100;

						gst = gst + $("#productGST-"+i).val()*(amount-discount)/100;
						
					}

					$("#amount").text(numeral(amount).format('0.00'));
					$("#discount").text(numeral(discount).format('0.00'));
					var amountAfterDiscount = amount-discount;
					$("#amountAfterDiscount").text(numeral(amountAfterDiscount).format('0.00'));
					$("#GST").text(numeral(gst).format('0.00'));
					$("#amountAll").text(numeral(amountAfterDiscount + gst).format('0.00'));

				
				}

				var updateFields = function(lineId, productId){
					sendData('GET', '/api/product/'+productId, {}, function(err, data){
						var product = data["data"];
						$('#productName-'+lineId).val(product.productName);
						$('#productSalesPrice-'+lineId).val(numeral(product.productSalesPrice).format('0 0.00'));
						$('#productUnit-'+lineId).val(product.productUnit);
						$('#productSalesDiscount-'+lineId).val(product.productSalesDiscount);
						$('#productGST-'+lineId).val(product.productGST);
						//$('#productDiscount)
						calcQuotationLine(lineId);
					});
						
				}

				
				//Source for product code
				var productSource= function (query, process) {
					console.log("query="+query);

					products = [];
					map = {};
					
					sendData('POST', '/list/productsCode', {q:query}, function(err, result){

						console.log("result="+JSON.stringify(result));
						var data = result["data"];
						console.log("data="+JSON.stringify(data));
						
						
						$.each(data, function (i, product) {
							map[product.productCode] = product;
							products.push(product.productCode);
						});

						process(products);
					});
				}
				
				var productMatcher = function(item){
					var qr = this.query.trim().toLowerCase();
					console.log("qr="+qr);
					if (item.toLowerCase().indexOf(qr) == 0){
						return true;
					}
				}
				var productHiglighter = function(item){
					var regex = new RegExp('('+this.query+')', 'gi');
					return item.replace(regex, '<span style="color:red">$1</span>');
				}

				
				var productUpdater = function(item){
					var lineId = this.$element.attr("id").split('-')[1];
					selectedProduct = map[item];
					updateFields(lineId, selectedProduct._id);

					return item;
				}
				
				$('.productCode').typeahead({source: productSource, matcher: productMatcher, highlighter: productHiglighter, updater: productUpdater}) 

				
				$('.numeric').on('input', function(e){
					var id = (e.currentTarget.id).split('-')[1];
					calcQuotationLine(id);

				})
				
				$(".quotation-line div").delegate('a', 'click', function(e){
					e.preventDefault();
					var id = e.currentTarget.id;
					console.log("Delete line id="+id);
				})

				$(".deleteBtn").on('click', function(e){
					console.log("Delete line 3");
				})
				
				$("#addLine").on('click', function(e){
					var size = $(".productCode").size();
					var size = size*1 + 1;

					console.log("Add line ...."+size);
					
				})

				
		
			})

			
		})(jQuery);