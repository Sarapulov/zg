/********************

	# zg
	
	ver 1.0.1 | last updated: 2020-06-09

	OVERVIEW:

		JavaScript library for Zendesk Help Center (part of Zendesk Guide) that contains
		the collection of useful methods that may help automating routine dev tasks.

********************/

var zg = function() {
		'use strict';
	
		var mdl = {};

		mdl.version = 'ver 1.0.1 | last updated: 2020-06-09';

		mdl.help = function() {
			console.table([	["zg().help()", "return the list of available methods"],
							["zg().version", "return current version of the 'zg' library"],
							["zg().isTicketFormSelectorPage()", "TRUE if current page is a form selector page"],
							["zg().isTicketFormPage()", "TRUE if current page is the actual ticket form"],
							["zg().getTicketFormID()", "return currently selected ticket form ID as a string"],
							["zg().isThisTheFormID('12345')", "TRUE if passed ID is matching the current ticket form ID"],
							["zg().hasAnyUserTag(['test','/office:/'])", "TRUE if current user has at least one of the tags OR at least one tag is matching the pattern"],
							["zg().hasAllUserTag(['test','/office:/'])", "TRUE if current user has all tags OR all tags are matching the pattern"],
							["zg().getUserLocale()", "return current user locale from Help Center HTML"]
						]);
		}
	   	mdl.isTicketFormSelectorPage = function(){ // is this ticket form selector page
	   		var form = document.getElementById('new_request');
	   		return (window.location.href.indexOf('/requests') > -1) && form && form.getElementsByTagName('footer') && form.getElementsByTagName('footer').length == 0;
	   	}
	   	mdl.isTicketFormPage = function() { // is this actual ticket form page
	   		var form = document.getElementById('new_request');
	   		return (window.location.href.indexOf('/requests') > -1) && form && form.getElementsByTagName('footer') && form.getElementsByTagName('footer').length > 0;
	   	}
	   	mdl.getTicketFormID = function() { // return ticket form ID
	   		return document.getElementById('request_issue_type_select').value || document.getElementById('request_ticket_form_id').value;
	   	}
	   	mdl.isThisTheFormID = function(form_id) { // return TRUE if current ticket form ID matches the argument
	   		return mdl.getTicketFormID() == form_id;
	   	}
	   	mdl.hasAnyUserTag = function(listOfUserTags) { // return TRUE if Help Center user has at least one tag or matching the regex pattern
	   		var hasTags,
	   			h = HelpCenter,
	   			hasHelpCenter = h && h.user && h.user.tags && h.user.tags.length;
	   		
	   		if (listOfUserTags && hasHelpCenter) {
	   			hasTags = listOfUserTags.filter(function(n) {
				    var isMatchPattern;
	   				if (n.indexOf('/') > -1) {
	   					var re = new RegExp(n.replace(/\//g, ''));
	   					for (var i = 0; i < h.user.tags.length; i++) {
	   						if (re.test(h.user.tags[i])) {
	   							isMatchPattern = true;
	   							break;
	   						}
	   					}
	   				}
				    return (h.user.tags.indexOf(n) !== -1) || !!isMatchPattern;
				});
	   		}
	   		return !!hasTags && !!hasTags.length;
	   	}
	   	mdl.hasAllUserTag = function(listOfUserTags) { // return TRUE if all tags in the array are present
	   		var hasAllTags,
	   			h = HelpCenter,
	   			hasHelpCenter = h && h.user && h.user.tags && h.user.tags.length;
	   		
	   		if (listOfUserTags && hasHelpCenter) {
	   			hasAllTags = listOfUserTags.filter(function(n) {
				    var isMatchPattern;

	   				if (n.indexOf('/') > -1) {
	   					var re = new RegExp(n.replace(/\//g, ''));
	   					for (var i = 0; i < h.user.tags.length; i++) {
	   						if (re.test(h.user.tags[i])) isMatchPattern = true;
	   					}
	   				}
				    return listOfUserTags && listOfUserTags.length && (h.user.tags.indexOf(n) !== -1) || !!isMatchPattern;
				});
	   		}
	   		return !!hasAllTags && !!hasAllTags.length && (hasAllTags.length == listOfUserTags.length);
	   	}
	   	mdl.getUserLocale = function() { // return user locale from the URL
	   		var html = document.getElementsByTagName('html')[0];
			return html && html.attributes && html.attributes.lang && html.attributes.lang.value.toLowerCase();
		}

	   	return mdl;
}