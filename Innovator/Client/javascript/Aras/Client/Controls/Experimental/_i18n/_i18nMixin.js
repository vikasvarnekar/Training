﻿/*jslint sloppy: true, nomen: true*/
/*global define, XMLHttpRequest*/
define(['dojo/_base/config', 'dojo/i18n'], function (config, i18n) {
	var gregorianStorage = {},
		numberStorage = {},
		getLocalizationOriginal = i18n.getLocalization,
		_soapSend = function (type, locale) {
			var url =
					config.baseUrl +
					'../../HttpHandlers/LocalizationDataFormatHandler.ashx',
				xmlhttp = new XMLHttpRequest(),
				params =
					'type=' +
					encodeURIComponent(type) +
					'&locale=' +
					encodeURIComponent(locale);

			xmlhttp.open('GET', url + '?' + params, false);
			xmlhttp.setRequestHeader(
				'Content-Type',
				'application/x-www-form-urlencoded'
			);
			xmlhttp.setRequestHeader('Accept', 'application/json');
			xmlhttp.send(null);

			return xmlhttp.responseText;
		},
		_i18nMixin = {
			getLocalization: function (moduleName, bundleName, locale) {
				locale = locale ? locale.toLowerCase() : config.locale;
				switch (moduleName) {
					case 'dojo.cldr':
						switch (bundleName) {
							case 'number':
								numberStorage[locale] =
									numberStorage[locale] ||
									JSON.parse(_soapSend('Number', locale));
								return numberStorage[locale];
							case 'gregorian':
								gregorianStorage[locale] =
									gregorianStorage[locale] ||
									JSON.parse(_soapSend('Date', locale));
								return gregorianStorage[locale];
						}
						break;
					default:
						return getLocalizationOriginal(moduleName, bundleName, locale);
				}
			}
		};
	return _i18nMixin;
});
