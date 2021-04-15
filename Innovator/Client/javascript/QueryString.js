﻿// (c) Copyright by Aras Corporation, 2004-2007.

/*----------------------------------------
 * FileName: QueryString.js
 *
 * Purpose:
 * This file will allow us replace Server-Side working with Query String with
 * Client-Side one.
 * Functionality emulates ASP Request.QueryString
 *
 * Currently supported browsers: MS IE 5 and higher
 */

function QueryString(variable) {
	/*----------------------------------------
	 * QueryString
	 *
	 * Purpose:
	 * Allows to retrieve the HTTP QUERY_STRING variable by name.
	 * Also: location.search emulation is allowed when the currentl html is in frame (see LocationSearches behavior) or in modalDialog.
	 * Unparsed QueryString available if you don't specify parameter
	 *
	 * Arguments:
	 * variable - string representing the name of variable you want to retrieve
	 *
	 */

	var parsedData = QueryString.parsedData; //stores parsed query string
	//initialized on first request to QueryString

	if (!this.locationSearchEmulated) {
		try {
			//parent.LocationSearches MUST be hash: frame.id -> frame.location.search.
			//Thus the frame url may be without parameters (just specify them in the hash).
			var key = (document.defaultView || document.parentWindow).frameElement.id;
			if (parent.LocationSearches && parent.LocationSearches[key]) {
				this.locationSearchEmulated = parent.LocationSearches[key];
				this.locationSearchEmulated = this.locationSearchEmulated.substr(1); //remove '?'
			}
			if (
				!this.locationSearchEmulated &&
				window.dialogArguments &&
				window.dialogArguments.LocationSearch
			) {
				this.locationSearchEmulated = window.dialogArguments.LocationSearch;
			}
		} catch (ex) {}

		//if modal dialog then check: is LocationSearch specified in dialogArguments.
		if (!this.locationSearchEmulated) {
			var das = window.dialogArguments;
			if (das && das.LocationSearch) {
				this.locationSearchEmulated = das.LocationSearch;
			}
		}

		if (!this.locationSearchEmulated) {
			this.locationSearchEmulated = 'empty';
		}
	}

	if (!parsedData) {
		parsedData = {};
		QueryString.parsedData = parsedData;

		var searchStr =
			this.locationSearchEmulated != 'empty'
				? this.locationSearchEmulated
				: document.location.search.substr(1);
		var searchArr = searchStr.split('&');
		for (var i = 0; i < searchArr.length; i++) {
			var variableString = searchArr[i];
			var firstEqSignPos = variableString.indexOf('=');
			var variableName;
			var variableValue;

			if (firstEqSignPos == -1) {
				variableName = variableString;
				variableValue = '';
			} else if (firstEqSignPos === 0) {
				continue;
			} else {
				variableName = variableString.substring(0, firstEqSignPos);
				variableValue = unescape(
					variableString.substr(firstEqSignPos + 1)
				).replace(/\+/g, ' ');
			}

			var storedValues = parsedData[variableName];
			if (storedValues === undefined) {
				storedValues = [];
				storedValues.toString = function () {
					return this.join(', ');
				};
				parsedData[variableName] = storedValues;
			}

			storedValues.push(variableValue);
		}
	}

	if (variable === undefined) {
		return document.location.search.substr(1);
	} else {
		var res = parsedData[variable];
		if (res === undefined) {
			res = '';
		}
		return res;
	}
}

QueryString();
//a call to initialize QueryString
