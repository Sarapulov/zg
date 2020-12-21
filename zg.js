/********************

	# zg
	
	ver 1.0.9 | last updated: 2020-12-21

	OVERVIEW:

		JavaScript library for Zendesk Help Center (part of Zendesk Guide) that contains
		the collection of useful methods that may help automating routine dev tasks.

********************/

var zg = function() {
		'use strict';
	
		var mdl = {};

		mdl.version = 'ver 1.0.9 | last updated: 2020-12-21';

		mdl.help = function() {
			console.table({
							["zg().help()"]											:"return the list of available methods",
							["zg().version"]										: "return current version of the 'zg' library",
							["zg().isTicketFormSelectorPage()"]						: "TRUE if current page is a form selector page",
							["zg().isTicketFormPage()"]								: "TRUE if current page is the actual ticket form",
							["zg().getTicketFormID()"]								: "return currently selected ticket form ID as a string",
							["zg().isThisTheFormID('12345')"]						: "TRUE if passed ID is matching the current ticket form ID",
							["zg().hasAnyUserTag(['test','/office:/'])"]			: "TRUE if current user has at least one of the tags OR at least one tag is matching the pattern",
							["zg().hasAllUserTag(['test','/office:/'])"]			: "TRUE if current user has all tags OR all tags are matching the pattern",
							["zg().hasUserNoneOfTheseTags(['test','/office:/'])"]	: "TRUE if current user has none of tags OR no tags are matching the pattern",
							["zg().getUserLocale()"]								: "return current user locale from Help Center HTML",
							["zg().getAllTicketFormIDs()"]							: "return all available ticket form IDs. Should be used on the new_request_page.hbs",
							["zg().hideTicketFormIDs(['123','456'])"]				: "will hide listed ticket form IDs from the Ticket Form Selector excluding currrently selected ticket form",
							["zg().ifUrlContainsAny(['en','us'])"]					: "TRUE if either of the strings are available in the current URL. window.location.href is used to define the URL",
							["zg().ifUrlContainsAll(['en','us'])"]					: "TRUE if all of the strings are available in the current URL. window.location.href is used to define the URL",
							["zg().isVisitorLogin()"]								: "TRUE if current visitor is login to Help Center. Should be called after page is loaded.",
							["zg().isAgentMemberOfAnyGroups(['Group 1','/Group/'])"]: "TRUE if current Agent is a member of any Group or Group name is matching the pattern",
							["zg().isAgentMemberOfAllGroups(['Group 1','/Group/'])"]: "TRUE if current Agent is a member of all Groups or Group name is matching the pattern",
							["zg().setTicketFieldAttribbutes([{\"field_id\":\"request_description\",\"label\":\"MY FIELD LABEL\",\"help_text\":\"MY FIELD HELP TEXT\"}])"]: "Sets ticket field label and/or help text on a ticket form. tested with the following field ids: request_description, request_subject, request_custom_fields_XXXXXX, request_organization_id, request_collaborators_, request_issue_type_select",
							["zg().moveFormFields([{\"field_classes_to_move\":[\"request_subject\",\"request_custom_fields_23156796\",\"upload-dropzone\",\"request_cc_emails\",\"request_organization_id\"],\"move_field_before_field\": true,\"anchor_field_class\":\"request_custom_fields_24278963\"}])"]: "Moves field from {field_classes_to_move} BEFORE or AFTER {anchor_field_class} field on Help Center contact form"
						});

		}
	   	mdl.isTicketFormSelectorPage = function(){ // is this ticket form selector page
	   		var form = document.getElementById('new_request');
	   		return (window.location.href.indexOf('/requests') > -1) && form && form.getElementsByTagName('footer') && form.getElementsByTagName('footer').length == 0;
	   	}
	   	mdl.isTicketFormPage = function() { // is this actual ticket form page
	   		var form = document.getElementById('new_request');
	   		return !!((window.location.href.indexOf('/requests') > -1) && form && form.getElementsByTagName('footer') && (form.getElementsByTagName('footer').length > 0));
	   	}
	   	mdl.getTicketFormID = function() { // return ticket form ID
	   		var form = document.getElementById('request_issue_type_select');
	   		var form2 = document.getElementById('request_ticket_form_id');
	   		return (form && form.value) || (form2 && form2.value);
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
	   	mdl.hasUserNoneOfTheseTags = function(listOfUserTags) { // return TRUE if Help Center user has none of the tags or tag patterns listed in the array. All tags must not exist
	   		var hasAllTags,
	   			h = HelpCenter,
	   			hasHelpCenter = h && h.user,
	   			hasTags = h.user.tags && h.user.tags.length;
	   		
	   		if (listOfUserTags && hasTags) {
	   			hasAllTags = listOfUserTags.filter(function(n) {
				    var isMatchPattern;

	   				if (n.indexOf('/') > -1) {
	   					var re = new RegExp(n.replace(/\//g, ''));
	   					for (var i = 0; i < h.user.tags.length; i++) {
	   						if (re.test(h.user.tags[i])) isMatchPattern = true;
	   					}
	   				}
				    return listOfUserTags.length && (h.user.tags.indexOf(n) !== -1) || !!isMatchPattern;
				});
	   		}
	   		return !(!!hasAllTags && !!hasAllTags.length);
	   	}
	   	mdl.isAgentMemberOfAnyGroups = function(listOfAgentGroups) { // return TRUE if Agent visiting Help Center is a member of at least one Group
	   		var hasGroups,
	   			agentGroupNames,
	   			h = HelpCenter,
	   			hasHelpCenter = h && h.user && h.user.groups && h.user.groups.length;
	   		
	   		if (listOfAgentGroups && hasHelpCenter) {
	   			agentGroupNames = h.user.groups.map(function(group) {
	   				return group.name;
	   			})
	   			hasGroups = listOfAgentGroups.filter(function(n) {
				    var isMatchPattern;
	   				if (n.indexOf('/') > -1) {
	   					var re = new RegExp(n.replace(/\//g, ''));
	   					for (var i = 0; i < agentGroupNames.length; i++) {
	   						if (re.test(agentGroupNames[i])) {
	   							isMatchPattern = true;
	   							break;
	   						}
	   					}
	   				}
				    return (agentGroupNames.indexOf(n) !== -1) || !!isMatchPattern;
				});
	   		}
	   		return !!hasGroups && !!hasGroups.length;
	   	}
	   	mdl.isAgentMemberOfAllGroups = function(listOfAgentGroups) { // return TRUE if Agent visiting Help Center is a member of at all Groups
	   		var hasGroups,
	   			agentGroupNames,
	   			h = HelpCenter,
	   			hasHelpCenter = h && h.user && h.user.groups && h.user.groups.length;
	   		
	   		if (listOfAgentGroups && hasHelpCenter) {
	   			agentGroupNames = h.user.groups.map(function(group) {
	   				return group.name;
	   			})
	   			hasGroups = listOfAgentGroups.filter(function(n) {
				    var isMatchPattern;
	   				if (n.indexOf('/') > -1) {
	   					var re = new RegExp(n.replace(/\//g, ''));
	   					for (var i = 0; i < agentGroupNames.length; i++) {
	   						if (re.test(agentGroupNames[i])) isMatchPattern = true;
	   					}
	   				}
	   				return agentGroupNames && agentGroupNames.length && (agentGroupNames.indexOf(n) !== -1) || !!isMatchPattern;
				});
	   		}
	   		return !!hasGroups && !!hasGroups.length && (hasGroups.length == listOfAgentGroups.length);
	   	}
	   	mdl.getUserLocale = function() { // return user locale from the URL
	   		var html = document.getElementsByTagName('html')[0];
			return html && html.attributes && html.attributes.lang && html.attributes.lang.value.toLowerCase();
		}
		mdl.getAllTicketFormIDs = function() { // return an array of all available ticket form IDs as strings
			var allFormIds = [];
			var formSelector = document.getElementById('request_issue_type_select');
			if (formSelector) {
				formSelector && formSelector.childNodes.forEach(function(node){
					if (node && node.nodeName && (node.nodeName == 'OPTION') && (node.value !== '-')) allFormIds.push(node.value);
				});
			} else {
				var form = document.getElementById('request_ticket_form_id');
				if (form && form.value) allFormIds.push(form.value);
			}
	   		return allFormIds;
	   	}
	   	mdl.hideTicketFormIDs = function(form_ids){
			if (form_ids) {
				function hideFormIds(form_ids) { // initiaite the filtering logic
					// remove the currently ticket  from the list of form IDs
					form_ids = form_ids.filter(function(e) { return e !== mdl.getTicketFormID() })
					attachFormSelectorListeners(form_ids);
				}
				function attachFormSelectorListeners(form_ids) { // attach event listener to a child List under nesty-panel (this is how Help Center ticket form field dropdown is rendered)
					var targetNodes = document.getElementsByClassName('nesty-panel');
					for (var i=0; i < targetNodes.length; i++) {
						var observer = new MutationObserver(function(mutationsList, observer) {
							handleTicketFormClick(mutationsList, form_ids);
						});
						observer.observe(targetNodes[i], { attributes: false, childList: true, subtree: false });
					}
				}
				function handleTicketFormClick(mutationsList, form_ids) { // when dropdown list shows up this will remove unwanted form IDs and keep the one in @form_ids
					var ulLabel = mutationsList[0].target.querySelectorAll('ul[aria-labelledby]');
					if (!(ulLabel && ulLabel.length)) {
						mutationsList[0].target.querySelectorAll('li').forEach(function(element) {
							if ( (element.id !== '-') && (form_ids.indexOf(element.id) > -1) ) element.remove();
						})
					}
				}
				hideFormIds(form_ids);
			} else {
				console.warn('ERROR: zg.js > hideTicketFormIDs no ticket form IDs were passed to hideTicketFormIDs function.\n');
			}
		}
		mdl.ifUrlContainsAny = function(arrayOfString) { // check if any of passed atttributes are presented in the URL
			var isUrlContainsAny;
			if (arrayOfString !== undefined) {
				var url = window.location.href;
				if (arrayOfString instanceof Array) {
					for (var i = 0; i < arrayOfString.length; i++) {
						if (url.indexOf(arrayOfString[i]) > -1) {
							isUrlContainsAny = true;
							break;
						}
					}
				} else if (typeof arrayOfString === 'string' || arrayOfString instanceof String) {
					isUrlContainsAny = url.indexOf(arrayOfString) > -1;
				} else {
					console.warn('ERROR: zg.js > ifUrlContainsAny method received unexpected value. While Array of strings or a String is expected.\n')
				}
			}
			return !!isUrlContainsAny;
		}
		mdl.ifUrlContainsAll = function(arrayOfString) { // check if all of passed atttributes are presented in the URL
			var isUrlContainsAll;
			if (arrayOfString !== undefined) {
				var url = window.location.href;
				if (arrayOfString instanceof Array) {
					var tempArray = [];
					for (var i = 0; i < arrayOfString.length; i++) {
						if (url.indexOf(arrayOfString[i]) > -1) {
							tempArray.push(arrayOfString[i]);
						}
					}
					isUrlContainsAll = arrayOfString.length == tempArray.length;
				} else if (typeof arrayOfString === 'string' || arrayOfString instanceof String) {
					isUrlContainsAll = url.indexOf(arrayOfString) > -1;
				} else {
					console.warn('ERROR: zg.js > ifUrlContainsAll method received unexpected value. While Array of strings or a String is expected.\n')
				}
			}
			return !!isUrlContainsAll;
		}
		mdl.isVisitorLogin = function() { // check if current visitor is login
			try {
				return HelpCenter && HelpCenter.user && HelpCenter.user.role != 'anonymous';
			} catch(err) {
				console.warn('ERROR: zg.js > isVisitorLogin method failed execution. Consider calling this method after Help Center page is loaded.\n', err);
				return false;
			}
		}
		mdl.setTicketFieldAttribbutes = function(fieldSettings) { // Set ticket field label and help text
			// Tested with the following field id: request_description, request_subject, request_custom_fields_24156879, request_organization_id, request_collaborators_, request_issue_type_select
	   		if (mdl.isTicketFormPage() && fieldSettings && fieldSettings.length) {
	   			try {
	   				for (var i = 0; i < fieldSettings.length; i++) {
		   				var field_id = fieldSettings[i].field_id,
		   					label = fieldSettings[i].label,
		   					help_text = fieldSettings[i].help_text;

		   				if (field_id) {
		   					var field = document.getElementById(field_id);

		   					if (field) {
		   						var parent = (field_id == 'request_collaborators_') ? field.parentNode.parentNode.parentNode : field.parentNode,
			   						helpText = parent.getElementsByTagName('P');
		   					
				   				if (label) parent.getElementsByTagName('LABEL')[0].innerHTML = label;
				   				
				   				if (help_text && helpText && helpText.length) {
				   					helpText[0].innerHTML = help_text;
				   				} else {
				   					helpText = document.createElement('P');
				   					helpText.id = field_id + '_hint';
				   					helpText.innerHTML = help_text;
				   					parent.appendChild(helpText);
				   				}
		   					}

		   				}
		   			}
		   		} catch(err) {
		   			console.warn('ERROR: zg.js > setTicketFieldAttribbutes method failed execution. Consider calling this method after Help Center page is loaded.\n', err);
	   			}
	   		}
	   	}
	   	mdl.moveFormFields = function(config){ // move ticket form fields
	   		if (mdl.isTicketFormPage()) {
	   			if (config && config.length) {
					for (var i = 0; i < config.length; i++) {
						var fieldsToMove = config[i].field_classes_to_move;
						var anchorField = getField(config[i].anchor_field_class);
						var position = !!config[i].move_field_before_field;

						if (anchorField && fieldsToMove.length) {
							fieldsToMove = position ? fieldsToMove : fieldsToMove.reverse();
							for (var k = 0; k < fieldsToMove.length; k++) {
								var fieldToMove = getField(fieldsToMove[k]);
								if (fieldToMove) moveField(anchorField,fieldToMove,position);
							}
						}
					}

				} else {
					console.warn('ERROR: zg.js > moveFormFields is missing configuration\n');
				}
				function getField(fieldReference) { // get field object
					if (!fieldReference) return null;

					var field  = document.getElementsByClassName(fieldReference);

					if (fieldReference == "request_cc_emails") {
						// TODO: May need to check the field presence before handling as it appears with a delay
					} else if (fieldReference == "upload-dropzone") {
						return field = field ? field[0].parentNode : null;
					}
					return field ? field[0] : null;
				}
				function moveField(anchorField,fieldToMove,position) {
					if (position) { // insert before
						document.getElementById('new_request').insertBefore(fieldToMove, anchorField);	
					} else { // insert after
						anchorField.parentNode.insertBefore(fieldToMove, anchorField.nextSibling);
					}
				}
	   		}
		}
	   	return mdl;
}