(function($){


	////ajax send data
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
				

				var saveQuotationInfos = function(){
					var quotation_data = {};
					
					quotation_data["customer_id"] = $("#customer_id").val();
					quotation_data["customerName"] = $("#customerName").val();
					quotation_data["customerAddress"] = $("#customerAddress").html();

					quotation_data["date"] = $("#date").val();
					quotation_data["quotation_number"] = $("#quotation_number").val();
					quotation_data["reference"] = $("#reference").val();

					//Summary
					quotation_data["amount"] = $("#amount").text();
					quotation_data["discount"] = $("#discount").text();
					quotation_data["amountAfterDiscount"] = $("#amountAfterDiscount").text();
					quotation_data["GST"] = $("#GST").text();
					quotation_data["amountAll"] = $("#amountAll").text();

					console.log("data="+JSON.stringify(quotation_data));

					//Quotation Lines
					
					$('.productName').each(function() {
					    var id = $(this).attr('id').split('-')[1];
					    var quotation_line_data = {};
						quotation_line_data["productName"] = $("#productName-"+id).val();
						quotation_line_data["productDescription"] = $("#productDescription-"+id).val();
						quotation_line_data["productSalesPrice"] = $("#productSalesPrice-"+id).val();
						quotation_line_data["productUnit"] = $("#productUnit-"+id).val();
						quotation_line_data["quantity"] = $("#quantity-"+id).val();
						quotation_line_data["amount"] = $("#amount-"+id).val();
						quotation_line_data["productSalesDiscount"] = $("#productSalesDiscount-"+id).val();
						quotation_line_data["amountAfterDiscount"] = $("#amountAfterDiscount-"+id).val();
						quotation_line_data["productGST"] = $("#productGST-"+id).val();

						console.log("quotation_line_data="+JSON.stringify(quotation_line_data));
						quotation_data["quotation_lines"].push(quotation_line_data);
					});
					
					//console.log("data="+JSON.stringify(quotation_data));

				}


				
				

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
					var size = $(".productName").size() ;
					console.log("Size ="+size);
					var amount = 0;
					var discount = 0;
					var gst = 0;
					for (var i=1; i <= size; i++){
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
					
					sendData('POST', '/list/productsName', {q:query}, function(err, result){

						console.log("result="+JSON.stringify(result));
						var data = result["data"];
						console.log("data="+JSON.stringify(data));
						
						
						$.each(data, function (i, product) {
							map[product.productName] = product;
							products.push(product.productName);
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

	//Quotation Line View
	var QuotationLineView = Backbone.View.extend({
		tagName : 'section',
		lineId : '1',
		events : {
			'input .numeric':'updateCalc',
			'input .productName':'selectProduct',
			'click .deleteBtn':'deleteLine'

		},
		selectProduct : function(e){
			console.log("Select product...");
			$('.productName').typeahead({source: productSource, matcher: productMatcher, highlighter: productHiglighter, updater: productUpdater});

		},
		updateCalc : function(e){
			console.log("numeric input");
			var id = (e.currentTarget.id).split('-')[1];
			calcQuotationLine(id);

		},
		deleteLine : function(e){
			console.log("Delete Line");
			var id = (e.currentTarget.id).split('-')[1];
			$("#quotation-line-"+id).remove();
		},
		initialize : function(options){
			this.lineId = this.options.lineId;
			
			this.template = _.template($('#quotationLine-template').html());
		},
		
		render : function(){
			
			var lineId = this.lineId;
			console.log("lineId="+lineId);
			this.$el.append(this.template({lineId:lineId}));
			return this;
		}
	});

	//Quotation Lines View
	var QuotationLinesView = Backbone.View.extend({
		el : $('#quotation-container'),
		events : {
			'click #addLine':'addLine',
			'click #saveQuotation': 'saveQuotation'
		},
		addLine : function(e){
			var idArray= new Array();
			var largest = 1;
			$('.productName').each(function() {
			    var id = $(this).attr('id').split('-')[1];
			    idArray.push(id);
			    console.log("id="+id);

			});

			console.log(idArray);
			if (idArray.length > 0) 
				largest = Math.max.apply(Math, idArray)+1;
			console.log("largest="+largest);
			var quotationLineView = (new QuotationLineView({lineId:largest})).render().el;
			$("#quotation-lines").append(quotationLineView);

		},
		initialize : function(){
			var self =this;
			this.render();
		},
		render : function(){
			console.log("Render quotationLinesView");
			var self = this;
			$("#quotation-lines").html('');
			var quotationLineView = (new QuotationLineView({lineId:"1"})).render().el;
			$("#quotation-lines").append(quotationLineView);
			

			
			return this;
		},
		saveQuotation : function(){
			saveQuotationInfos();
		}


		
	});

	$(document).ready(function(){
		console.log("Document ready....");
		quotationLinesView = new QuotationLinesView();
		
				
		//Backbone.history.start({pushState: true});
		if (!Backbone.history)
		//Backbone.history = Backbone.history || new Backbone.History({});
   			Backbone.history.start({pushState: true});
	})
})(jQuery);