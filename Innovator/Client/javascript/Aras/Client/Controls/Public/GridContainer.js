﻿define([
	'dojo/_base/declare',
	'dojo/_base/connect',
	'Aras/Client/Controls/Experimental/DataGrid',
	'Aras/Client/Controls/Experimental/GridModules',
	'dojo/_base/config',
	'dijit/focus',
	'dojo/data/ItemFileWriteStore',
	'Aras/Client/Controls/Experimental/TypeEditCell',
	'dijit/form/CheckBox',
	'dojo/aspect',
	'dojo/on',
	'dijit/popup',
	'Aras/Client/Controls/Experimental/ContextMenu',
	'Aras/Client/Controls/Public/Cell'
], function (
	declare,
	connect,
	DataGrid,
	GridModules,
	config,
	focusUtil,
	ItemFileWriteStore,
	TypeEditCell,
	CheckBox,
	aspect,
	on,
	popup,
	ContextMenu,
	Cell
) {
	var privateProps = {};

	return declare('Aras.Client.Controls.Public.GridContainer', null, {
		//don't add property here without "_Experimental" - it will be shown as field in documentation, properties are defined in constructor using defineProperties
		grid_Experimental: null,
		contexMenu_Experimental: null,
		headerContexMenu_Experimental: null,

		constructor: function (args) {
			/// <summary>
			/// Container for grid control.
			/// </summary>
			var properties = {
				bgColor: {
					get: function () {
						/// <summary>
						/// The default cell bgcolor.
						/// </summary>
						/// <returns>string</returns>
						return privateProps[self.propsId_Experimental]
							._bgColor_Experimental;
					},
					set: function (value) {
						if (value) {
							privateProps[
								self.propsId_Experimental
							]._bgColor_Experimental = value;
						}
					}
				},
				BGColor: {
					get: function () {
						return self.bgColor;
					},
					set: function (value) {
						self.bgColor = value;
					}
				},
				bgInvert: {
					get: function () {
						/// <summary>
						/// Enable background row color inverting when selected. Default is true.
						/// </summary>
						/// <returns>bool</returns>
						return privateProps[self.propsId_Experimental]
							._bgInvert_Experimental;
					},
					set: function (value) {
						privateProps[
							self.propsId_Experimental
						]._bgInvert_Experimental = value;
					}
				},
				BGInvert: {
					get: function () {
						return self.bgInvert;
					},
					set: function (value) {
						self.bgInvert = value;
					}
				},
				borderGColor: {
					get: function () {
						/// <summary>
						/// Cell border color.
						/// </summary>
						/// <returns>bool</returns>
						return privateProps[self.propsId_Experimental]
							._borderGColor_Experimental;
					},
					set: function (value) {
						if (value) {
							privateProps[
								self.propsId_Experimental
							]._borderGColor_Experimental = value;
						}
					}
				},
				BorderGColor: {
					get: function () {
						return self.borderGColor;
					},
					set: function (value) {
						self.borderGColor = value;
					}
				},
				delimeter: {
					get: function () {
						/// <summary>
						/// The delimiter character.
						/// </summary>
						/// <returns>string</returns>
						return privateProps[self.propsId_Experimental]
							._delimeter_Experimental;
					},
					set: function (value) {
						if (value) {
							privateProps[
								self.propsId_Experimental
							]._delimeter_Experimental = value;
						}
					}
				},
				Delimeter: {
					get: function () {
						return self.delimeter;
					},
					set: function (value) {
						self.delimeter = value;
					}
				},
				font: {
					get: function () {
						/// <summary>
						/// The default text font.
						/// </summary>
						/// <returns>string</returns>
						return privateProps[self.propsId_Experimental]._font_Experimental;
					},
					set: function (value) {
						privateProps[self.propsId_Experimental]._font_Experimental = value;
					}
				},
				Font: {
					get: function () {
						return self.font;
					},
					set: function (value) {
						self.font = value;
					}
				},
				rowHeight: {
					get: function () {
						/// <summary>
						/// Specifies the default row height in pixels. Default is 26.
						/// </summary>
						/// <returns>string</returns>
						return self.grid_Experimental.rowHeight;
					},
					set: function (value) {
						if (value >= 0) {
							self.grid_Experimental.rowHeight = value;
						}
					}
				},
				RowHeight: {
					get: function () {
						return self.rowHeight;
					},
					set: function (value) {
						self.rowHeight = value;
					}
				} //don't use "," after the last property all over the file, e.g, here because documentation will not be built
			};

			//this variable is used to build documentation in ExtractJSApiDocs.wsf file
			if (typeof arasDocumentationHelper !== 'undefined') {
				arasDocumentationHelper.registerProperties(properties);
				arasDocumentationHelper.registerEvents(
					'gridLinkClick, gridMenuClick, gridMenuInit, gridClick, gridDoubleClick, gridKeyPress, gridXmlLoaded, gridRowSelect, gridEditCell, gridSelectCell, gridSort'
				);
				return;
			}

			this.propsId_Experimental =
				args && args.connectId ? args.connectId : 'gridTD';
			var counter = 1;
			while (privateProps[this.propsId_Experimental]) {
				this.propsId_Experimental = args.connectId + counter;
				counter = counter + 1;
			}

			var self = this;
			for (var ar in args) {
				this[ar] = args[ar];
			}

			privateProps[this.propsId_Experimental] = {
				_listsById: [],
				ColumnDraggable: true,
				Editable: false,
				rowHeight: 26,

				_sortManager_Experimental: {
					sortProps: [],
					propertyById: {},
					comparatorMap: {}
				},
				_bgColor_Experimental: null,
				_bgInvert_Experimental: true,
				_borderGColor_Experimental: null,
				_delimeter_Experimental: '$',
				_font_Experimental: null,
				_newRowsCounter: 0,
				_externalCellManagers: {},
				_updateTimer: null
				//don't use "," after the last property all over the file, e.g, here because documentation will not be built
			};

			Object.defineProperties(this, properties);

			this.getAllItemIDs = this.getAllItemIds;
			this.getSelectedItemIds = this.getSelectedItemIDs;
			this.getSelectedId = this.getSelectedID;
			this.getXML = this.getXml;

			for (var method in this) {
				if (typeof this[method] === 'function') {
					var methodName = method.substr(0, 1).toUpperCase() + method.substr(1);
					this[methodName] = this[method];
				}
			}

			var store = this._newStore_Experimental();
			var defaultRowHeight =
				args && args.customRowHeight ? args.customRowHeight : 26;
			var style = (args ? args.style : null) || 'height: 100%;';
			var dataGridOptions = {
				store: store,
				rowHeight: defaultRowHeight,
				columnReordering:
					privateProps[this.propsId_Experimental].ColumnDraggable,
				style: style
			};
			if (args && args.id) {
				dataGridOptions.id = args.id;
			}

			this.grid_Experimental = new Aras.Client.Controls.Experimental.DataGrid(
				dataGridOptions
			);
			GridModules.initClearData(this.grid_Experimental);

			//Create a context menu and bind that to "top" level grid node.
			//This way we may prevent bubbling of oncontextmenu event from lower level parts of grid.
			this.contexMenu_Experimental = new ContextMenu(
				this.grid_Experimental.viewsNode
			);

			var headerNode = this.grid_Experimental.viewsHeaderNode;
			this.headerContexMenu_Experimental = new ContextMenu(headerNode, true);

			this.grid_Experimental.headerMenu = this.headerContexMenu_Experimental.menu;
			this._headerContextMenuHandlerId = on(
				headerNode,
				'contextmenu',
				function (e) {
					// do not stop event propagation and let standard browser context menu appear if click wasn't on a cell
					if (e.cell) {
						e.stopPropagation();
						e.preventDefault();
						self.headerContexMenu_Experimental.menu._openMyself({
							target: headerNode,
							coords: {
								x: e.pageX,
								y: e.pageY
							}
						});
					}
				}
			);

			this.connectId_Experimental =
				args && args.connectId ? args.connectId : 'gridTD';

			if (args && args.connectNode) {
				args.connectNode.appendChild(this.grid_Experimental.domNode);
			} else {
				document
					.getElementById(this.connectId_Experimental)
					.appendChild(this.grid_Experimental.domNode);
			}

			this.grid_Experimental.startup();
			this.items_Experimental = GridModules.items(this);
			this.columns_Experimental = GridModules.columns(this.grid_Experimental);
			this.inputRow = GridModules.inputRow(this.grid_Experimental);
			this.edit_Experimental = GridModules.edit(this.grid_Experimental);
			this.selection_Experimental = GridModules.selection(
				this.grid_Experimental
			);
			this.focus_Experimental = GridModules.focus(this.grid_Experimental);
			this.formatter_Experimental = GridModules.formatter(this);
			this.redline_Experimental = GridModules.redline(this);
			this.redline_Experimental.initialize();
			this.grid_Experimental.parentContainer = this;

			//temporary commented out because of dojo.arasContext is undefined
			GridModules.initTextDirection(
				this.grid_Experimental.domNode,
				dojoConfig.arasContext.languageDirection
			);

			// Connect to Grid Events
			var object = this;

			this.grid_Experimental.canEdit = function (inCell, indexRow) {
				if (
					inCell.externalWidget &&
					inCell.externalWidget.functionalFlags.edit
				) {
					return false;
				} else {
					var rowId = object.grid_Experimental.store.getIdentity(
						object.grid_Experimental.getItem(indexRow)
					);
					return object.canEdit_Experimental(rowId, inCell.field);
				}
			};

			connect.connect(
				this.contexMenu_Experimental,
				'onItemClick',
				this,
				function (command, rowID, columnIndex) {
					this.gridMenuClick(command, rowID, columnIndex);
				}
			);
			connect.connect(
				this.headerContexMenu_Experimental,
				'onItemClick',
				this,
				function (command, rowID, columnIndex) {
					this.gridHeaderMenuClick_Experimental(command, rowID, columnIndex);
				}
			);

			var eventResize = connect.connect(
				window,
				'onresize',
				this.grid_Experimental,
				'resize'
			);
			connect.connect(this, 'destroy_Experimental', function () {
				connect.disconnect(eventResize);
			});

			//The 'onHeaderEvent' event handler is needed for binding header context menu after the 'HeaderCellContextMenu' event

			connect.connect(
				this.grid_Experimental,
				'onHeaderEvent',
				this,
				GridModules.events.onHeaderEvent
			);
			connect.connect(
				this.grid_Experimental,
				'onRowDblClick',
				this,
				GridModules.events.onRowDblClick
			);
			connect.connect(
				this.grid_Experimental,
				'onSelected',
				this,
				GridModules.events.onSelected
			);
			connect.connect(
				this.grid_Experimental,
				'onMoveColumn',
				this,
				GridModules.events.onMoveColumn
			);
			connect.connect(
				this.grid_Experimental,
				'onRowContextMenu',
				this,
				GridModules.events.onRowContextMenu
			);
			connect.connect(
				this.grid_Experimental,
				'onRowClick',
				this,
				GridModules.events.onRowClick
			);
			connect.connect(
				this.grid_Experimental,
				'gridLinkClick',
				this,
				GridModules.events.gridLinkClick
			);
			connect.connect(
				this.grid_Experimental,
				'onStartEdit',
				this,
				GridModules.events.onStartEdit
			);
			connect.connect(
				this.grid_Experimental,
				'onApplyCellEdit',
				this,
				GridModules.events.onApplyCellEdit
			);
			connect.connect(
				this.grid_Experimental,
				'onCancelEdit',
				this,
				GridModules.events.onCancelEdit
			);

			aspect.before(
				this.grid_Experimental,
				'dokeydown',
				GridModules.events.dokeydown.bind(this)
			);

			connect.connect(
				this.grid_Experimental,
				'onFocusInputRow',
				this,
				GridModules.events.onFocusInputRow
			);
			connect.connect(this.grid_Experimental, 'onCellFocus', function (
				cellLayout,
				rowIndex
			) {
				var cell = self.cells(self.getRowId(rowIndex), cellLayout.index);
				self.gridSelectCell(cell);
			});
			connect.connect(
				this.grid_Experimental,
				'onChangeInputRow',
				this,
				GridModules.events.onChangeInputRow
			);
			connect.connect(
				this.grid_Experimental,
				'onInputHelperShow',
				this,
				GridModules.events.onInputHelperShow
			);
			connect.connect(
				this.grid_Experimental,
				'onStartSearch',
				this,
				GridModules.events.onStartSearch
			);
			connect.connect(this.grid_Experimental, 'onSort_Dg', function (
				columnIndex,
				asc,
				savedOrder
			) {
				var preventDefault = self.gridSort(columnIndex, asc, savedOrder);

				return preventDefault;
			});
			this.grid_Experimental.onBlur = GridModules.events.onBlur;
			this.grid_Experimental.validateCell = this.validateCell_Experimental;

			//+++ replace standard sorting
			this.grid_Experimental.getSortProps = function () {
				return privateProps[object.propsId_Experimental]
					._sortManager_Experimental.sortProps;
			};

			aspect.before(this.grid_Experimental, 'onHeaderCellClick', function (e) {
				privateProps[
					object.propsId_Experimental
				]._sortManager_Experimental.ctrlKey = e.ctrlKey || e.metaKey;
				this.parentContainer.dropNewRowMarkers();
			});

			this.grid_Experimental.setSortIndex = function (columnIndex, asc) {
				var sortManager =
						privateProps[object.propsId_Experimental]._sortManager_Experimental,
					sortProperties = sortManager.sortProps,
					isDefaultPrevented = false,
					i;

				if (columnIndex !== undefined) {
					var sortByDiscending = this.prepareColumnForSort(columnIndex, asc);

					isDefaultPrevented = this.onSort_Dg(
						columnIndex,
						!sortByDiscending,
						sortManager.ctrlKey
					);
				}

				if (sortProperties.length && !isDefaultPrevented) {
					var selectedItems = this.selection.getSelected();

					this.selection.clear();
					this.sort();
					this.update();

					for (i = 0; i < selectedItems.length; i++) {
						this.selection.addToSelection(selectedItems[i]);
					}
				}
			};

			this.grid_Experimental.prepareColumnForSort = function (
				columnIndex,
				asc,
				forceCtrl
			) {
				var sortManager =
						privateProps[object.propsId_Experimental]._sortManager_Experimental,
					sortProperties = sortManager.sortProps,
					i,
					sortByDiscending;
				if (columnIndex !== undefined) {
					var columnId = this.nameColumns[columnIndex];
					var existingProperty = sortManager.propertyById[columnId];
					sortByDiscending =
						asc !== undefined
							? !asc
							: existingProperty
							? !existingProperty.descending
							: false;

					if (!sortProperties.length) {
						sortProperties.push({
							attribute: '_newRowMarker',
							descending: false
						});
						sortProperties.push({ attribute: 'uniqueId', descending: false });
					}

					if (!sortManager.ctrlKey && !forceCtrl) {
						sortProperties.splice(1, sortProperties.length - 2, {
							attribute: columnId,
							descending: sortByDiscending
						});
					} else {
						if (existingProperty) {
							existingProperty.descending = sortByDiscending;
						} else {
							sortProperties.splice(sortProperties.length - 1, 0, {
								attribute: columnId,
								descending: sortByDiscending
							});
						}
					}

					sortManager.propertyById = {};
					for (i = 1; i < sortProperties.length - 1; i++) {
						sortManager.propertyById[sortProperties[i].attribute] =
							sortProperties[i];
					}

					if (!sortManager.comparatorMap[columnId]) {
						sortManager.comparatorMap[columnId] = function (a, b) {
							var r = -1;
							if (a === null) {
								a = undefined;
							}
							if (b === null) {
								b = undefined;
							}
							if (a == b) {
								r = 0;
							} else {
								if (typeof a == 'string') {
									a = a.toUpperCase();
								}
								if (typeof b == 'string') {
									b = b.toUpperCase();
								}
								if (a > b || a === null) {
									r = 1;
								}
							}
							return r; //int {-1,0,1}
						};
					}
				}
				return sortByDiscending;
			};

			aspect.after(this.grid_Experimental, 'buildViews', function () {
				//todo: private "_getHeaderContent" method is overwritten here. Need to find a better option instead of "private" method change.
				var sortManager =
					privateProps[object.propsId_Experimental]._sortManager_Experimental;

				object.grid_Experimental.views.views[0]._getHeaderContent = function (
					inCell
				) {
					var columnName = inCell.name || inCell.grid.getCellName(inCell);
					var columnId = inCell.field;
					var sortProperty = sortManager.propertyById[columnId];
					var isEditableMode =
						privateProps[object.propsId_Experimental].Editable;
					var gridContentNode =
						object.grid_Experimental.views.views[0].contentNode;
					if (sortProperty) {
						inCell.customClasses.push('dojoGridSelected');
					}
					if (gridContentNode) {
						gridContentNode.classList.toggle(
							'dojoGridEditable',
							isEditableMode
						);
					}
					return object.grid_Experimental.getColumnHeaderHtml(
						columnName,
						sortProperty
					);
				};
			});
			//--- replace standard sorting

			aspect.after(this.grid_Experimental, 'dokeydown', function (und, event) {
				var isDown = event[0].key == 'Down';
				if (this.selection && (isDown || event[0].key == 'Up')) {
					var selectedIndex = this.selection.selectedIndex;
					if (selectedIndex != -1) {
						var newIndex = -1;
						var cellIndex = this.focus.cell ? this.focus.cell.index : 0;
						if (!isDown) {
							newIndex =
								selectedIndex !== 0 ? selectedIndex - 1 : selectedIndex;
						} else {
							newIndex =
								this.rowCount - 1 != selectedIndex
									? selectedIndex + 1
									: selectedIndex;
						}
						this.selection.clear();
						this.focus.setFocusIndex(newIndex, cellIndex);
						this.selection.setSelected(newIndex, true);
					}
				}
			});

			this.grid_Experimental.getColumnHeaderHtml = function (
				columnName,
				sortProperty
			) {
				if (/^\s+$/.test(columnName)) {
					columnName = ' ';
				}

				if (window.customDojoGridStyle) {
					var gridId = this.parentContainer.connectId_Experimental;
					var supportGridIds = window.customDojoGridStyle.supportGridIds;
					var customGetColumnHeaderHtml =
						window.customDojoGridStyle.getColumnHeaderHtml;
					if (
						supportGridIds.indexOf(gridId) > -1 &&
						customGetColumnHeaderHtml
					) {
						return customGetColumnHeaderHtml(columnName, sortProperty);
					}
				}

				var dojoxGridSortNode = document.createElement('div');
				dojoxGridSortNode.className = 'dojoxGridSortNode';
				if (sortProperty) {
					dojoxGridSortNode.className += !sortProperty.descending
						? ' dojoxGridSortUp'
						: ' dojoxGridSortDown';

					var dojoxGridArrowButtonChar = document.createElement('div');
					dojoxGridArrowButtonChar.className = 'dojoxGridArrowButtonChar';
					dojoxGridArrowButtonChar.textContent = !sortProperty.descending
						? '&#9650;'
						: '&#9660;';

					var dojoxGridColCaption = document.createElement('div');
					dojoxGridColCaption.className = 'dojoxGridColCaption';
					dojoxGridColCaption.textContent = columnName;

					var dojoxGridArrowButtonNode = document.createElement('span');
					dojoxGridArrowButtonNode.className = 'dojoxGridArrowButtonNode';
					dojoxGridArrowButtonNode.setAttribute('role', 'presentation');

					dojoxGridColCaption.appendChild(dojoxGridArrowButtonNode);
					dojoxGridSortNode.appendChild(dojoxGridArrowButtonChar);
					dojoxGridSortNode.appendChild(dojoxGridColCaption);
					return dojoxGridSortNode.outerHTML;
				} else {
					dojoxGridSortNode.textContent = columnName;
					return dojoxGridSortNode.outerHTML;
				}
			};

			//workaround for IR-038796
			var inputElement = null;
			var firstPressedChar = '';
			var tabPress = false;

			var cursorInterval;
			var cursorStartTime;
			function setCorrectCursorPosition() {
				cursorStartTime = Date.now();
				clearInterval(cursorInterval);
				cursorInterval = setInterval(function () {
					if (
						document.activeElement &&
						document.activeElement.value &&
						document.activeElement.type === 'text'
					) {
						document.activeElement.selectionStart = document.activeElement.selectionEnd =
							document.activeElement.value.length;
					}
					if (Date.now() - cursorStartTime > 600) {
						clearInterval(cursorInterval);
					}
				}, 30);
			}

			document.addEventListener(
				'click',
				function () {
					firstPressedChar = '';
					tabPress = false;
				},
				true
			);

			document.addEventListener(
				'focus',
				function () {
					if (!tabPress) {
						return;
					}
					if (
						document.activeElement.tagName === 'INPUT' &&
						!document.activeElement.readOnly
					) {
						if (firstPressedChar) {
							document.activeElement.value =
								document.activeElement.value + firstPressedChar;
							tabPress = false;
						} else {
							inputElement = document.activeElement;
						}
					}
				},
				true
			);

			document.addEventListener(
				'keyup',
				function (e) {
					if (!tabPress) {
						return;
					}
					var isPrintableChar = String.fromCharCode(e.keyCode).match(
						/^(?!\r\n|\r|\n|\t)[\w\s]*$/g
					);
					if (isPrintableChar) {
						if (inputElement) {
							document.activeElement.value =
								document.activeElement.value + e.key;
							tabPress = false;
						} else {
							firstPressedChar += e.key;
						}
					}
				},
				true
			);

			document.addEventListener(
				'input',
				function (e) {
					if (!tabPress || e.target.readOnly) {
						return;
					}
					tabPress = false;
				},
				true
			);

			document.addEventListener(
				'keydown',
				function (e) {
					if (e.key === 'Tab') {
						tabPress = true;
						inputElement = null;
						firstPressedChar = '';
						if (aras.Browser.isIe()) {
							setCorrectCursorPosition();
						}
					}
				},
				true
			);
		},

		// public events
		gridLinkClick: function GridContainerPublicgrid_ExperimentalLinkClick(
			link
		) {
			/// <summary>
			/// Called when any Hyperlink in grid is clicked.
			/// </summary>
			/// <param name="link" type="string"></param>
		},

		gridMenuClick: function GridContainerPublicgrid_ExperimentalMenuClick(
			menuItem,
			rowId,
			columnIndex
		) {
			//TODO: columnIndex parameter doesn't work
			/// <summary>
			/// Occurs when a menu item is clicked.
			/// </summary>
			/// <param name="menuItem" type="string"></param>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
		},

		gridMenuInit: function GridContainerPublicgrid_ExperimentalMenuInit(
			rowId,
			columnIndex
		) {
			//TODO: now always returns true
			/// <summary>
			/// Occurs before menu is shown.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>bool</returns>
			return true;
		},

		gridClick: function GridContainerPublicgrid_ExperimentalClick(
			rowId,
			columnIndex
		) {
			/// <summary>
			/// Occurs when the mouse pointer is over the grid cell and a mouse button is pressed.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
		},

		gridDoubleClick: function GridContainerPublicgrid_ExperimentalDoubleClick(
			rowId,
			columnIndex
		) {
			/// <summary>
			/// Occurs when any item in grid is double clicked.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
		},

		gridKeyPress: function GridContainerPublicgrid_ExperimentalKeyPress(key) {
			//TODO: should return object
			/// <summary>
			/// Occurs when a key is pressed.
			/// </summary>
			/// <param name="key" type="[Object, KeyboardEvent]"></param>
			/// <returns>object</returns>
			var keyCode = key.keyCode;
			if (13 === keyCode && focusUtil.curNode) {
				focusUtil.curNode.blur();
			}
		},

		gridXmlLoaded: function GridContainerPublicgrid_ExperimentalXmlLoaded() {
			/// <summary>
			/// Occurs when XML content is loaded and parsed.
			/// </summary>
		},

		gridRowSelect: function GridContainerPublicgrid_ExperimentalRowSelect(
			rowId,
			multi
		) {
			//TODO: parameter multi doesn't work
			/// <summary>
			/// Occurs before any row becomes selected.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="multi" type="bool"></param>
		},

		gridEditCell: function GridContainerPublicgrid_ExperimentalEditCell(
			type,
			rowId,
			columnIndex
		) {
			//TODO: should return object
			//TODO: 10 - Tab key pressed, 21 - Enter key pressed (perhaps now user won't click Enter because Enter in .NET finishes editing of cell and start editing of the cell below, but in .js Enter just finishes editing. So we can implement this if it need to change onEnter event in .js)
			/// <summary>
			/// Calls when cell edit state is changed.
			/// </summary>
			/// <param name="type" type="int">
			/// 0 - before the cell is edited;
			/// 1 - the cell value is changed, only for checkboxes
			/// 2 - the cell edit is finished.
			/// </param>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>object</returns>
		},

		gridSelectCell: function GridContainerPublicgrid_ExperimentalSelectCell(
			cell
		) {
			/// <summary>
			/// Occurs when a cell is selected in UI.
			/// </summary>
			/// <param name="cell" type="Aras.Client.Controls.Public.Cell"></param>
		},

		gridSort: function GridContainerPublicgrid_ExperimentalSort(
			columnIndex,
			asc,
			savedOrder
		) {
			/// <summary>
			/// Occurs when column is sorted.
			/// </summary>
			/// <param name="columnIndex" type="int"></param>
			/// <param name="asc" type="bool"></param>
			/// <param name="savedOrder" type="bool"></param>
		},

		addRow: function GridContainerPublic_addRow(
			newId,
			text,
			skipImmediateUpdate
		) {
			/// <summary>
			/// Adds a new row to the table.
			/// </summary>
			/// <param name="newId" type="string"></param>
			/// <param name="text" type="string"></param>
			this.addRow_Experimental(
				newId,
				text,
				skipImmediateUpdate === undefined ? true : Boolean(skipImmediateUpdate)
			);
		},

		addXMLRows: function GridContainerPublic_addXMLRows(doc) {
			/// <summary>
			/// Adds new rows loading information from xml document.
			/// </summary>
			/// <param name="doc" type="string"></param>
			var dom = new XmlDocument(),
				i;

			dom.loadXML(doc);
			var listsNodes = dom.selectNodes('./table/list');
			for (i = 0; i < listsNodes.length; i = i + 1) {
				var listNode = listsNodes[i];
				var options = [],
					optionsLabels = [],
					listItemsNodes = listNode.selectNodes('listitem');
				for (var j = 0; j < listItemsNodes.length; j = j + 1) {
					var tempOption = listItemsNodes[j].getAttribute('value');
					var tempOptionsLabel = listItemsNodes[j].getAttribute('label');

					options.push(tempOption);
					optionsLabels.push(tempOptionsLabel);
				}
				privateProps[this.propsId_Experimental]._listsById[
					listNode.getAttribute('id')
				] = { labels: optionsLabels, values: options };
			}

			//TODO: perhaps need to move to exp. grid to speed up performance, but then need to test all places where NOEDIT was (we'll change behavior of exp. grid so)
			var columnNodes = dom.selectNodes('./table/columns/column');
			var thNodes = dom.selectNodes('./table/thead/th');
			if (columnNodes.length === thNodes.length) {
				for (i = 0; i < columnNodes.length; i = i + 1) {
					if (columnNodes[i].getAttribute('edit') === 'NOEDIT') {
						var columnId =
							columnNodes[i].getAttribute('colname') || thNodes[i].text;
						var columnIndex = this.getColumnIndex(columnId);
						this.grid_Experimental.getCell(columnIndex).editable = false;
					}
				}
			}

			this.addXMLRows_Experimental(doc);
		},

		cells: function GridContainerPublic_cells(rowId, columnIndex) {
			//TODO: "Special row ids: "header_row", "input_row"." doesn't work.
			/// <summary>
			/// Get cell object to manipulate directly with its properties. Special row ids: "header_row", "input_row".
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>Aras.Client.Controls.Public.Cell</returns>
			return this.cells_Experimental(rowId, columnIndex, false);
		},

		cells_Experimental: function GridContainerPublic_cells_Experimental(
			rowId,
			columnIndex,
			skipMethodNamingConventionForPerformance
		) {
			var cell = null,
				thatGrid = this.grid_Experimental;
			if ('input_row' === rowId) {
				var sBarCellFunc = function () {
					var sBar = thatGrid.inputRowNode;
					return sBar.childNodes[columnIndex].childNodes[0];
				};
				cell = new Cell(
					this.grid_Experimental,
					sBarCellFunc,
					null,
					columnIndex,
					this,
					skipMethodNamingConventionForPerformance
				);
				cell.isInputRow_Experimental = true;
			} else {
				var item = this.grid_Experimental.store._getItemByIdentity(rowId);
				if (item) {
					var column = this.grid_Experimental.order[columnIndex];
					var cellNodFunc = function () {
						var view = thatGrid.views.views[0];
						var res = view.getCellNode(thatGrid.getItemIndex(item), column);
						return res;
					};
					cell = new Cell(
						this.grid_Experimental,
						cellNodFunc,
						item,
						column,
						this,
						skipMethodNamingConventionForPerformance
					);
					if (this.grid_Experimental.layout) {
						var columnSortVal = this.grid_Experimental.getCell(column).sort;
						if ('DATE' === columnSortVal) {
							cell.sortDate_Experimental = true;
						} else if ('NUMERIC' === columnSortVal) {
							cell.sortNumber_Experimental = true;
						}
					}
				}
			}
			return cell;
		},

		cellIsCheckbox: function GridContainerPublic_cellIsCheckbox(
			rowId,
			columnIndex
		) {
			/// <summary>
			/// Returns true if this cell contains a checkbox.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>bool</returns>
			var cell = this.cells_Experimental(rowId, columnIndex, true);
			return cell.isCheckbox();
		},

		cells2: function GridContainerPublic_cells2(rowIdInt, columnIndex) {
			/// <summary>
			/// Get cell object to manipulate directly with its properties.
			/// </summary>
			/// <param name="rowIdInt" type="int"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>Aras.Client.Controls.Public.Cell</returns>
			return this.cells(this.getRowId(rowIdInt), columnIndex);
		},

		selectAll: function GridContainerPublic_selectAll() {
			/// <summary>
			/// Select all rows in grid.
			/// </summary>
			var grid = this.grid_Experimental;
			var rowCount = grid.rowCount;
			if (grid.rowCount) {
				var loadedItemsCount = grid._by_idx.length;
				if (loadedItemsCount < rowCount)
					grid.store.fetch({
						start: loadedItemsCount,
						count: rowCount - loadedItemsCount,
						sort: grid.getSortProps(),
						queryOptions: grid.queryOptions,
						isRender: false,
						onBegin: grid._onFetchBegin.bind(grid),
						onComplete: grid._onFetchComplete.bind(grid),
						onError: grid._onFetchError.bind(grid)
					});

				grid.selection.selectRange(0, rowCount - 1);
			}
		},

		cellWasChanged: function GridContainerPublic_cellWasChanged(
			rowId,
			columnIndex
		) {
			/// <summary>
			/// Returns true if cell's value was changed by user during the last editing of this cell, false otherwise.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>bool</returns>
			var cell = this.cells_Experimental(rowId, columnIndex, true);
			return cell.wasChanged();
		},

		clear: function GridContainerPublic_clear() {
			//TODO: perhaps we can just remove grid or set style display none.
		},

		copyRowContent: function GridContainerPublic_copyRowContent(fromID, toID) {
			//TODO:
		},

		deleteColumn: function GridContainerPublic_deleteColumn(index) {
			//TODO
		},

		deleteRow: function GridContainerPublic_deleteRow(rowId, skipRender) {
			/// <summary>
			/// Deletes a row with the specified id.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			this.deleteRow_Experimental(rowId, skipRender);
		},

		deleteSelectedItem: function GridContainerPublic_deleteSelectedItem() {
			//TODO: "issue focus" - for multiple selection - .js delete all selected, but .net delete only focused.
			/// <summary>
			/// Deletes the selected row.
			/// </summary>
			var ids = this.getSelectedItemIds('|').split('|');
			for (var i = 0; i < ids.length; i++) {
				this.deleteRow_Experimental(ids[i]);
			}
		},

		deselect: function GridContainerPublic_deselect() {
			//TODO: "issue focus" focus isn't lost on .js, but lost on .net
			/// <summary>
			/// Deselect all selected rows.
			/// </summary>
			this.selection_Experimental.clear();
		},

		disableSortingByColumn: function GridContainerPublic_disableSortingByColumn() {
			//TODO: need to validate. It seems that doesn't work in both .NET and .js.
			this.columns_Experimental = -1;
		},

		disable: function GridContainerPublic_disable() {
			/// <summary>
			/// Disables grid
			/// </summary>
			this.grid_Experimental.domNode.style.zIndex = -1;
		},

		editCell: function GridContainerPublic_editCell(rowId, columnIndex) {
			/// <summary>
			/// Move focus to this cell and switch it to the editable mode.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			this.edit_Experimental.set(rowId, columnIndex);
		},

		editCellX: function GridContainerPublic_editCellX(cell) {
			//TODO
		},

		enable: function GridContainerPublic_enable() {
			/// <summary>
			/// Enables grid
			/// </summary>
			this.grid_Experimental.domNode.style.zIndex = '';
		},

		enablePopup: function GridContainerPublic_enablePopup(val) {
			//TODO
			//this realization when setting false makes error on clicking right click on the grid
			//don't know how to make work in .net
			//this.grid_Experimental.contexMenu = val ? new ContextMenu(this.grid_Experimental.grid_Experimental.domNode) : null;
		},

		getAction: function GridContainerPublic_getAction(id) {
			//TODO
		},

		getAllItemIds: function GridContainerPublic_getAllItemIds(separator) {
			/// <summary>
			/// Returns a list of all rows ids separated by the specified separator.
			/// </summary>
			/// <param name="separator" type="string"></param>
			/// <returns>string</returns>
			var arr = this.items_Experimental.getAllId();
			return arr.join(separator || '');
		},

		getCellHeight: function GridContainerPublic_getCellHeight(id, col) {
			//TODO:
			//var cell = this.cells_Experimental(id, col, true);
			//if (!cell._cell) {
			//	return 0;
			//}
			//return cell.cellNod.clientHeight;
		},

		getCellValue: function GridContainerPublic_getCellValue(
			rowId,
			columnIndex
		) {
			/// <summary>
			/// A shortcut to get this cell value.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <returns></returns>
			return this.getCellValue_Experimental(rowId, columnIndex);
		},

		getCellX: function GridContainerPublic_getCellX(id, col) {
			//TODO: see in cell.js. Work validated and it's the same as in cell.js (wrong).
			//var cell = this.cells_Experimental(id, col, true);
			//if (!cell._cell) {
			//	return 0;
			//}
			//var bound = cell.getBounds();
			//return bound.x;
		},

		getCellXY: function GridContainerPublic_getCellXY(id, col) {
			//TODO: see getCellX, not validated
			//var cell = this.cells_Experimental(id, col, true);
			//if (!cell._cell) {
			//	return "0,0";
			//}
			//var bound = cell.getBounds();
			//return bound.x + "," + bound.y;
		},

		getCellY: function GridContainerPublic_getCellY(id, col) {
			//TODO: see getCellX, not validated
			//var cell = this.cells_Experimental(id, col, true);
			//if (!cell._cell) {
			//	return 0;
			//}
			//var bound = cell.getBounds();
			//return bound.y;
		},

		getColumnAt: function GridContainerPublic_getColumnAt(x) {
			//TODO
		},

		getColumnCount: function GridContainerPublic_getColumnCount() {
			/// <summary>
			/// Get column count.
			/// </summary>
			/// <returns>int</returns>
			return this.getColumnCount_Experimental();
		},

		getColumnOrder: function GridContainerPublic_getColumnOrder(columnIndex) {
			/// <summary>
			/// Get this column order.
			/// </summary>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>int</returns>
			return this.getColumnOrder_Experimental(columnIndex);
		},

		getColWidth: function GridContainerPublic_getColWidth(columnIndex) {
			//TODO: "issue order" - e.g., if it's written in InitXml under tag columns tag column with order = 2, after that column with order = 1 and
			//TODO: try to get value by col (col number), we will recieve results for different columns in .NET and .js.
			/// <summary>
			/// Get this column width.
			/// </summary>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>int</returns>
			return this.getColWidth_Experimental(columnIndex);
		},

		getColWidths: function GridContainerPublic_getColWidths() {
			/// <summary>
			/// Gets all columns widths divided by ;
			/// </summary>
			/// <returns>string</returns>
			return this.getColWidths_Experimental();
		},

		getCombo: function GridContainerPublic_getCombo() {
			//TODO
		},

		getCurRow: function GridContainerPublic_getCurRow() {
			//TODO: "issue focus" if selected two then .js gets first selected, but .net return focused.
			//different selection models: .net - user selected first row, click shift (but the same beh. with ctrl) and selected second. Focused is first.
			//.js - user selected first row, click shift (but the same beh. with ctrl) and selected second. Focused is the second.
			/// <summary>
			/// Get row number for currently selected row.
			/// </summary>
			/// <returns>int</returns>
			var res = -1,
				selectedId = this.getSelectedId_Experimental();
			if (selectedId) {
				res = this.getRowIndex_Experimental(selectedId);
			}
			return res;
		},

		getHeader: function GridContainerPublic_getHeader() {
			/// <summary>
			/// Not implemented now.
			/// </summary>
			/// <returns>string</returns>
			return '';
		},

		getHeaderCol: function GridContainerPublic_getHeaderCol(i) {
			//TODO: see "issue order"
			/// <summary>
			/// Returns column header label.
			/// </summary>
			/// <param name="i" type="int"></param>
			/// <returns>string</returns>
			if (i < this.getColumnCount() && i >= 0) {
				return this.grid_Experimental.layout.cells[i].name;
			}
		},

		getHeaderIndex: function GridContainerPublic_getHeaderIndex(label) {
			//TODO: see "issue order"
			/// <summary>
			/// For Automation. Gets header index. Returns -1 if no such header
			/// </summary>
			/// <param name="label" type="string"></param>
			/// <returns>int</returns>
			var headers = this.grid_Experimental.layout.cells;
			if (label) {
				for (var i = 0; i < headers.length; i++) {
					if (headers[i].name === label) {
						return i;
					}
				}
			}
			return -1;
		},

		getHorAligns: function GridContainerPublic_getHorAligns() {
			//TODO
		},

		getMenu: function GridContainerPublic_getMenu() {
			//TODO: important, need to implement menuPublic.js?
			/// <summary>
			/// Gets pointer to grid context menu.
			/// </summary>
			/// <returns></returns>
			return this.getMenu_Experimental();
		},

		getRowAt: function GridContainerPublic_getRowAt() {
			//TODO
		},

		getRowsNum: function GridContainerPublic_getRowsNum() {
			/// <summary>
			/// Returns the total number of rows in the table.
			/// </summary>
			/// <returns>int</returns>
			return this.getRowCount();
		},

		getRowCount: function GridContainerPublic_getRowCount() {
			/// <summary>
			/// Gets the number of rows actually contained in the table.
			/// </summary>
			/// <returns>int</returns>
			return this.getRowCount_Experimental();
		},

		getRowId: function GridContainerPublic_getRowId(rowIndex) {
			/// <summary>
			/// Get row ID by row index (zero based, from "top" to "bottom").
			/// </summary>
			/// <param name="rowIndex" type="int"></param>
			/// <returns>string</returns>
			if (rowIndex < this.getRowCount() && rowIndex >= 0) {
				return this.getRowId_Experimental(rowIndex);
			}

			return '';
		},

		getRowIndex: function GridContainerPublic_getRowIndex(rowId) {
			/// <summary>
			/// Returns sequential index of this row.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <returns></returns>
			return this.getRowIndex_Experimental(rowId);
		},

		getSelectedCell: function GridContainerPublic_getSelectedCell() {
			//TODO: "issue order"
			/// <summary>
			/// Returns selected cell
			/// </summary>
			/// <returns>Aras.Client.Controls.Public.Cell</returns>
			var focusManager = this.grid_Experimental.focus;
			return this.cells2(focusManager.rowIndex, focusManager.cell.index);
		},

		getSelectedID: function GridContainerPublic_getSelectedID() {
			//TODO: "issue focus" when several rows are selected .js get the first selected, but .net get focused.
			/// <summary>
			/// Returns the id of the selected row.
			/// </summary>
			/// <returns>string</returns>
			return this.getSelectedId_Experimental();
		},

		getSelectedItemIDs: function GridContainerPublic_getSelectedItemIDs(
			separator
		) {
			//TODO: order of row Ids in .js and .NET can be different in the results
			/// <summary>
			/// Returns a list of selected rows' ids separated by specified separator.
			/// </summary>
			/// <param name="separator" type="string"></param>
			/// <returns>string</returns>
			return this.getSelectedItemIDs_Experimental(separator);
		},

		getUserControlInfo: function GridContainerPublic_getUserControlInfo() {
			//TODO
		},

		getUserData: function GridContainerPublic_getUserData(rowId, keyOptional) {
			/// <summary>
			/// Get extra row data stored by USERDATAn parameter for this row (or by SetUserData method).
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="keyOptional" type="object">Optional</param>
			/// <returns>string</returns>
			return this.getUserData_Experimental(rowId, keyOptional);
		},

		getUserDataX: function GridContainerPublic_getUserDataX(id, key) {
			//TODO
		},

		getVisibleItemIDs: function GridContainerPublic_getVisibleItemIDs(
			separator
		) {
			/// <summary>
			/// Returns a list of all currently visible rows ids separated by specified separator.
			/// </summary>
			/// <param name="separator" type="string"></param>
			/// <returns>string</returns>
			var arr = [],
				gr = this.grid_Experimental;
			for (var i = 0; i < this.getRowCount(); i++) {
				arr.push(gr.store.getIdentity(gr.getItem(i)));
			}
			return arr.join(separator || '');
		},

		getXml: function GridContainerPublic_getXml(useValues) {
			//TODO: didn't validate every tag. useValues doesn't work
			//TODO: cannot fully validate because getXml of .net doesn't work for my example.
			//TODO: If user call SetEditType we change layout for cell. Perhaps it need to return it in getXml.

			return GridModules.getXML(this, useValues);
		},

		initXML: function GridContainerPublic_initXML(doc) {
			//TODO: tag, e.g., height="20" under <thead doesn't work
			//TODO: need to validate url's
			/// <summary>
			/// Load this XML string/url into the grid.
			/// <code lang="XML">
			/// <table editable="true" multiselect="true">
			///   <columns>
			///     <column width="100" align="left" order="0"></column>
			///     <column width="200" align="center" order="1"></column>
			///   </columns>
			///   <thead height="20">
			///     <th>header 1</th>
			///     <th>header 2</th>
			///  </thead>
			/// </table>
			/// </code>
			/// </summary>
			/// <param name="doc" type="string"></param>
			if (this.InitXML_Experimental(doc, true)) {
				var dom = new XmlDocument();
				dom.loadXML(doc);
				var inputrow = dom.selectSingleNode('./table/inputrow');
				if (inputrow) {
					var visibleAttr = inputrow.getAttribute('visible');
					this.showInputRow(
						!visibleAttr ||
							(visibleAttr.toLowerCase() !== 'false' && visibleAttr !== '0')
					);
				}

				this.addXMLRows(doc);
			}
		},

		initXMLRows: function GridContainerPublic_initXMLRows(doc) {
			/// <summary>
			/// Initialize rows from xml document.
			/// </summary>
			/// <param name="doc" type="string"></param>
			this.turnEditOff_Experimental();
			this.removeAllRows_Experimental();
			this.addXMLRows(doc);
		},

		insertRowAt: function GridContainerPublic_insertRowAt(
			index,
			newID,
			text,
			action
		) {
			//TODO
		},

		loadBaselineXml: function GridContainerPublic_loadBaselineXml(init) {
			//don't know how to validate, need to see deeper, perhaps need to see AddColumnToDiffView and simular methods.
			/// <summary>
			/// Load base XML for comparation
			/// </summary>
			/// <param name="init" type="string">init XML for comparation with current grid</param>
			this.loadBaselineXML_Experimental(init);
		},

		addColumnToDiffView: function GridContainerPublic_addColumnToDiffView(
			name
		) {
			//TODO
		},

		addAllColumnsToDiffView: function GridContainerPublic_addAllColumnsToDiffView() {
			/// <summary>
			/// Add all columns to difference list.
			/// Columns in difference list will be checked in redline voew mode.
			/// </summary>
			this.redline_Experimental.addGridColumnsToCompareList();
		},

		removeColumnFromDiffView: function GridContainerPublic_removeColumnFromDiffView(
			name
		) {
			/// <summary>
			/// Remove column from difference list by name.
			/// Columns in difference list will be checked in redline voew mode.
			/// </summary>
			/// <param name="name" type="string">name</param>
			this.redline_Experimental.removeColumnFromCompareList(name);
		},

		removeAllColumnsFromDiffView: function GridContainerPublic_removeAllColumnsFromDiffView() {
			//TODO
		},

		setColumnVisible: function GridContainerPublic_setColumnVisible(
			columnIndex,
			visible,
			columnWidth
		) {
			//TODO: see "issue order"
			/// <summary>
			/// Sets column visible
			/// </summary>
			/// <param name="columnIndex" type="int"></param>
			/// <param name="visible" type="bool"></param>
			/// <param name="columnWidth" type="int"></param>
			this.setColumnVisible_Experimental(columnIndex, visible, columnWidth);
		},

		isColumnVisible: function GridContainerPublic_isColumnVisible(columnIndex) {
			//TODO: see "issue order"
			/// <summary>
			/// Gets value that indicates whether the column is visible or hidden.
			/// </summary>
			/// <param name="columnIndex" type="int"></param>
			return this.isColumnVisible_Experimental(columnIndex);
		},

		setEditable: function GridContainerPublic_setEditable(value) {
			/// <summary>
			/// Enable/Disable cell editing at runtime.
			/// </summary>
			/// <param name="value" type="bool"></param>
			this.setEditable_Experimental(value);
		},

		isEditable: function GridContainerPublic_isEditable() {
			/// <summary>
			/// Returns true if cell editing is enabled.
			/// </summary>
			/// <returns>bool</returns>
			return this.isEditable_Experimental();
		},

		isInputRowVisible: function GridContainerPublic_isInputRowVisible() {
			/// <summary>
			/// Returns true when input row is visible
			/// </summary>
			/// <returns>bool</returns>
			return this.isInputRowVisible_Experimental();
		},

		isItemExists: function GridContainerPublic_isItemExists(rowId) {
			/// <summary>
			/// Returns true if the row with specified id exists in the table, otherwise false.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <returns>bool</returns>
			return this.items_Experimental.is(rowId);
		},

		isMultiselect: function GridContainerPublic_isMultiselect() {
			/// <summary>
			/// Returns true if multiselect is enabled.
			/// </summary>
			/// <returns>bool</returns>
			return this.grid_Experimental.get('selectionMode') === 'extended';
		},

		loadCheckboxIcons: function GridContainerPublic_loadCheckboxIcons(
			image0,
			image1
		) {
			//TODO
		},

		loadSortIcons: function GridContainerPublic_loadSortIcons(image0, image1) {
			//TODO
		},

		menu: function GridContainerPublic_menu() {
			/// <summary>
			/// Get popup menu object to manipulate directly with its properties.
			/// </summary>
			/// <returns></returns>
			return this.getMenu();
		},

		menuAdd: function GridContainerPublic_menuAdd(text, image) {
			//TODO: parameter image is not implemented
			//doesn't work in .net, so in .net need to see deeper to compare, but works in the code below
			//we use text as id of menu, but in .Net it's auto-increment number.
			/// <summary>
			/// Adds a ToolStripItem that displays the specified image and text to the collection.
			/// </summary>
			/// <param name="text" type="string"></param>
			/// <param name="image" type="string"></param>
			var menu = this.menu();
			if (menu) {
				menu.add(text, text);
			}
		},

		menuAddSeparator: function GridContainerPublic_menuAddSeparator() {
			/// <summary>
			/// Adds a menu separator. Now adds separator like "-".
			/// </summary>
			var menu = this.menu();
			if (menu) {
				menu.addSeparator();
			}
		},

		menuRemoveAll: function GridContainerPublic_menuRemoveAll() {
			/// <summary>
			/// Removes all MenuItem objects from the menu item collection.
			/// </summary>
			var menu = this.menu();
			if (menu) {
				menu.removeAll();
			}
		},

		menuSetEnabled: function GridContainerPublic_menuSetEnabled(text, flag) {
			//we use text as id of menu, but in .Net it's auto-increment number. So .js has text as first parameter, but .Net has pos (int type)
			/// <summary>
			///  Gets or sets a value indicating whether the menu item is enabled.
			/// </summary>
			/// <param name="text" type="string"></param>
			/// <param name="flag" type="bool"></param>
			var menu = this.menu();
			if (menu) {
				var it = menu.collectionMenu[pos];
				if (it) {
					it.setEnabled(flag);
				}
			}
		},

		moveRowDown: function GridContainerPublic_moveRowDown(rowId) {
			/// <summary>
			/// Moves the specified row down in the table.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			GridModules.moveRowUpDownForPublicGrid(this, rowId, false);
		},

		moveRowUp: function GridContainerPublic_moveRowUp(rowId) {
			/// <summary>
			/// Moves the specified row up in the table.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			GridModules.moveRowUpDownForPublicGrid(this, rowId, true);
		},

		removeAllRows: function GridContainerPublic_removeAllRows() {
			/// <summary>
			/// Remove all rows from grid.
			/// </summary>
			this.removeAllRows_Experimental();
		},

		requestFocus: function GridContainerPublic_requestFocus() {
			/// <summary>
			/// Sets input focus to the control.
			/// </summary>
			this.requestFocus_Experimental();
		},

		scrollToColumn: function GridContainerPublic_scrollToColumn(index) {
			//TODO
		},

		setAction: function GridContainerPublic_setAction(id, action) {
			//TODO
		},

		setCellCombo: function GridContainerPublic_setCellCombo(
			rowId,
			columnIndex,
			labels,
			values
		) {
			/// <summary>
			/// Set comboBox for specified cell.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <param name="labels"></param>
			/// <param name="values"></param>
			var cell = this.cells_Experimental(rowId, columnIndex, true);
			cell.setCombo(labels, values);
		},

		setCellFont: function GridContainerPublic_setCellFont(
			rowId,
			columnIndex,
			value
		) {
			/// <summary>
			/// Sets fort for specified cell.
			/// Value is in the following formats:
			/// Name-style-size, style:{bold,italic,bolditalic}
			/// [examples: Courier-bold-12]
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <param name="value" type="string"></param>
			var cell = this.cells_Experimental(rowId, columnIndex, true);
			cell.setFont(value);
		},

		setCellLink: function GridContainerPublic_setCellLink(
			rowId,
			columnIndex,
			value
		) {
			/// <summary>
			/// Sets link for specified cell.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <param name="value" type="string"></param>
			var cell = this.cells_Experimental(rowId, columnIndex, true);
			cell.setLink(value);
		},

		setCellTextColor: function GridContainerPublic_setCellTextColor(
			rowId,
			columnIndex,
			value
		) {
			/// <summary>
			/// Sets text color in specified cell.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <param name="value" type="string"></param>
			var cell = this.cells_Experimental(rowId, columnIndex, true);
			cell.setTextColor(value);
		},

		setRowBgColor: function GridContainerPublic_setRowBgColor(id, val) {
			//TODO
		},

		setCellValue: function GridContainerPublic_setCellValue(
			rowId,
			columnIndex,
			value
		) {
			/// <summary>
			/// A shortcut to set this cell value.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			/// <param name="value" type="string"></param>
			var cell = this.cells_Experimental(rowId, columnIndex, true);
			cell.setValue(value);
		},

		setColumnCount: function GridContainerPublic_setColumnCount(val) {
			//TODO
		},

		getColumnIndex: function GridContainerPublic_getColumnIndex(columnName) {
			//TODO: see "issue order"
			//TODO: "issue colname" it returns column index for .js when colname is not specified. But return -1 in .net.
			/// <summary>
			/// Gets column index by column name.
			/// </summary>
			/// <param name="columnName" type="string"></param>
			/// <returns>
			/// int. Column position in grid; otherwise -1 returned.
			/// </returns>
			var result = this.getColumnIndex_Experimental(columnName);
			//don't use, e.g., if (result) ..., result can be 0 and it's truly value for this case.
			return result !== undefined ? result : -1;
		},

		getColumnName: function GridContainerPublic_getColumnName(columnIndex) {
			//TODO: see "issue order"
			//TODO: "issue colname" it returns column name for .js when colname is not specified. But return undefined in .net.
			/// <summary>
			/// Gets column name by column index.
			/// </summary>
			/// <param name="columnIndex" type="int"></param>
			/// <returns>string</returns>
			if (columnIndex < this.getColumnCount() && columnIndex >= 0) {
				return this.getColumnName_Experimental(columnIndex);
			}
			return '';
		},

		getLogicalColumnOrder: function GridContainerPublic_getLogicalColumnOrder() {
			//TODO: "issue colname" it returns column name for .js when colname is not specified. But return undefined in .net.
			/// <summary>
			/// Gets all column names divided by ; and in order they are shown in grid.
			/// </summary>
			/// <returns>string</returns>
			return this.getLogicalColumnOrder_Experimental();
		},

		setColumnOrder: function GridContainerPublic_setColumnOrder(col, newPos) {
			//TODO
		},

		setColumnProperties: function GridContainerPublic_setColumnProperties(
			s,
			columnIndex
		) {
			//TODO: checks only COMBO in string. If true then it sets Combo and listId = 0 always.
			/// <summary>
			/// A comma delimited list of name/value pairs to configures the column by setting its type and other properties.
			/// type={FIELD|COMBO|NOEDIT}, list={integer}, sortable={yes|no}, sorttype={string|numeric|date}, inputformat={format_string}, locale={locale_string}
			/// Property name is case sensitive.
			/// Type NOEDIT means this column's cells will be non-editable.
			/// Type FIELD means cells will be editable with input field as edit widget.
			/// Type COMBO means cells will be editable with combobox as edit widget.
			/// For type=COMBO also specify the LISTn property to Initialize combobox.
			/// For type=COMBO also specify the LISTn property to Initialize combobox.
			/// You also can Initialize combobox at runtime using ONEDITCELL event handler.
			/// There is also a possibility to insert checkbox in cell. See TEXTn parameter description.
			/// example 1: type=COMBO,list=1,sortable=no
			/// example 2: sorttype=date, inputformat={dd/MM/yy, hh:mm:ss},locale=enUS
			/// </summary>
			/// <param name="s" type="string"></param>
			/// <param name="columnIndex" type="int"></param>
			this.setColumnProperties_Experimental(s, columnIndex);
		},

		setColWidth: function GridContainerPublic_setColWidth(col, width) {
			//TODO
		},

		setComboList: function GridContainerPublic_setComboList(s, i) {
			//TODO
		},

		setCursor: function GridContainerPublic_setCursor(c) {
			//TODO
		},

		setHeader: function GridContainerPublic_setHeader(value) {
			//TODO
		},

		setHeaderCol: function GridContainerPublic_setHeaderCol(i, val) {
			//TODO
		},

		setHorAligns: function GridContainerPublic_setHorAligns(value) {
			//TODO
		},

		setInitWidths: function GridContainerPublic_setInitWidths(value) {
			//TODO
		},

		setInitWidthsP: function GridContainerPublic_setInitWidthsP(
			widths_in_pixels
		) {
			//TODO
		},

		setMultiselect: function GridContainerPublic_setMultiselect(value) {
			/// <summary>
			/// Enable/Disable multiselect at runtime.
			/// </summary>
			/// <param name="value" type="string"></param>
			this.setMultiselect_Experimental(value);
		},

		setPaintEnabled: function GridContainerPublic_setPaintEnabled(b) {
			//TODO
		},

		setRowTextBold: function GridContainerPublic_setRowTextBold(b) {
			//TODO
		},

		setRowTextNormal: function GridContainerPublic_setRowTextNormal(b) {
			//TODO
		},

		setSelectedRow: function GridContainerPublic_setSelectedRow(
			rowId,
			multi,
			show
		) {
			//TODO: validate parameter show. All rest works.
			/// <summary>
			/// Set selected row at runtime. If multi == false new row becomes the only selected row. If
			/// multi == true new row becomes the selected and all previously selected rows stay selected
			/// also. You should use next trick to Deselect all rows:
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="multi" type="bool"></param>
			/// <param name="show" type="bool">Optional. Scrolls row to visible area if true.</param>
			this.setSelectedRow_Experimental(rowId, multi, show);
		},

		setUserData: function (rowId, keyOrValue, value) {
			/// <summary>
			/// To set row level data. You can use this method to store some extra data or flags.
			/// </summary>
			/// <param name="rowId" type="string"></param>
			/// <param name="keyOrValue" type="string">key is optional, so it can be specified value here</param>
			/// <param name="value" type="string">set if key is passed in keyOrValue, but not value</param>
			this.setUserData_Experimental(rowId, keyOrValue, value);
		},

		setUserDataX: function GridContainerPublic_setUserDataX(id, key, userData) {
			//TODO
		},

		showContent: function GridContainerPublic_showContent() {
			//TODO
		},

		showInputRow: function GridContainerPublic_showInputRow(bool) {
			/// <summary>
			/// Display input row it true; otherwise, input row will be hidden.
			/// </summary>
			/// <param name="bool" type="bool"></param>
			this.showInputRow_Experimental(bool);
		},

		showRow: function GridContainerPublic_showRow(rowID) {
			//TODO
		},

		sort: function GridContainerPublic_sort(columnIndex, asc) {
			/// <summary>
			/// Sort table by column in ascending or descending order.
			/// </summary>
			/// <param name="columnIndex" type="int"></param>
			/// <param name="asc" type="bool">true if ascending, false if descending.</param>
			this.grid_Experimental.setSortIndex(columnIndex, asc);
		},

		sortEx: function GridContainerPublic_sortEx(col, asc) {
			//TODO
		},

		stretchColumnWidths: function GridContainerPublic_stretchColumnWidths() {
			//TODO
		},

		turnEditOff: function GridContainerPublic_turnEditOff() {
			/// <summary>
			/// Direction to lost focus from grid cell.
			/// </summary>
			this.turnEditOff_Experimental();
		},

		setUserDragData: function GridContainerPublic_setUserDragData(dragData) {
			//TODO
		},

		// experimental events

		onStartEdit_Experimental: function (rowId, column) {
			//Event fired when editing is started for a given grid rowID
			this.gridEditCell(0, rowId, this.getColumnIndex(column));
		},

		onApplyEdit_Experimental: function (rowId, column, value) {
			//Event fired when editing is finish for a given grid rowID and value
			var type = 'boolean' === typeof value ? 1 : 2;
			this.gridEditCell(type, rowId, this.getColumnIndex(column));
		},

		onCancelEdit_Experimental: function (rowId) {
			this.gridEditCell(2, rowId, this.grid_Experimental.edit.info.cell.index);
		},

		canEdit_Experimental: function (rowId, column) {
			//Event fired when check edit cell;
			return this.grid_Experimental._canEdit;
		},

		onStartSearch_Experimental: function (rowId, column) {
			//Event fired when click arrow inputHelper in edit mode cell;
		},

		onInputHelperShow_Experimental: function (rowId, column) {
			//Event fired when click arrow inputHelper in edit mode cell;
		},

		validateCell_Experimental: function (rowId, column, value) {
			//Event fired when start and finish edit cell;
			return true;
		},

		gridHeaderMenuClick_Experimental: function (command, rowID, columnIndex) {
			//This event start when click on header contex menu;
		},

		eventInputRow_Experimental: function (mode, rowID, col) {
			//event run when focus, blur and press key on input row
		},

		// experimental methods
		_newStore_Experimental: function (items) {
			items = items || [];
			var store = new ItemFileWriteStore({
				data: { identifier: 'uniqueId', items: items }
			});
			aspect.after(
				store,
				'onNew',
				function (item) {
					this.items_Experimental.onNew(store.getIdentity(item));
				}.bind(this),
				true
			);
			store.comparatorMap =
				privateProps[
					this.propsId_Experimental
				]._sortManager_Experimental.comparatorMap;
			return store;
		},

		setLayout_Experimental: (function () {
			var standartFormatter = function (value, index) {
				if (
					this.optionsLables &&
					this.optionsLables.length &&
					this.options.indexOf(value) > -1
				) {
					return this.optionsLables[this.options.indexOf(value)];
				} else if ('boolean' == typeof value) {
					var w = new dijit.form.CheckBox({
						checked: value,
						onClick: function (e) {
							e.target.isCheckBox = true;
							return false;
						}
					});
					w._destroyOnRemove = true;
					return w;
				}
				return value;
			};

			return function (array) {
				for (var i = 0; i < array.length; i++) {
					this.grid_Experimental.nameColumns.push(array[i].field);
					this.grid_Experimental.order.push(i);
					if (!array[i].formatter) {
						array[i].formatter = standartFormatter;
						array[i].cellType = Aras.Client.Controls.Experimental.TypeEditCell;
					}
				}

				this.grid_Experimental.selection.clear();
				this.grid_Experimental.set('structure', array);
			};
		})(),

		setArrayData_Experimental: function (array) {
			var store = this._newStore_Experimental(array);
			this.grid_Experimental.setStore(store);
		},

		addRow_Experimental: function (id, str, skipImmediateUpdate) {
			var self = this;
			var rowObj = {
				getFields: function () {
					return str.split(self.delimeter);
				},
				getFieldText: function (item) {
					return item;
				},
				getFieldAttribute: function (item, attr) {
					return null;
				}
			};

			if (!this.grid_Experimental.updating) {
				this.grid_Experimental.beginUpdate();
			}

			this._addRowImplementation_Experimental(id, rowObj);

			if (skipImmediateUpdate) {
				this._requestEndUpdate_Experimental();
			} else {
				this.grid_Experimental.store.save();
				this.grid_Experimental.endUpdate();
			}
		},

		_requestEndUpdate_Experimental: function (callback) {
			var privateProperties = privateProps[this.propsId_Experimental];

			if (privateProperties._updateTimer) {
				clearTimeout(privateProperties._updateTimer);
				privateProperties._updateTimer = null;
			}

			privateProperties._updateTimer = setTimeout(
				function () {
					this.grid_Experimental.store.save();
					this.grid_Experimental.endUpdate();
					if (callback) {
						callback();
					}
				}.bind(this),
				0
			);
		},

		cellFormatHandler_Experimental: function (storeValue, index) {
			return this.grid.parentContainer.formatter_Experimental.formatHandler(
				this,
				storeValue,
				index
			);
		},

		_addRowImplementation_Experimental: function (id, row, rowState) {
			var regCheck = /<checkbox.*>/,
				regCheckState = /.*(state|value)=["'](1|true)["'].*/,
				gridStore = this.grid_Experimental.store,
				fields,
				currentField,
				layoutCell,
				userdata,
				fieldName,
				fieldSort,
				fieldText,
				fieldValue,
				fieldAttrs,
				fieldCss,
				fieldStyle,
				fieldDataType,
				fieldBgColor,
				fieldTextColor,
				bgInvert,
				newRow = { attrs: {}, style: {}, dataType: {} },
				i;

			newRow.uniqueId =
				id !== undefined && id !== null && id !== ''
					? id
					: GridModules.uniqueIdGenerator.get();
			newRow._newRowMarker =
				rowState == 'new'
					? ++privateProps[this.propsId_Experimental]._newRowsCounter
					: 0;

			fields = row.getFields() || [];
			i = this.grid_Experimental.layout.cells.length - fields.length;
			for (; i > 0; i--) {
				fields.push('');
			}

			for (i = 0; i < fields.length; i++) {
				//Array.forEach(fields, function (item, index) {
				currentField = fields[i];
				layoutCell = this.grid_Experimental.layout.cells[
					this.grid_Experimental.order[i]
				];
				if (!layoutCell) {
					return;
				}

				fieldName = layoutCell.field;
				fieldSort = layoutCell.sort;
				fieldText = row.getFieldText(currentField);
				fieldValue = fieldText;
				fieldAttrs = {};
				fieldCss = row.getFieldAttribute(currentField, 'css');
				fieldStyle = fieldCss ? GridModules._parseCSS(fieldCss) : {};

				if (regCheck.test(fieldText)) {
					fieldValue = regCheckState.test(fieldText);
				} else if ('NUMERIC' === fieldSort) {
					fieldValue = fieldText ? parseFloat(fieldText) : '';
				} else if ('DATE' === fieldSort) {
					fieldValue = fieldText;
				} else {
					fieldValue = fieldText;
					var link = row.getFieldAttribute(currentField, 'link');
					if (link) {
						newRow[fieldName + 'link'] = link;

						var action = row.getFieldAttribute(currentField, 'action');
						if (action) {
							newRow[fieldName + 'action'] = action;
						}

						var fileName = row.getFieldAttribute(currentField, 'filename');
						if (fileName) {
							newRow[fieldName + 'filename'] = fileName;
						}
					}
				}

				fieldDataType = row.getFieldAttribute(currentField, 'fdt') || '';
				fieldBgColor =
					row.getFieldAttribute(currentField, 'bgColor') || this.bgColor;
				if (fieldBgColor) {
					fieldStyle['background-color'] =
						fieldBgColor +
						(-1 < fieldDataType.indexOf('color') &&
						-1 === fieldBgColor.indexOf('important')
							? '!important'
							: '');
				}

				if (this.borderGColor) {
					fieldStyle['border-color'] = this.borderGColor + ' !important';
				}

				GridModules.setFont_Gm(
					row.getFieldAttribute(currentField, 'font') || this.font,
					fieldStyle
				);

				fieldTextColor = row.getFieldAttribute(currentField, 'textColor');
				if (fieldTextColor && !fieldStyle.color) {
					fieldStyle.color = fieldTextColor;
				}

				bgInvert = null;
				if (row.getFieldAttribute(currentField, 'bgInvert')) {
					bgInvert = row.getFieldAttribute(currentField, 'bgInvert'); //check cell
				} else {
					if (layoutCell.bginvert) {
						bgInvert = layoutCell.bginvert; //check column
					} else {
						bgInvert = this.bgInvert.toString(); //check table
					}
				}
				if (bgInvert === 'false' && fieldStyle['background-color']) {
					fieldAttrs.bginvert = bgInvert;
				}
				newRow[fieldName] = fieldValue;
				newRow.attrs[fieldName] = fieldAttrs;
				newRow.style[fieldName] = fieldStyle;
				newRow.dataType[fieldName] = fieldDataType;
			}

			if (!gridStore._getItemByIdentity(newRow.uniqueId)) {
				//clear history if we this Item create and then delete from store
				if (
					typeof gridStore._pending._newItems[newRow.uniqueId] !== 'undefined'
				) {
					delete gridStore._pending._newItems[newRow.uniqueId];
					delete gridStore._pending._deletedItems[newRow.uniqueId];
					delete gridStore._pending._modifiedItems[newRow.uniqueId];
				}
				gridStore.newItem(newRow);
			} else {
				var rowsMustHaveUniqueIdsErrorMessage =
					dojoConfig.arasContext.resources['grid.rows_must_have_unique_ids'];
				this.grid_Experimental.showMessage(
					"<span class='dojoxGridError'>" +
						rowsMustHaveUniqueIdsErrorMessage +
						'</span>'
				);
				return false;
			}

			if (row.getUserData) {
				userdata = row.getUserData();
				for (i = 0; i < userdata.length; i++) {
					var key = userdata[i].getAttribute('key');
					var value = userdata[i].getAttribute('value');
					this.setUserData(newRow.uniqueId, key, value);
				}
			}

			return true;
		},

		addXMLRows_Experimental: function (xml, skipRender) {
			var dom = new XmlDocument(),
				tableRows,
				rowObject,
				i;

			dom.loadXML(xml);

			var tableNode = dom.selectSingleNode('./table');
			var bgInvertAttr = tableNode.getAttribute('bgInvert');
			if (bgInvertAttr !== null) {
				this.bgInvert = bgInvertAttr && bgInvertAttr.toLowerCase() === 'true';
			}
			this.delimeter = tableNode.getAttribute('delim') || this.delimeter;

			tableRows = dom.selectNodes('./table/tr');
			if (tableRows.length) {
				if (!this.grid_Experimental.updating) {
					this.grid_Experimental.beginUpdate();
				}
				rowObject = {
					getUserData: function () {
						return this.rowXml.selectNodes('./userdata');
					},
					getFields: function () {
						return this.rowXml.selectNodes('./td');
					},
					getFieldText: function (inItem) {
						return inItem.text;
					},
					getFieldAttribute: function (inItem, attributeName) {
						return (
							inItem.getAttribute(attributeName) ||
							this.rowXml.getAttribute(attributeName)
						);
					}
				};
				for (i = 0; i < tableRows.length; i++) {
					rowObject.rowXml = tableRows[i];
					this._addRowImplementation_Experimental(
						rowObject.rowXml.getAttribute('id'),
						rowObject,
						rowObject.rowXml.getAttribute('rowState')
					);
				}

				if (skipRender) {
					this._requestEndUpdate_Experimental(
						this.gridXmlLoaded.bind(this, true)
					);
				} else {
					this.grid_Experimental.store.save();
					this.grid_Experimental.endUpdate();
					this.gridXmlLoaded(true);
				}
			} else {
				this.gridXmlLoaded(true);
			}
		},

		loadBaselineXML_Experimental: function (xml) {
			this.redline_Experimental.loadBaselineXML(xml);
		},

		refreshRedlineView_Experimental: function () {
			this.redline_Experimental.refreshRedlineView();
		},

		isRedlineRow_Experimental: function (rowId) {
			return this.redline_Experimental.isRedlineId(rowId);
		},

		deleteRow_Experimental: function (id, skipRender) {
			var index = this.getRowIndex(id);
			if (-1 < index) {
				var item = this.grid_Experimental.getItem(index);
				if (!this.grid_Experimental.updating) {
					this.grid_Experimental.beginUpdate();
				}
				this.grid_Experimental.store.deleteItem(item);
				if (skipRender) {
					this._requestEndUpdate_Experimental();
				} else {
					this.grid_Experimental.store.save();
					this.grid_Experimental.scroller.findPage(
						this.grid_Experimental.scroller.pageTop
					);
					this.grid_Experimental.endUpdate();
				}
			}
		},

		removeSelectedRows_Experimental: function () {
			this.grid_Experimental.removeSelectedRows();
		},

		getCellValue_Experimental: function (id, col) {
			return this.cells_Experimental(id, col, true).getValue();
		},

		getColumnCount_Experimental: function () {
			return this.grid_Experimental.layout.cellCount;
		},

		getColumnName_Experimental: function (columnIdx) {
			return this.grid_Experimental.nameColumns[columnIdx];
		},

		getColumnOrder_Experimental: function (col) {
			return col > this.GetColumnCount()
				? -1
				: this.grid_Experimental.order[col];
		},

		getColWidth_Experimental: function (columnIndex) {
			var cell = this.grid_Experimental.layout.cells[columnIndex];
			return parseInt(cell.unitWidth || cell.width, 10);
		},

		getColWidths_Experimental: function () {
			var length = [];
			for (var i = 0; i < this.grid_Experimental.layout.cells.length; i++) {
				var cell = this.grid_Experimental.layout.cells[i];
				length[i] = parseInt(cell.unitWidth || cell.width, 10);
			}
			return length.join(';');
		},

		getLogicalColumnOrder_Experimental: function () {
			var length = [];
			for (var i = 0; i < this.grid_Experimental.layout.cells.length; i++) {
				length.push(this.grid_Experimental.layout.cells[i].field);
			}
			return length.join(';');
		},

		getMenu_Experimental: function () {
			return this.contexMenu_Experimental;
		},

		getHeaderMenu_Experimental: function () {
			return this.headerContexMenu_Experimental;
		},

		getRowCount_Experimental: function () {
			return this.grid_Experimental.get('rowCount');
		},

		getRowId_Experimental: function (index) {
			var rowCount = this.getRowCount();
			var gridExp = this.grid_Experimental;
			var loadedItemsCount = gridExp._by_idx.length;
			if (loadedItemsCount <= index) {
				gridExp.store.fetch({
					start: loadedItemsCount,
					count: rowCount - loadedItemsCount,
					sort: gridExp.getSortProps(),
					queryOptions: gridExp.queryOptions,
					isRender: false,
					onBegin: gridExp._onFetchBegin.bind(gridExp),
					onComplete: gridExp._onFetchComplete.bind(gridExp),
					onError: gridExp._onFetchError.bind(gridExp)
				});
			}

			var item = this.grid_Experimental.getItem(index);
			return item ? this.grid_Experimental.store.getIdentity(item) : undefined;
		},

		getRowIndex_Experimental: function (rowID) {
			var item = this.grid_Experimental.store._getItemByIdentity(rowID);
			return item ? this.grid_Experimental.getItemIndex(item) : -1;
		},

		getSelectedId_Experimental: function () {
			var firstItem = this.grid_Experimental.selection.getFirstSelected();
			return firstItem
				? this.grid_Experimental.store.getIdentity(firstItem)
				: '';
		},

		getUserData_Experimental: function (rowId, keyOptional) {
			return GridModules.getUserData_Gm(
				this.grid_Experimental.store,
				rowId,
				keyOptional
			);
		},

		setUserData_Experimental: function (rowId, keyOrValue, value) {
			GridModules.setUserData_Gm(
				this.grid_Experimental.store,
				rowId,
				keyOrValue,
				value
			);
		},

		getSelectedItemIDs_Experimental: function (delim) {
			var selectedItems = this.grid_Experimental.selection.getSelected(),
				store = this.grid_Experimental.store,
				result = [],
				i;

			for (i = 0; i < selectedItems.length; i++) {
				result.push(store.getIdentity(selectedItems[i]));
			}

			return delim ? result.join(delim) : result;
		},

		initXML_Experimental: function (xml, isCalledFromPublic) {
			popup.close();
			this.turnEditOff();

			this.grid_Experimental.order = [];
			var nameColumns = [];

			var dom = new XmlDocument();
			dom.loadXML(xml);

			var tableNd = dom.selectSingleNode('./table');
			var thNodes = tableNd.selectNodes('thead/th');
			var columnNodes = tableNd.selectNodes('columns/column');

			privateProps[this.propsId_Experimental].Editable =
				'true' == tableNd.getAttribute('editable');
			privateProps[this.propsId_Experimental]._newRowsCounter = 0;

			if ('true' == tableNd.getAttribute('norowselect')) {
				this.setNoRowSelect(true);
			} else if ('true' == tableNd.getAttribute('multiselect')) {
				this.setMultiselect(true);
			} else {
				this.setMultiselect(false);
			}

			if (thNodes.length == columnNodes.length) {
				var comboReg = /COMBO:(\d*)/;
				var mvListReg = /MV_LIST:(\d*)/;
				var viewObj = { type: 'dojox.grid._View', cells: [] };
				for (var i = 0; i < thNodes.length; i++) {
					var currentTh = thNodes[i];
					var currentColumn = columnNodes[i];

					var alignRow = GridModules.getAlign_Gm(
						currentColumn.getAttribute('align')
					);
					var alignHead = GridModules.getAlign_Gm(
						currentTh.getAttribute('align')
					);
					var editable = currentColumn.getAttribute('edit');
					var colWidth = currentColumn.getAttribute('width');
					var inputFormat = currentColumn.getAttribute('inputformat');
					var order = parseInt(currentColumn.getAttribute('order'), 10);
					var id = currentColumn.getAttribute('colname') || currentTh.text;
					var bgInvert = currentColumn.getAttribute('bgInvert');
					var dataSourceName = currentColumn.getAttribute('dataSourceName');
					colWidth += colWidth.indexOf('%') > -1 ? '' : 'px';
					var options = [],
						optionsLables = [];

					if (comboReg.test(editable) || mvListReg.test(editable)) {
						var idList = comboReg.test(editable)
							? editable.match(comboReg)[1]
							: editable.match(mvListReg)[1];
						var list = dom.selectSingleNode('./table/list[@id=' + idList + ']');
						if (list) {
							editable = comboReg.test(editable)
								? 'FilterComboBox'
								: 'CheckedMultiSelect';
							var listItemsNodes = list.selectNodes('listitem');
							for (var j = 0; j < listItemsNodes.length; j++) {
								var val = listItemsNodes[j].getAttribute('value');
								var lab = listItemsNodes[j].getAttribute('label');
								optionsLables.push(lab || val);
								options.push(val);
							}
						}
					}

					var cellClass = editable === 'InputHelper' ? 'InputHelper' : '';
					var gridId = this.connectId_Experimental;
					if (
						window.customDojoGridStyle &&
						window.customDojoGridStyle.supportGridIds.indexOf(gridId) !== -1 &&
						id.endsWith('_D')
					) {
						cellClass +=
							' ' + window.customDojoGridStyle.classNames.relationshipsCells;
					}

					viewObj.cells[order] = {
						name: '' === currentTh.text ? ' ' : currentTh.text,
						field: id,
						styles: alignRow,
						headerStyles: alignHead,
						cellType: Aras.Client.Controls.Experimental.TypeEditCell,
						options: options,
						formatter: this.cellFormatHandler_Experimental,
						optionsLables: optionsLables,
						editable:
							'L' == id
								? false
								: privateProps[this.propsId_Experimental].Editable,
						editableType: 'L' == id ? 'dropDownButton' : editable,
						sort: currentColumn.getAttribute('sort'),
						inputformat: inputFormat
							? inputFormat.replace(/tt/g, 'a').replace(/dddd/g, 'EEEE')
							: undefined,
						locale: currentColumn.getAttribute('locale'),
						layoutIndex: i,
						width: colWidth,
						classes: cellClass,
						bginvert: bgInvert,
						dataSourceName: dataSourceName,
						externalWidget:
							privateProps[this.propsId_Experimental]._externalCellManagers[
								editable
							] || null
					};
					nameColumns[order] = id;
					this.grid_Experimental.order.push(order);
					if (currentColumn.getAttribute('width') == '0') {
						viewObj.cells[order].hidden = true;
					}
				}
				var inputrow = dom.selectSingleNode('./table/inputrow');
				if (inputrow) {
					this.grid_Experimental.visibleSearchBar =
						'true' == inputrow.getAttribute('visible') ? true : false;
					tableNd.removeChild(inputrow);
				} else {
					this.grid_Experimental.visibleSearchBar = false;
				}
				if (this.grid_Experimental.rowCount > 0) {
					this.removeAllRows();
				}
				this.grid_Experimental.nameColumns = nameColumns;
				this.grid_Experimental.set('structure', viewObj);

				var cells = this.grid_Experimental.layout.cells,
					gridOrder = this.grid_Experimental.order,
					inputs = this.grid_Experimental.inputRowCollections,
					cell;
				for (var k = 0; k < cells.length; k++) {
					cell = cells[k];
					cell.layoutIndex = viewObj.cells[k].layoutIndex;
					inputs[cell.field].index = gridOrder.indexOf(cell.layoutIndex);
				}

				if (isCalledFromPublic) {
					return true;
				}
				this.addXMLRows(xml);
			}
		},

		initXMLRows_Experimental: function (xml) {
			this.turnEditOff();

			this.RemoveAllRows();
			this.addXMLRows(xml);
		},

		isColumnVisible_Experimental: function (col) {
			return !this.grid_Experimental.layout.cells[col].hidden;
		},

		isEditable_Experimental: function () {
			return privateProps[this.propsId_Experimental].Editable;
		},

		isInputRowVisible_Experimental: function () {
			return this.grid_Experimental.visibleSearchBar;
		},

		removeAllRows_Experimental: function () {
			this.grid_Experimental.selection.clear();
			if (this.grid_Experimental.store) {
				this.grid_Experimental.setStore();
				var store = this._newStore_Experimental();
				this.grid_Experimental.setStore(store);
			}
		},

		requestFocus_Experimental: function () {
			var self = this;
			setTimeout(function () {
				var focus = self.grid_Experimental.focus;
				var view = self.grid_Experimental.views.views[0];
				var cellNod = view.getCellNode(focus.rowIndex, focus.cell.index);
				cellNod.focus();
			}, 10);
		},

		selectAll_Experimental: function () {
			if (this.grid_Experimental.rowCount) {
				this.grid_Experimental.selection.selectRange(
					0,
					this.grid_Experimental.rowCount - 1
				);
			}
		},

		setColumnProperties_Experimental: function (type, index) {
			this.grid_Experimental.layout.cells[
				this.grid_Experimental.order[index]
			].editableType = type.indexOf('COMBO') > 0 ? 'COMBO:0' : 'FIELD';
		},

		setEditable_Experimental: function (bool) {
			if (privateProps[this.propsId_Experimental].Editable != bool) {
				for (var i = 0; i < this.grid_Experimental.layout.cellCount; i++) {
					this.grid_Experimental.layout.cells[i].editable = bool;
				}
				privateProps[this.propsId_Experimental].Editable = bool;
			}
		},

		setColumnVisible_Experimental: function (col, bool, width) {
			if (bool) {
				this.grid_Experimental.layout.cells[col].unitWidth = width + 'px';
			} else {
				this.grid_Experimental.layout.cells[col].unitWidth = '0px';
			}
			this.grid_Experimental.layout.setColumnVisibility(col, bool);
		},

		setMultiselect_Experimental: function (value) {
			this.selection_Experimental.set('multi', value);
		},

		setNoRowSelect_Experimental: function (value) {
			this.selection_Experimental.set('none', value);
		},

		setSelectedRow_Experimental: function (rowID, multi, show) {
			if (!multi) {
				this.grid_Experimental.selection.clear();
			}
			var index = this.getRowIndex(rowID);
			if (index > -1) {
				if (this.grid_Experimental.selection.isSelected(index) && multi) {
					this.grid_Experimental.selection.setSelected(index, false);
				} else {
					this.grid_Experimental.selection.setSelected(index, true);
				}
				if (show) {
					this.grid_Experimental.scrollToRow(index);
				}
			}
		},

		showInputRow_Experimental: function (bool) {
			if (this.grid_Experimental.visibleSearchBar != bool) {
				this.grid_Experimental.visibleSearchBar = bool;
				this.grid_Experimental.update();
			}
		},

		turnEditOff_Experimental: function () {
			var editManager = this.grid_Experimental.edit;
			if (editManager.isEditing()) {
				if (editManager._isValidInput()) {
					editManager.apply();
				} else {
					editManager.cancel();
				}
			}
		},

		destroy_Experimental: function () {
			this.contexMenu_Experimental.menu.destroyRecursive(false);
			this.headerContexMenu_Experimental.menu.destroyRecursive(false);
			this.grid_Experimental.destroyRecursive(false);
			this.grid_Experimental = 'destroyed, please call constructor';
		},

		getColumnIndex_Experimental: function (columnName) {
			return GridModules.GetColumnIndex(this, columnName);
		},

		setColumnTypeManager_Experimental: function (
			columnTypeName,
			managerWidget
		) {
			if (columnTypeName) {
				privateProps[this.propsId_Experimental]._externalCellManagers[
					columnTypeName
				] = managerWidget;
			}
		},

		getListsById_Experimental: function () {
			return privateProps[this.propsId_Experimental]._listsById;
		},

		dropNewRowMarkers: function () {
			var newRowsCount =
				privateProps[this.propsId_Experimental]._newRowsCounter;

			if (newRowsCount) {
				var gridStore = this.grid_Experimental.store,
					storeItem,
					i;

				for (i = 0; i < gridStore._arrayOfTopLevelItems.length; i++) {
					storeItem = gridStore._arrayOfTopLevelItems[i];
					gridStore.setValue(storeItem, '_newRowMarker', 0);
				}

				privateProps[this.propsId_Experimental]._newRowsCounter = 0;
			}
		}
		//don't use "," after the last property all over the file, e.g, here because documentation will not be built
	});
});
