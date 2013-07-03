(function($){

	
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
	
	var showMessage = function(msg){
		$('#error').text(msg);
	    $('#error').show('fast');
	    setTimeout(function(){
	        $('#error').hide('slow');
	    }, 5000);  //The message is displayed for 5 sec
	}


	Backbone.Model.prototype.idAttribute = '_id';

	var paramEntity = $("#table").attr("entity");
	var paramName = $("#table").attr("paramname");
	console.log("paramEntity="+paramEntity);
	var paramListView;

	//Models 
	var Param = Backbone.Model.extend({

		
	});

	var ParamList = Backbone.Collection.extend({
		model : Param,
		url : '/list/'+paramEntity
	});

	var paramList = new ParamList();

	//GST View
	var ParamView = Backbone.View.extend({
		tagName : 'tr',
		events : {
			'focus .edit':'editFocused',
            'keypress .edit': 'editKeypressed',
            'webkitspeechchange .edit':'editWebkitspeechchange',
            'click .delete':'deleteItem'
		},
		initialize : function(options){
			this.template = _.template($('#param-template').html());
			this.listenTo(this.model, 'change', this.update);
            this.listenTo(this.model, 'destroy', this.remove);
		},
		render : function(){
			var data = this.model.toJSON();
			this.$el.append(this.template({pos:this.pos, model: data}));
			return this;
		},
		editFocused: function(e) {
			e.preventDefault();
			var id = e.currentTarget.id;
			$(".edit").removeAttr("x-webkit-speech");
			$("#"+id).attr("x-webkit-speech", "x-webkit-speech");
		},
		editWebkitspeechchange: function(e){
			var id = e.currentTarget.id;
			this.updateData(id);
		},
		editKeypressed : function(e) {
			if (e.keyCode == 13) {
				var id = e.currentTarget.id;
				this.updateData(id);
			}
		},
		updateData : function(editId){
			self = this;
			var el = $("#"+editId);
			//var paramName = el.attr('name');
        	var paramValue = el.val();
        	if (paramValue){
				var data = {};
				data[paramName]=paramValue
				console.log("data="+JSON.stringify(data));
				var url = '/params/update/'+paramEntity+'/'+editId;
				sendData('POST', url, data, function(err, result){
					if(err){
						showMessage(result.msg);
					} else {
						self.model.set(result.data);
						$("#inputItem").focus();
						$(".edit").removeAttr("x-webkit-speech");
					}
				});
			}
		},
		deleteItem : function(e){
			self = this;
			e.preventDefault();
			var id = e.currentTarget.id;
			var dataString = "_id="+id;
			this.model.destroy();
		}
	})

//GST List View

	var ParamListView = Backbone.View.extend({
		model: paramList,
		el : $('#paramList-container'),
		events : {
			'click #addItem':'toggleInputPanel',
			'click #submit':'insertData',
			'keypress #inputItem':'insertKeypressed',
			'webkitspeechchange #inputItem':'insertData'

		},
		initialize : function(){
			 _.bindAll(this, 'render');
			this.fetch('');
			this.model.bind('add', this.addItem, this);
		},
		fetch : function(params){
			var self = this;

			this.model.fetch(
				{
					data:$.param(params),
					type: 'POST',
					success: function(){ 
						self.render();
					},
					error: function(){
						showMessage('Cannot retrive models from server');
					}
				})
		},
		render: function(){
			var self = this;
			$("#param-list").html('');
			var paramList = this.model.models;
			for (var i = 0; i < paramList.length; i++){
				var item = paramList[i];
				this.addItem(item);
			};

			return this;
		},
		toggleInputPanel : function(e){
			$('#inputPanel').toggle();
			$("#inputItem").focus();
		},
		addItem : function(item){
			var paramView = (new ParamView({model: item})).render().el;
			$("#param-list").append(paramView);
		},
		insertKeypressed : function(e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				this.insertData();
			}
		},
        insertData : function(){
        	self = this;
        	//var paramName = $("#inputItem").attr('name');
        	var paramValue = $("#inputItem").val();
        	if (paramValue){
	        	var dataString = paramName+'='+paramValue;
				var url = '/params/insert/'+paramEntity;
				var placeholder = $("#inputItem").attr("placeholder");
				sendData('POST', url, dataString, function(err, result){
					if(err){
						showMessage(result.msg);
					} else {
						self.model.add(result.data);
						self.toggleInputPanel();
					}
					$("#inputItem").val(placeholder);
				});
			}
		}
	});

	
	$(document).ready(function(){
		paramListView = new ParamListView();
		//Backbone.history.start({pushState: true});
		if (!Backbone.history)
		//Backbone.history = Backbone.history || new Backbone.History({});
   			Backbone.history.start({pushState: true});
	})
})(jQuery);