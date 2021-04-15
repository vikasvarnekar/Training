﻿define('Aras/Client/Controls/Experimental/MenuItem', [
	'dojo/_base/declare',
	'dojo/_base/connect',
	'dijit/dijit',
	'dijit/MenuSeparator',
	'dijit/CheckedMenuItem',
	'dijit/MenuItem',
	'dijit/PopupMenuItem',
	'dijit/Menu'
], function (
	declare,
	connect,
	dijit,
	MenuSeparator,
	CheckedMenuItem,
	MenuItem,
	PopupMenuItem,
	Menu
) {
	return declare('Aras.Client.Controls.Experimental.MenuItem', null, {
		item: false,

		constructor: function (item, parent) {
			this.item = item;
			this.parent = parent;
		},

		getCheck: function () {
			if (
				'dijit.CheckedMenuItem' === this.item.declaredClass ||
				'dijit.RadioButtonMenuItem' === this.item.declaredClass
			) {
				return this.item.get('checked');
			}
		},

		getId: function () {
			return this.item.id;
		},

		getItemName: function () {
			return this.item.get('label');
		},

		getParentItem: function () {
			return parent;
		},

		isItem: function () {
			throw 'Not Implemented';
		},

		isMenu: function () {
			return 'dijit.PopupMenuItem' === this.item.declaredClass;
		},

		isMenubar: function () {
			return 'dijit.PopupMenuBarItem' === this.item.declaredClass;
		},

		setEnabled: function (bool) {
			this.item.set('disabled', !bool);
		},

		setEnableFlag: function (isEnabled) {
			this.setEnabled(isEnabled);
		},

		getItemsCount: function () {
			if (
				'dijit.PopupMenuBarItem' === this.item.declaredClass ||
				'dijit.PopupMenuItem' === this.item.declaredClass
			) {
				var children = this.item.popup.getChildren();
				return children.length;
			}
		},

		addSeparatorItem: function (pos) {
			if (
				'dijit.PopupMenuBarItem' === this.item.declaredClass ||
				'dijit.PopupMenuItem' === this.item.declaredClass
			) {
				this.item.popup.addChild(new MenuSeparator(), pos);
				return true;
			}
			return false;
		},

		add: function (id, text, subMenu, args) {
			var rootMenu = this.item.rootMenu;
			if (rootMenu && rootMenu.add) {
				return rootMenu.add(id, text, this.item.id, args);
			} else {
				return false;
			}
		},

		_getItemProperties: function () {
			return {
				id: this.item.id,
				label: this.item.label,
				disabled: this.item.disabled,
				checked: this.item.checked,
				parentMenu: this.item.parentMenu,
				defaultClickHandler: this.item.defaultClickHandler,
				customClickHandler: this.item.customClickHandler,
				rootMenu: this.item.rootMenu
			};
		},

		_replaceByPopupItem: function () {
			var parentMenu = this.item.parentMenu,
				oldIconNode = this.item.iconNode,
				menuItems = parentMenu.getChildren(),
				itemIndex,
				i,
				itemProperties = this._getItemProperties();

			for (i = 0; i < menuItems.length; i++) {
				if (this.item == menuItems[i]) {
					itemIndex = i;
					break;
				}
			}

			// destroying old menuItem
			parentMenu.removeChild(this.item);
			this.item.destroyRecursive(false);

			// creating new popupMenuItem
			itemProperties.popup = new Menu();
			this.item = new PopupMenuItem(itemProperties);

			if (oldIconNode) {
				var currentIconNode = this.item.iconNode;
				currentIconNode.parentNode.replaceChild(oldIconNode, currentIconNode);
			}

			connect.connect(this.item, 'onClick', itemProperties.defaultClickHandler);
			parentMenu.addChild(this.item, itemIndex);
		},

		addCheckItem: function (text, id, isChecked, isEnabled, pos) {
			if (
				'dijit.PopupMenuBarItem' === this.item.declaredClass ||
				'dijit.PopupMenuItem' === this.item.declaredClass
			) {
				if (dijit.byId(id)) {
					this.deleteItem(id);
				}
				this.item.popup.addChild(
					new CheckedMenuItem({
						id: id,
						label: text,
						checked: isChecked,
						disabled: !isEnabled
					}),
					pos
				);
				return true;
			}
			return false;
		},

		deleteItem: function (id) {
			if (
				'dijit.PopupMenuBarItem' === this.item.declaredClass ||
				'dijit.PopupMenuItem' === this.item.declaredClass
			) {
				var child = dijit.byId(id);
				if (child) {
					this.item.popup.removeChild(child);
					child.destroyRecursive(false);
					return true;
				}
			}
			return false;
		},

		deleteItemAt: function (pos) {
			if (
				'dijit.PopupMenuBarItem' === this.item.declaredClass ||
				'dijit.PopupMenuItem' === this.item.declaredClass
			) {
				var child = this.item.popup.getChildren()[pos];
				if (child) {
					this.item.popup.removeChild(child);
					child.destroyRecursive(false);
					return true;
				}
			}
			return false;
		},

		getItemAt: function (num) {
			if (
				'dijit.PopupMenuBarItem' === this.item.declaredClass ||
				'dijit.PopupMenuItem' === this.item.declaredClass
			) {
				var children = this.item.popup.getChildren();
				return new Aras.Client.Controls.Experimental.MenuItem(children[num]);
			}
		},

		setItemName: function (name) {
			this.setLabel(name);
		},

		setLabel: function (label) {
			this.item.set('label', label);
		},

		addItem: function (name, actionId, active, pos) {
			if (
				'dijit.PopupMenuBarItem' === this.item.declaredClass ||
				'dijit.PopupMenuItem' === this.item.declaredClass
			) {
				var item = new MenuItem({
					id: actionId,
					label: name,
					disabled: !active
				});
				this.item.popup.addChild(item, pos);
				return true;
			}
			return false;
		},

		setState: function (bool) {
			if (
				'dijit.CheckedMenuItem' === this.item.declaredClass ||
				'dijit.RadioButtonMenuItem' === this.item.declaredClass ||
				'Controls.RadioButtonMenuItem' === this.item.declaredClass
			) {
				this.item.set('checked', bool);
				return true;
			}
			return false;
		}
	});
});
