﻿define(['dojo/_base/declare', 'dijit/RadioMenuItem'], function (
	declare,
	RadioMenuItem
) {
	return declare('Controls.RadioButtonMenuItem', RadioMenuItem, {
		destroyRecursive: function (/*Boolean?*/ preserveDom) {
			if (this._currentlyChecked[this.group] == this) {
				this._currentlyChecked[this.group] = null;
			}
			this.inherited(arguments);
		}
	});
});
