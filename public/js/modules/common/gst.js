//GST (TVA)
(function($){

	var sendData = function(method, url, data, callback){
		$.ajax({
				type: method,
				url:url,
				data:data,
				success: function(data, textStatus, xhr){
					console.log("update data ok : "+textStatus);
					callback(null, {data:data, msg:textStatus});
					//window.location.href="/params/"+entity;
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
	
	Backbone.Model.prototype.idAttribute = '_id';

	var gstListView;

	//Models 
	var Gst = Backbone.Model.extend({
		
	});

	var GstList = Backbone.Collection.extend({
		model : Gst,
		url : '/list/Gst'
	});

	var gstList = new GstList();

	//GST View
	var GstView = Backbone.View.extend({
		tagName : 'tr',
		events : {
			'focus .edit':'editFocused',
            'keypress .edit': 'editKeypressed',
            'webkitspeechchange .edit':'editWebkitspeechchange',
            'click .delete':'deleteItem'
		},
		initialize : function(){

			this.template = _.template($('#gst-template').html());
			this.listenTo(this.model, 'change', this.update);
            this.listenTo(this.model, 'destroy', this.remove);
		},
		render : function(){
			var data = this.model.toJSON();
			this.$el.append(this.template({model: data}));
			return this;
		},
		editFocused: function(e) {
			console.log("Focus");
			e.preventDefault();
			var id = e.currentTarget.id;
			$(".edit").removeAttr("x-webkit-speech");
			$("#"+id).attr("x-webkit-speech", "x-webkit-speech");
		},
		editWebkitspeechchange: function(e){
			var id = e.currentTarget.id;
			console.log("Hello");
			this.updateData(id);
		},
		editKeypressed : function(e) {
			console.log("e.keyCode="+e.keyCode);
			//e.preventDefault();
			if (e.keyCode == 13) {
				var id = e.currentTarget.id;
				this.updateData(id);
				
				
			}
		},
		updateData : function(editId){
			self = this;
			var el = $("#"+editId);
			//var entity = $("#table").attr("entity");
			//var name = el.attr("name");
			var value=el.val();
			var data = {
				'tauxGST':value
			}

			var url = '/params/update/Gst/'+editId;
			console.log('entity = gst - data: '+data);
			sendData('POST', url, data, function(err, result){
				if(err){
					console.log("Erreur="+err.name+" - msg:"+result.msg);
				} else {
					console.log("OK - msg:"+result.msg);
					self.model.set(result.data);
					$("#addItem").focus();
				}
			});
			
		},
		deleteItem : function(e){
			self = this;
			e.preventDefault();
			var id = e.currentTarget.id;
			var dataString = "_id="+id;
			this.model.destroy();
			/*
			console.log("Supprimer de l'enreg..."+dataString);
			var url = '/params/delete/Gst';
			sendData('DELETE', url, dataString, function(err, msg){
				if(err){
					console.log("Erreur="+err.name+" - msg:"+msg);
				} else {
					console.log("OK - msg:"+msg);
					//self.model.destroy();
				}
			});
			*/


			
		}
	})

//GST List View

	var GstListView = Backbone.View.extend({
		model: gstList,
		el : $('#gstList-container'),
		perPage : 10,
		events : {
			'click #search':'searchCustomer',
			'keypress #searchFieldValue':'searchCustomerEdit',
			'click #submit':'insertItem'

		},
		initialize : function(){
			 _.bindAll(this, 'render');
			var self =this;
			this.options.page=1;
			this.fetch('');
			this.model.bind('reset', this.render, this);
			this.model.bind('add', this.addItem, this);
		},
		fetch : function(params){
			var self = this;

			this.model.fetch(
				{
					data:$.param(params),
					type: 'POST',
					success: function(){ 
						self.count = self.model.models.length;
						self.maxPages = Math.ceil(parseInt(self.count, 10) / parseInt(self.perPage, 10));
						self.render();

					},
					error: function(){
						console.log('Cannot retrive models from server');
					}
				})
		},
		render: function(){
			var startPos = (this.options.page-1)*this.perPage;
			var endPos = Math.min(startPos + this.perPage, this.count);
			console.log("startPos="+startPos+" endPos="+endPos);
			var self = this;
			$("#gst-list").html('');
			var gstList = this.model.models;
			for (var i = startPos; i < endPos; i++){
				var item = gstList[i];
				this.addItem(item);
			};

			return this;
		},
		addItem : function(item){
			var gstView = (new GstView({model: item})).render().el;
			$("#gst-list").append(gstView);
		},
        insertItem : function(e){
        	//var idBtn = arguments[0].currentTarget.id;
            //var idCustomer = $(".mediumListIconTextItem.selected").attr('id');
            var gstItem = $("#addItem").val();
            console.log("Add item :"+gstItem); 
            this.insertData();       
            
        },
        insertData : function(){
        	self = this;
        	var value = $("#addItem").val();
        	var dataString = 'tauxGST='+value;
			//var dataString = $('form').serialize()
			console.log("Enregistrer les données..."+dataString);
			var url = '/params/insert/Gst';
			sendData('POST', url, dataString, function(err, result){
				if(err){
					console.log("Erreur="+err.name+" - msg:"+result.msg);
					showMessage(result.msg);
				} else {
					console.log("OK - msg:"+result.msg);
					self.model.add(result.data);
					$("#addItem").focus();
				}
			});
		}
	});
	$(document).ready(function(){
		gstListView = new GstListView();
		Backbone.history.start({pushState: true});
	})
})(jQuery);

