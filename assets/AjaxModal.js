/*
	TITLE: AjaxModal

	DESCRIPTION: Subclass of ModalWindow retrieves & injects Ajax content

	VERSION: 0.2.2

	USAGE: var myAjaxModal = new AjaxModal('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: CN

	DEPENDENCIES:
		- jquery 2.1x+
		- Class.js
		- ModalWindow.js
		- LoaderSpinner.js

*/

//uncomment to use as a browserify module
// var ModalWindow			= require('./ModalWindow');
// var LoaderSpinner		= require('./LoaderSpinner');

var AjaxModal = ModalWindow.extend({
	init: function($triggers, objOptions) {

		this.options = $.extend({
			ajaxErrorMsg: '<div class="errormessage"><p>Sorry. Ajax request failed.</p></div>',
			customEventName: 'CNJS:AjaxModal'
		}, objOptions || {});

		// setup & properties
		this.ajaxLoader = null;

		this._super($triggers, this.options);

	},


/**
*	Private Methods
**/

	initDOM: function() {
		this._super();
		this.ajaxLoader = new LoaderSpinner(this.$modal);
	},


/**
*	Public Methods
**/

	getContent: function() {
		var self = this;
		var ajaxUrl = this.$activeTrigger.data('ajaxurl') || this.$activeTrigger.attr('href');
		var targetID = ajaxUrl.split('#')[1] || false;
		var targetEl;

		this.ajaxLoader.addLoader();

		$.when(this.ajaxGET(ajaxUrl, 'html'))
			.done(function(response) {
				//console.log(response);

				if (targetID) {
					targetEl = $(response).find('#' + targetID);
					if (targetEl.length) {
						self.contentHTML = $(response).find('#' + targetID).html();
					} else {
						self.contentHTML = $(response).html();
					}

				} else {
					self.contentHTML = response;
				}

				// add delay to showcase loader-spinner
				setTimeout(function() {
					self.ajaxLoader.removeLoader();
					self.setContent();
				}, 400);

			})
			.fail(function(response) {
				//console.log(response);
				self.contentHTML = '';
				self.ajaxLoader.removeLoader();
				self.$content.html(self.options.ajaxErrorMsg);
			});

	},

	// returns an Ajax GET request using deferred, url is required, dataType is optional
	ajaxGET: function(url, dataType) {
		return $.ajax({
			type: 'GET',
			url: url,
			dataType: dataType || 'json'
		});
	}

});

//uncomment to use as a browserify module
//module.exports = AjaxModal;
