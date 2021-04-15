﻿define('Aras/Client/Controls/Experimental/ContextMenu', [
	'dojo/_base/declare',
	'dojo/_base/connect',
	'dijit/PopupMenuItem',
	'dijit/MenuSeparator',
	'dijit/CheckedMenuItem',
	'dijit/MenuItem',
	'dijit/Menu',
	'dijit/popup',
	'Aras/Client/Controls/Experimental/MenuItem'
], function (
	declare,
	connect,
	PopupMenuItem,
	MenuSeparator,
	CheckedMenuItem,
	MenuItem,
	CMenu,
	popup,
	ArasMenuItem
) {
	return declare('Aras.Client.Controls.Experimental.ContextMenu', null, {
		menu: null,
		collectionMenu: null,
		collectionSeparator: null,
		rowId: null,
		columnIndex: null,

		constructor: function (domNode, skipBindDomNode) {
			this.skipBindDomNode = skipBindDomNode;
			this.menu = new CMenu();
			this.menu.domNode.addEventListener(
				'contextmenu',
				function (menuEvent) {
					menuEvent.preventDefault();
					menuEvent.stopPropagation();
				},
				false
			);

			this.domNode = domNode;
			if (domNode && !skipBindDomNode) {
				//there is very special code in Workflow.js which doesn't pass domNode
				//That code shows context menu itself. When that code is cleaned up it will be possible to remove this "if"
				this.menu.bindDomNode(domNode);
			}
			this.menu.startup();
			this.collectionMenu = {};
			this.collectionSeparator = {};
		},

		onItemClick: function (command, rowID, columnIndex) {
			//event click on item menu
		},

		add: function (id, text, rootMenuId, args) {
			var options = {};
			var parentMenu;
			var ItemType;
			var newItem;
			var rootItem;
			var itemProperties;
			var onClick;
			var itemIconUrl;
			var itemIconClass;

			// third and fourth arguments can be interchanged, this code provides for this situation
			// must be removed later
			if (typeof args == 'boolean') {
				options = { disable: !args };
			} else if (typeof args == 'object' && args) {
				options = args;
			} else if (typeof rootMenuId == 'object' && rootMenuId) {
				options = rootMenuId;
			}

			if (typeof rootMenuId == 'string' && rootMenuId) {
				rootItem = this.collectionMenu[rootMenuId];
			} else if (typeof args == 'string' && args) {
				rootItem = this.collectionMenu[args];
			}

			// replace menuItem  by popupMenuItem if required
			if (rootItem) {
				if (
					rootItem.item.declaredClass != 'dijit.PopupMenuBarItem' &&
					rootItem.item.declaredClass != 'dijit.PopupMenuItem'
				) {
					rootItem._replaceByPopupItem();
				}
			}

			parentMenu =
				rootItem && rootItem.item.popup ? rootItem.item.popup : this.menu;
			onClick = function (e) {
				var contextMenu = this.rootMenu;

				if (contextMenu.rowId !== null) {
					// pay attention that rowId can be not only Id of item but also its name or even an Object that have no relation to Id.
					//(e.g. we will get Object when work with LifecycleEditor or workflowEditor).
					//It can be very confusing
					var rowId = contextMenu.rowId;
					var columnIndex = contextMenu.columnIndex;

					contextMenu.rowId = null;
					contextMenu.columnIndex = null;

					if (this.customClickHandler) {
						this.customClickHandler(rowId, columnIndex);
					}

					contextMenu.onItemClick(this.id, rowId, columnIndex);
				}
			};

			if (options.checked) {
				ItemType = CheckedMenuItem;
			} else {
				ItemType = MenuItem;

				// icon customization allowed only for common menu items
				itemIconUrl = options.icon;
				itemIconClass =
					itemIconUrl || options.iconClass
						? (itemIconUrl ? 'arasMenuIcon ' : '') + (options.iconClass || '')
						: undefined;
			}

			itemProperties = {
				id: id,
				label: text || '',
				disabled: Boolean(options.disable),
				checked: Boolean(options.checked),
				defaultClickHandler: onClick,
				iconClass: itemIconClass,
				customClickHandler:
					typeof options.onClick == 'function' ? options.onClick : null,
				parentMenu: parentMenu,
				rootMenu: this
			};

			newItem = new ItemType(itemProperties);
			connect.connect(newItem, 'onClick', onClick);
			parentMenu.addChild(newItem, options.pos);

			// if "icon" parameter was passed, then explicitly set iconNode backgroundImage
			if (itemIconUrl) {
				newItem.iconNode.style.backgroundImage = 'url(' + itemIconUrl + ')';
			}

			this.collectionMenu[id] = new ArasMenuItem(newItem);
			return this.collectionMenu[id];
		},

		addRange: function (itemsArray, subMenu) {
			//itemsArray - Array,subMenu - String
			var item;
			var id;
			var i;

			for (i = 0; i < itemsArray.length; i++) {
				item = itemsArray[i];
				id = item.id || item.name;

				if (item.subMenu && item.subMenu instanceof Array) {
					this.add(id, item.name, subMenu, {
						disable: item.disable,
						icon: item.icon,
						additionalData: item.additionalData
					});
					this.addRange(item.subMenu, id);
				} else if (item.separator) {
					this.addSeparator(subMenu, item.id);
				} else {
					this.add(id, item.name, subMenu, {
						disable: item.disable,
						pos: item.pos,
						onClick: item.onClick,
						checked: item.checked,
						icon: item.icon,
						iconClass: item.iconClass
					});
				}
			}
		},

		setHide: function (id, bool) {
			this.collectionMenu[id].item.domNode.style.display = bool ? 'none' : '';
		},

		setChecked: function (id, bool) {
			this.collectionMenu[id].item.set('checked', bool);
		},

		setLabel: function (id, label) {
			this.collectionMenu[id].item.set('label', label);
		},

		setDisable: function (id, bool) {
			this.collectionMenu[id].item.set('disabled', bool);
		},

		addSeparator: function (rootMenuId, id) {
			var separator = new MenuSeparator();
			var rootItem = rootMenuId ? this.collectionMenu[rootMenuId].item : null;
			var parentMenu = rootItem && rootItem.popup ? rootItem.popup : this.menu;

			if (id) {
				separator.id = id;
			} else {
				id = separator.id;
			}
			this.collectionSeparator[id] = separator;
			parentMenu.addChild(separator);
		},

		setHideSeparator: function (id, bool) {
			this.collectionSeparator[id].domNode.style.display = bool ? 'none' : '';
		},

		getItemCount: function () {
			return this.menu.getChildren().length;
		},

		getItemById: function (id) {
			//TODO: implement appropriate class and return its instance here
			if (id) {
				return this.collectionMenu[id] ? this.collectionMenu[id] : null;
			}
		},

		removeAll: function () {
			popup.close(this.menu);
			this.menu.destroyRecursive();
			this.constructor(this.domNode, this.skipBindDomNode);
		}
	});
});
