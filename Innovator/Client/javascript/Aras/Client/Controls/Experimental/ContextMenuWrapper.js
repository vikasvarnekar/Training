﻿function ContextMenuWrapper(domNode, skipBindDomNode) {
	this.hiddenItems = [];

	this.skipBindDomNode = skipBindDomNode;
	this.menu = new ArasModules.ContextMenu(domNode);
	this.menu.on('contextmenu', function (commandId, menuEvent) {
		menuEvent.preventDefault();
		menuEvent.stopPropagation();
	});
	// this stub is necessary in order to prevent console error, which appears when context menu wrapper is used with old relationship grid control
	// dojo's grid calls onCancel method of dojo's context menu, but new menu control from this wrapper do not have onCancel method.
	this.menu.onCancel = function () {};

	this.collectionMenu = {};
	this.collectionSeparator = {};
}

ContextMenuWrapper.prototype = {
	menu: null,
	collectionMenu: null,
	collectionSeparator: null,
	rowId: null,
	columnIndex: null,

	onItemClick: function (command, rowID, columnIndex) {
		//event click on item menu
	},

	add: function (id, text, rootMenuId, args) {
		let options = {};
		let rootItem;
		let itemProperties;

		// third and fourth arguments can be interchanged, this code provides for this situation
		// must be removed later
		if (typeof args === 'boolean') {
			options = { disable: !args };
		} else if (typeof args === 'object' && args) {
			options = args;
		} else if (typeof rootMenuId === 'object' && rootMenuId) {
			options = rootMenuId;
		}

		itemProperties = {
			label: text || '',
			disabled: Boolean(options.disable),
			icon: options.icon,
			additionalData: options.additionalData
		};

		if (typeof rootMenuId === 'string' && rootMenuId) {
			rootItem = this.collectionMenu[rootMenuId];
		} else if (typeof args === 'string' && args) {
			rootItem = this.collectionMenu[args];
		}

		if (rootItem) {
			if (!rootItem.children) {
				rootItem.children = [];
			}
			rootItem.children.push(id);
			itemProperties.parentId = rootMenuId;
		} else {
			this.menu.roots.push(id);
		}

		this.menu.data.set(id, itemProperties);
		this.collectionMenu[id] = this.menu.data.get(id);
		return this.collectionMenu[id];
	},

	addRange: function (itemsArray, subMenu) {
		//itemsArray - Array,subMenu - String
		itemsArray.forEach(
			function (item) {
				const id = item.id || item.name;
				if (item.subMenu && Array.isArray(item.subMenu)) {
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
						icon: item.icon,
						additionalData: item.additionalData
					});
				}
			}.bind(this)
		);
	},

	setHide: function (id, bool) {
		let item;
		if (bool) {
			item = this.menu.data.get(id);
			if (!item) {
				return;
			}
			this.hiddenItems[id] = item;
			const parentId = item.parentId;
			this.menu.data.delete(id);
			if (parentId) {
				const parentElement = this.menu.data.get(parentId);
				const childIndex = parentElement.children.indexOf(id);
				parentElement.children.splice(childIndex, 1);
				if (!parentElement.children.length) {
					delete parentElement.children;
				}
			}
		} else {
			item = this.hiddenItems[id];
			if (!item) {
				return;
			}
			this.menu.data.set(id, item);
		}
	},

	setChecked: function (id, bool) {
		var item = this.menu.data.get(id);
		if (item) {
			item.checked = bool;
		}
	},

	setLabel: function (id, label) {
		var item = this.menu.data.get(id);
		if (item) {
			item.label = label;
		}
	},

	setDisable: function (id, bool) {
		var item = this.menu.data.get(id);
		if (item) {
			item.disabled = bool;
		}
	},

	addSeparator: function (rootMenuId, id) {
		const separator = { type: 'separator' };
		const rootItem = rootMenuId ? this.collectionMenu[rootMenuId] : null;
		const parentMenu = rootItem && rootItem.popup ? rootItem.popup : this.menu;

		if (id) {
			separator.id = id;
		} else {
			id = separator.id;
		}

		if (rootItem) {
			if (!rootItem.children) {
				rootItem.children = [];
			}
			rootItem.children.push(id);
		} else {
			parentMenu.roots.push(id);
		}

		this.collectionSeparator[id] = separator;
		parentMenu.data.set(id, separator);
	},

	setHideSeparator: function (id, bool) {
		this.setHide(id, bool);
	},

	getItemCount: function () {
		return this.menu.data.size;
	},

	getItemById: function (id) {
		//TODO: implement appropriate class and return its instance here
		if (id) {
			return this.collectionMenu[id] ? this.collectionMenu[id] : null;
		}
	},

	removeAll: function () {
		this.collectionMenu = {};
		this.collectionSeparator = {};
		this.menu.roots = [];
		this.menu.data.clear();
	},

	show: function (coords, args) {
		var data = this.menu.data;
		this.menu.roots = this.menu.roots.filter(function (id) {
			return data.get(id);
		});
		this.menu.show(coords, args);
	}
};
