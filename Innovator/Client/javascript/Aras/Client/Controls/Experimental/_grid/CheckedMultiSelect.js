﻿/*global define*/
define(['dojo/_base/declare', 'dojox/form/CheckedMultiSelect'], function (
	declare,
	CheckedMultiSelect
) {
	return declare(
		'Aras.Client.Controls.Experimental._grid.CheckedMultiSelect',
		CheckedMultiSelect,
		{
			maxHeight: -1,
			multiple: true,
			dropDown: true,
			sortByLabel: false,

			buildRendering: function () {
				this.inherited(arguments);
				this.dropDownMenu.domNode.style.overflowY = 'hidden';
				Object.defineProperty(this, 'displayedValue', {
					get: function () {
						return this.domNode.textContent.replace('▼', '');
					}
				});
			}
		}
	);
});
