﻿/*jslint nomen: true */
/*global define*/
define([
	'dojo/_base/config',
	'dojo/date/stamp',
	'dojo/store/Memory',
	'dojo/dom-class',
	'dojo/_base/event',
	'dojo/_base/connect',
	'dojo/aspect',
	'./ContextMenu',
	'dijit/popup'
], function (
	config,
	DateIso,
	Memory,
	domClass,
	event,
	connect,
	aspect,
	ContextMenu,
	popup
) {
	'use strict';
	return {
		uniqueIdGenerator: {
			_uniqueIDNo: 0,
			get: function () {
				return (++this._uniqueIDNo).toString();
			}
		},

		initTextDirection: function (gridDomNode, direction) {
			gridDomNode.setAttribute(
				'class',
				'languageDirection_' +
					direction +
					' ' +
					gridDomNode.getAttribute('class')
			);
		},

		getXML: function (grid, useValues, withSubRows) {
			var getGridAttributesXML = function () {
				var xml = '';
				if (grid.isEditable()) {
					xml += "editable='true' ";
				}
				return xml;
			};

			var getHeaderRowAttributesXML = function (style) {
				var xml = '';
				for (var i = 0; i < style.length; i++) {
					var st = style[i].split(':');
					//TODO: it seems that such style of seting fonts should be replaced setting only one field font - but perhaps our, e.g., xsl uses them
					if (st[0] == 'font-family') {
						xml += " font-family='" + st[1] + "'";
					}
					if (style['font-size']) {
						xml += " font-size='" + st[1] + "'";
					}
					if (st[0] == 'font-style') {
						xml += " font-style='" + st[1] + "'";
					}
					if (st[0] == 'font-weight') {
						xml += " font-weight='" + st[1] + "'";
					}
					if (st[0] == 'background-color') {
						xml += " bgColor='" + st[1] + "'";
					}
					if (st[0] == 'color') {
						xml += " textColor='" + st[1] + "'";
					}
					if (st[0] == 'text-align') {
						xml += " align='" + st[1].substr(0, 1) + "'";
					}
				}
				return xml;
			};

			var compareColumnsByLayoutIndex = function (column1, column2) {
				if (column1.layoutIndex < column2.layoutIndex) {
					return -1;
				}
				if (column1.layoutIndex === column2.layoutIndex) {
					return 0;
				}
				if (column1.layoutIndex > column2.layoutIndex) {
					return 1;
				}
			};

			var getColumnAttributesXML = function (column) {
				var xml = '',
					style,
					styleLength;
				xml += " width='" + parseInt(column.unitWidth) + "'";
				//TODO: here mistake: edit can be like FilterComboBox, null, but should be EDIT, COMBO:0...
				xml += " edit='" + column.editableType + "'";
				if (!column.sort) {
					xml += " sort='NOSORT'";
				} else if ('NUMERIC' === column.sort) {
					xml += " sort='NUMERIC'";
				} else if ('DATE' === column.sort) {
					xml += " sort='DATE'";
				}
				if (column.locale) {
					xml += " locale='" + column.locale + "'";
				}
				xml +=
					" order='" + grid.grid_Experimental.order[column.layoutIndex] + "'";
				if (column.bginvert) {
					xml += " bgInvert='" + column.bginvert + "'";
				}
				if (column.hidden) {
					xml += ' resizable="' + !column.hidden + '"';
				}
				if (column.styles) {
					style = column.styles.split(';');
					styleLength = style.length;
					for (var i = 0; i < styleLength; i++) {
						var st = style[i].split(':');
						if (st[0] == 'text-align') {
							//do not use st[1].substr(0, 1) instead of st[1], because, e.g., exportToExcel require full names
							xml += " align='" + st[1] + "'";
						}
					}
				}

				return xml;
			};

			var getGridHeadXML = function () {
				var colsCount = grid.GetColumnCount(),
					xml = '<thead>',
					cell,
					cells = grid.grid_Experimental.layout.cells
						.slice(0)
						.sort(compareColumnsByLayoutIndex);
				for (var i = 0; i < colsCount; i++) {
					cell = cells[i];
					xml +=
						'<th' +
						getHeaderRowAttributesXML(cell.headerStyles.split(';')) +
						'>';
					xml += ' ' === cell.name ? '' : encodeHTML(cell.name);
					xml += '</th>';
				}
				xml += '</thead>';
				xml += '<columns>';
				for (i = 0; i < colsCount; i++) {
					cell = cells[i];
					xml += '<column' + getColumnAttributesXML(cell) + ' />';
				}
				xml += '</columns>';
				return xml;
			};

			var getRowAttributesXML = function (rowId) {
				var xml = '';
				xml += " id='" + rowId + "'";
				if (rowId) {
					xml += " action='" + rowId + "'";
				}
				if (
					grid.grid_Experimental.selection.isSelected(grid.getRowIndex(rowId))
				) {
					xml += " selected='true'";
				}
				if (grid.rowHeight) {
					xml += " height='" + grid.rowHeight + "'";
				}
				return xml;
			};

			var getCellAttributesXML = function (cell) {
				var xml = '',
					font = cell.getFont(),
					bgColor = cell.getBgColor(),
					textColor = cell.getTextColor();

				if (font) {
					xml += ' font="' + font + '"';
				}
				if (bgColor) {
					xml += ' bgColor="' + bgColor.replace(/!important/, '') + '"';
				}
				if (textColor) {
					xml += ' textColor="' + textColor + '"';
				}

				return xml;
			};

			var encodeHTML = function (html) {
				if (typeof html == 'string') {
					return html
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&apos;');
				}
				return html;
			};

			var getCellXML = function (cell) {
				//TODO: implement useValues - e.g., it can be usefull to select choose values or labels from MVLisp, but perhaps to remove, complecated logic for each type of field, for simple text example it gives the same results
				var xml =
					'<td' +
					getCellAttributesXML(cell) +
					'>' +
					encodeHTML(cell.getValue()) +
					'</td>';
				return xml;
			};

			var getRowXml = function (rowId) {
				var xml = '<tr' + getRowAttributesXML(rowId) + '>',
					i,
					cell,
					colsCount = grid.GetColumnCount();

				for (i = 0; i < colsCount; i++) {
					cell = grid.cells_Experimental(rowId, i, true);
					xml += getCellXML(cell);
				}

				//TODO: add logic of userdata

				//TODO: add logic of withSubRows, blocked by implementation of getChildItemsId
				//if (withSubRows && this.getChildItemsId) {
				//}

				xml += '</tr>';
				return xml;
			};

			var gridXml = '<table ',
				rows = [],
				i;

			//TODO: code below is partial copy of getVisibleItemIDs() to fill rows array, but avoid excessive join-split logic.
			//Should be reviewed after introducing the new grid intead of dojo grid.
			const items = grid.grid_Experimental.store._getItemsArray();

			for (i = 0; i < items.length; i++) {
				rows.push(grid.grid_Experimental.store.getIdentity(items[i]));
			}

			var rowsCount = rows.length;

			gridXml += getGridAttributesXML() + '>';
			gridXml += getGridHeadXML();
			for (i = 0; i < rowsCount; i++) {
				gridXml += getRowXml(rows[i]);
			}
			gridXml += '</table>';
			return gridXml;
		},

		inputRow: function (grid) {
			var setters = {
					value: function (index, value) {
						var field =
								'string' === typeof index
									? index
									: this.grid.nameColumns[index],
							obj = this.grid.inputRowCollections[field],
							type =
								'dijit.form.DropDownButton' === obj.declaredClass
									? 'label'
									: 'value';

						if ('dijit.form.DateTextBox' === obj.declaredClass && value) {
							value = DateIso.fromISOString(value);
						} else if (
							'Aras.Client.Controls.Experimental._grid.CheckedMultiSelect' ===
							obj.declaredClass
						) {
							if (value === '' || value === null || value === undefined) {
								//apply workaround for dojo bug as pointed in https://bugs.dojotoolkit.org/ticket/16606
								var childItems, i;

								obj.reset();
								obj._updateSelection();
								childItems = obj._getChildren();
								for (i = 0; i < childItems.length; i++) {
									domClass.remove(
										childItems[i].iconNode,
										'dijitCheckBoxChecked dijitChecked'
									);
								}
								value = [];
							} else {
								value = value.split(',');
							}
						}
						obj.set(type, value);
						if (type === 'label') {
							obj.domNode.classList.toggle('hideArrowButton', value);
						}
					},
					disabled: function (index, value) {
						var field =
								'string' === typeof index
									? index
									: this.grid.nameColumns[index],
							obj = this.grid.inputRowCollections[field];
						obj.set('disabled', value === true);
					},
					comboList: function (index, values, labels) {
						var field =
								'string' === typeof index
									? index
									: this.grid.nameColumns[index],
							obj = this.grid.inputRowCollections[field],
							data = [],
							i;

						if ('dijit.form.FilteringSelect' === obj.declaredClass) {
							labels = labels || values;
							for (i = 0; i < values.length; i += 1) {
								data.push({ name: values[i], id: labels[i] });
							}
							obj.set('store', new Memory({ data: data }));
						}
					},
					visible: function (value) {
						if (this.grid.visibleSearchBar !== value) {
							this.grid.visibleSearchBar = value;
							this.grid.update();
						}
					}
				},
				getters = {
					value: function (index) {
						var field =
							'string' === typeof index ? index : this.grid.nameColumns[index];
						var obj = this.grid.inputRowCollections[field],
							type =
								'dijit.form.DropDownButton' === obj.declaredClass
									? 'label'
									: 'value',
							value = obj.get(type);

						if ('dijit.form.DateTextBox' === obj.declaredClass) {
							value = value ? DateIso.toISOString(obj.get(type)) : '';
						} else if (
							'Aras.Client.Controls.Experimental._grid.CheckedMultiSelect' ===
							obj.declaredClass
						) {
							value = obj.get(type).join(',');
						}
						return value;
					},
					disabled: function (index) {
						var field =
							'string' === typeof index ? index : this.grid.nameColumns[index];
						var obj = this.grid.inputRowCollections[field];
						return obj.get('disabled');
					},
					visible: function () {
						return this.grid.visibleSearchBar;
					}
				};

			return {
				grid: grid,

				set: function (index, key, value) {
					if (2 === arguments.length && getters[index]) {
						setters[index].call(this, key);
						return;
					}
					var field =
							'string' === typeof index ? index : this.grid.nameColumns[index],
						inputRow = this.grid.inputRowCollections[field],
						args;

					if (setters[key] && inputRow) {
						args = Array.prototype.slice.call(arguments, 2);
						args.splice(0, 0, index);
						setters[key].apply(this, args);
					} else {
						throw (
							"Grid message: can't call setter " +
							key +
							' in inputRow with value ' +
							value +
							', column ' +
							index
						);
					}
				},

				get: function (index, key) {
					if (1 === arguments.length && getters[index]) {
						return getters[index].call(this);
					}
					var field =
							'string' === typeof index ? index : this.grid.nameColumns[index],
						inputRow = this.grid.inputRowCollections[field];

					if (getters[key] && inputRow) {
						return getters[key].call(this, field);
					}
					throw (
						"Grid message: can't call getter " +
						key +
						' in inputRow, column ' +
						index
					);
				}
			};
		},

		items: function (grid) {
			// grid = gridPublicContainer or TreeGridPublicContainer
			var store = function () {
					return grid._store || grid.grid_Experimental.store;
				},
				setters = {
					value: function (item, field, value) {
						store().setValue(item, field, value);
					}
				},
				getters = {
					value: function (item, field) {
						return store().getValue(item, field);
					},
					id: function (item) {
						return store().getIdentity(item);
					}
				};

			return {
				grid: grid.grid_Experimental,

				onNew: function (id) {
					//this is event call when add new row in grid
				},

				isDirty: function (id) {
					var item = store()._getItemByIdentity(id);
					if (item > -1) {
						return store().isDirty(item);
					}
				},

				add: function (item) {
					if (this.grid.edit.isEditing()) {
						this.grid.edit.apply();
					}
					this.grid.beginUpdate();
					store().newItem(item);
					store().save();
					this.grid.endUpdate();
				},

				remove: function (id) {
					var item = store()._getItemByIdentity(id);
					if (item) {
						store().deleteItem(item);
					}
				},

				getAllId: function () {
					var result = [],
						onComplete = function (items) {
							var i,
								length = items.length;
							for (i = 0; i < length; i += 1) {
								result.push(store().getIdentity(items[i]));
							}
						};
					onComplete.bind(this);
					store().fetch({ onComplete: onComplete });
					return result;
				},

				is: function (id) {
					return !!this.grid.store._getItemByIdentity(id);
				},

				set: function (id, key, value) {
					var item = store()._getItemByIdentity(id),
						args;
					if (setters[key] && item) {
						args = Array.prototype.slice.call(arguments, 2);
						args.splice(0, 0, item);
						setters[key].apply(this, args);
					}
				},

				get: function (id, key, field) {
					var item = null;
					if ('id' === key) {
						item = this.grid.getItem(id);
					} else {
						item = store()._getItemByIdentity(id);
					}
					if (getters[key] && item) {
						return getters[key].call(this, item, field);
					}
				}
			};
		},

		columns: function (grid) {
			// grid = arasDataGrid or arasTreeGrid
			var setters = {
					editable: function (index, value) {
						this.grid.getCell(index).editable = value;
					},
					editType: function (index, type) {
						this.grid.getCell(index).editableType = type;
					},
					comboList: function (index, list, lables) {
						this.grid.getCell(index).options = list;
						this.grid.getCell(index).optionsLables = lables;
					},
					formatter: function (index, func) {
						this.grid.getCell(index).formatter = func;
					}
				},
				getters = {
					editable: function (index) {
						return this.grid.getCell(index).editable;
					},
					index: function (index) {
						return this.grid.order.indexOf(index);
					},
					name: function (index) {
						return this.grid.nameColumns[index];
					},
					count: function () {
						return this.grid.layout.cellCount;
					},
					width: function (index) {
						var cell = this.grid.getCell(index);
						return cell.unitWidth || cell.width;
					}
				};

			return {
				grid: grid,

				set: function (field, key, value) {
					var index =
							'string' === typeof field
								? this.grid.nameColumns.indexOf(field)
								: this.grid.order[field],
						args;
					if (setters[key] && index > -1) {
						args = Array.prototype.slice.call(arguments, 2);
						args.splice(0, 0, index);
						setters[key].apply(this, args);
					}
				},

				get: function (field, key) {
					if (1 === arguments.length && getters[field]) {
						return getters[field].call(this);
					}
					var index =
						'string' === typeof field
							? this.grid.nameColumns.indexOf(field)
							: this.grid.order[field];
					if (getters[key] && index > -1) {
						return getters[key].call(this, index);
					}
				}
			};
		},

		edit: function (grid) {
			// grid = arasDataGrid or arasTreeGrid

			return {
				grid: grid,

				setErrorMessage: function (message) {
					if (this.grid.edit.isEditing()) {
						var editorWidget = this.grid.edit.info.cell.widget;

						if (editorWidget) {
							editorWidget.invalidMessage = message;
							editorWidget.focus();
							return true;
						}
					}
					return false;
				},

				set: function (id, field) {
					var columnIndex =
							'string' === typeof field
								? this.grid.nameColumns.indexOf(field)
								: this.grid.order[field],
						cell = this.grid.getCell(columnIndex),
						item = this.grid.store._getItemByIdentity(id),
						index = item ? this.grid.getItemIndex(item) : -1;
					this.grid.focus.setFocusCell(cell, index);
					this.grid.edit.setEditCell(cell, index);
				}
			};
		},

		focus: function (grid) {
			// grid = arasDataGrid or arasTreeGrid

			return {
				grid: grid,

				isLastCell: function () {
					return this.grid.focus.isLastFocusCell();
				},

				isFirstCell: function () {
					return this.grid.focus.isFirstFocusCell();
				}
			};
		},

		selection: function (grid) {
			// grid = arasDataGrid or arasTreeGrid

			var setters = {
					multi: function (value) {
						var select = true === value ? 'extended' : 'single';
						this.grid.set('selectionMode', select);
						this.grid.selection.setMode(select);
					},
					none: function (value) {
						var select = true === value ? 'none' : 'single';
						this.grid.set('selectionMode', select);
						this.grid.selection.setMode(select);
					}
				},
				getters = {
					id: function () {
						var selectedItems = this.grid.selection.getSelected();
						if (selectedItems.length) {
							return this.grid.store.getIdentity(selectedItems[0]);
						}
						return '';
					},
					index: function () {
						var selectedItems = this.grid.selection.getSelected();
						if (selectedItems.length) {
							return this.grid.getItemIndex(selectedItems[0]);
						}
						return -1;
					},
					ids: function () {
						var result = [],
							i,
							selectedItems = this.grid.selection.getSelected();

						for (i = 0; i < selectedItems.length; i++) {
							result.push(this.grid.store.getIdentity(selectedItems[i]));
						}
						return result;
					}
				};

			return {
				grid: grid,

				clear: function () {
					this.grid.selection.clear();
				},

				set: function (key, value) {
					if (setters[key]) {
						var args = Array.prototype.slice.call(arguments, 1);
						setters[key].apply(this, args);
					} else {
						throw "Grid message: can't call getter " + key + ' in Selection';
					}
				},

				get: function (key) {
					if (getters[key]) {
						return getters[key].call(this);
					}
					throw "Grid message: can't call getter " + key + ' in Selection';
				}
			};
		},

		events: {
			onRowDblClick: function (e) {
				var rowId = this.grid_Experimental.store.getIdentity(
						this.grid_Experimental.getItem(e.rowIndex)
					),
					columnIndex = e.cell && e.cell.layoutIndex;

				this.gridDoubleClick(rowId, columnIndex, e.ctrlKey || e.metaKey);
			},

			onSelected: function (index) {
				if (parseInt(index, 10) > -1) {
					var mode = 'multiple' === this.grid_Experimental.selectionMode;
					var item = this.grid_Experimental.getItem(index);
					//todo: investigate dojo code why _grid.getItem returns null, but _grid.store contains this item
					if (item) {
						this.gridRowSelect(
							this.grid_Experimental.store.getValue(item, 'uniqueId'),
							mode
						);
					}
				}
			},

			onMoveColumn: function () {
				var cells = this.grid_Experimental.layout.cells,
					order = this.grid_Experimental.order,
					nameColumns = this.grid_Experimental.nameColumns,
					inputs = this.grid_Experimental.inputRowCollections,
					cell,
					i;
				for (i = 0; i < cells.length; i++) {
					cell = cells[i];
					order[cell.layoutIndex] = i;
					nameColumns[i] = cell.field;
					inputs[cell.field].index = cells[cell.layoutIndex].layoutIndex;
				}
				this.grid_Experimental.resize();
			},

			onRowContextMenu: function (e) {
				if (
					!this.grid_Experimental._canDoOperationsOnCell(e.cell, e.rowIndex)
				) {
					event.stop(e);
					return;
				}
				if (this.grid_Experimental.edit.isEditing()) {
					this.grid_Experimental.edit.apply();
				}
				//TODO: eliminate this code duplication. Duplicates onHeaderEvent code.
				if (e.cell) {
					var rowIndex = e.rowIndex,
						rowId = this.grid_Experimental.store.getIdentity(
							this.grid_Experimental.getItem(rowIndex)
						),
						columnIndex = e.cell.layoutIndex;
					this.contexMenu_Experimental.rowId = rowId;
					this.contexMenu_Experimental.columnIndex = columnIndex;
					var isMenuInited = this.gridMenuInit(rowId, columnIndex);

					this.grid_Experimental.focus.setFocusIndex(rowIndex, e.cell.index);

					if (!isMenuInited) {
						event.stop(e);
					}
				} else {
					//if there is no cell it means the click was done on a white area. And we do not want to see menu in this case.
					event.stop(e);
				}
			},

			onHeaderEvent: function (e) {
				if (e.type == 'contextmenu') {
					this.grid_Experimental.headerMenu = this.headerContexMenu_Experimental.menu;

					//TODO: eliminate this code duplication. Duplicates onRowContextMenu code.
					var rowId = 'header_row';
					this.headerContexMenu_Experimental.rowId = rowId;
					if (e.cell) {
						var columnIndex = e.cell.index;
						this.gridMenuInit(rowId, columnIndex);
						this.headerContexMenu_Experimental.columnIndex = columnIndex;
					}
				}
			},

			onRowClick: function (e) {
				// Ctrl+click/shift remove row from selection and toolbar didn't updated
				if (
					(this.grid_Experimental.selection.isSelected(e.rowIndex) ||
						e.ctrlKey ||
						e.metaKey ||
						e.shiftKey) &&
					e.cell
				) {
					this.gridClick(this.getRowId(e.rowIndex), e.cell.layoutIndex);
				}
			},

			gridLinkClick: function (e) {
				var link = this.grid_Experimental.store.getValue(
					this.grid_Experimental.getItem(e.rowIndex),
					e.cell.field + 'link'
				);
				this.gridLinkClick(link, e.ctrlKey || e.metaKey);
			},

			onStartEdit: function (cell, indexRow) {
				var rowId = this.grid_Experimental.store.getIdentity(
					this.grid_Experimental.getItem(indexRow)
				);
				this.onStartEdit_Experimental(rowId, cell.field);
			},

			onApplyCellEdit: function (value, indexRow, field) {
				var rowId = this.grid_Experimental.store.getIdentity(
					this.grid_Experimental.getItem(indexRow)
				);
				this.onApplyEdit_Experimental(rowId, field, value);
			},

			onCancelEdit: function (indexRow) {
				var rowId = this.grid_Experimental.store.getIdentity(
					this.grid_Experimental.getItem(indexRow)
				);
				this.onCancelEdit_Experimental(rowId);
			},

			dokeydown: function (ev) {
				this.gridKeyPress(ev);

				//Ctrl+A selection handler
				var isMacOS = /mac/i.test(navigator.platform);
				var isCtrlPressed = isMacOS ? ev.metaKey : ev.ctrlKey;
				if (isCtrlPressed && 'a' === ev.key) {
					event.stop(ev);
					this.selectAll();
				}
			},

			onFocusInputRow: function (rowId, field) {
				this.onStartEdit_Experimental(rowId, field);
				var cell = this.cells(rowId, this.getColumnIndex(field));
				this.gridSelectCell(cell);
			},

			onChangeInputRow: function (rowId, field) {
				this.onApplyEdit_Experimental(rowId, field);
			},

			onInputHelperShow: function (rowId, column) {
				this.onInputHelperShow_Experimental(rowId, column);
			},

			onStartSearch: function () {
				this.onStartSearch_Experimental();
			},

			// this - dojo DataGrid or dojo TreeGrid
			//TODO: applied only for TreeGrid - to move method
			onStyleRow: function (inRow) {
				var gridItem = this.getItem(inRow.index);

				if (gridItem) {
					var id = this.store.getIdentity(gridItem),
						styleRow;

					if (this.styleGrid[id] && this.styleGrid[id].styleRow) {
						styleRow = this.styleGrid[id].styleRow;
						for (var styleItem in styleRow) {
							if (styleRow.hasOwnProperty(styleItem)) {
								inRow.customStyles +=
									styleItem + ':' + styleRow[styleItem] + ';';
							}
						}
					}
				}
			},

			onBlur: function () {
				this.edit._applyStarted = true;
				this.edit.apply();
			}
		},

		// grid DnD functionality
		dnd: function (gridContainer) {
			var dndModule = {
				gridContainer: gridContainer,
				gridWidget: gridContainer.grid_Experimental,
				gridView: null,
				dragContainer: null,
				dragSourceRowNode: null,
				dragTargetRowId: null,
				dragStarted: false,
				isDragPending: false,
				startPoint: null,
				dropPoint: null,
				dragDelay: 10,
				visibleColumnsCount: 4,
				ctrlKeyState: false,
				_isMacOs: /mac/i.test(navigator.platform),
				styling: {
					containerNode: 'dndDragNodeContainer',
					avatarNode: 'dndDragAvatar',
					sourceNode: 'dndDragSource',
					placeholderNode: 'dndDragPlaceholder'
				},
				onMouseDownRowIndex: null,

				init: function () {
					aspect.after(
						this.gridWidget,
						'buildViews',
						function () {
							this.gridView = this.gridWidget.views.views[0];
							this.attachDnDEventListeners();
						}.bind(this)
					);
				},

				// method used to attach mouse event listeners to current gridView
				attachDnDEventListeners: function () {
					connect.connect(
						this.gridView.contentNode,
						'mousedown',
						this,
						this.processDnDEvent
					);
					connect.connect(
						this.gridView.scrollboxNode,
						'mouseup',
						this,
						this.processDnDEvent
					);
					connect.connect(
						this.gridView.scrollboxNode,
						'mouseenter',
						this,
						this.processDnDEvent
					);
					connect.connect(
						this.gridView.scrollboxNode,
						'mousemove',
						this,
						this.processDnDEvent
					);
					connect.connect(
						this.gridView.scrollboxNode,
						'mouseleave',
						this,
						this.processDnDEvent
					);
					connect.connect(
						this.gridView.scrollboxNode,
						'keydown',
						this,
						this.processDnDEvent
					);
					connect.connect(
						this.gridView.scrollboxNode,
						'keyup',
						this,
						this.processDnDEvent
					);
				},

				createDragContainer: function () {
					this.dragContainer = {
						containerNode: document.createElement('div'),
						avatarNode: document.createElement('div'),
						sourceNode: document.createElement('div'),
						placeholderNode: document.createElement('div')
					};

					this.dragContainer.containerNode.appendChild(
						this.dragContainer.avatarNode
					);
					this.dragContainer.containerNode.appendChild(
						this.dragContainer.sourceNode
					);
					document.body.appendChild(this.dragContainer.containerNode);

					// apply node styles
					this.dragContainer.sourceNode.innerHTML = this.cleanupCssStyles(
						this.dragSourceRowNode.outerHTML
					);

					this.dragContainer.containerNode.className = this.styling.containerNode;
					this.dragContainer.avatarNode.className = this.styling.avatarNode;
					this.dragContainer.sourceNode.className = this.styling.sourceNode;
					this.dragContainer.placeholderNode.className = this.styling.placeholderNode;
					this.dragContainer.placeholderNode.style.width =
						this.getRowContentWidth(this.dragSourceRowNode) + 'px';

					var sourceWidth = 0,
						columnIndex = 0,
						columnsToAdd = this.visibleColumnsCount,
						layoutCell;

					while (
						columnsToAdd &&
						columnIndex < this.gridWidget.layout.cellCount
					) {
						layoutCell = this.gridWidget.layout.cells[columnIndex];

						if (!layoutCell.hidden) {
							sourceWidth += parseInt(layoutCell.width);
							columnsToAdd--;
						}

						columnIndex++;
					}

					this.dragContainer.sourceNode.style.width = sourceWidth + 'px';
					this.drawAvatar();
				},

				drawAvatar: function () {
					if (this.dragContainer) {
						this.dragContainer.avatarNode.innerHTML = this.ctrlKeyState
							? 'Copying'
							: 'Moving';
					}
				},

				getRowContentWidth: function (rowNode) {
					var contentWidth = 0,
						i;

					for (i = 0; i < rowNode.childNodes.length; i++) {
						contentWidth += rowNode.childNodes[i].offsetWidth;
					}

					return contentWidth;
				},

				repositionDragContainer: function (mouseX, mouseY) {
					if (this.dragContainer) {
						var containerNode = this.dragContainer.containerNode;

						containerNode.style.left = mouseX + 40 + 'px';
						containerNode.style.top =
							parseInt(mouseY - containerNode.offsetHeight / 2) + 'px';
					}
				},

				cleanupCssStyles: function (nodeHtml) {
					return nodeHtml.replace(
						/dojoxGridRowSelected|dojoxGridRowOver|dojoxGridCellFocus/g,
						''
					);
				},

				destroyDragContainer: function () {
					if (this.dragContainer) {
						var placeholderParent = this.dragContainer.placeholderNode
							.parentNode;

						if (placeholderParent) {
							this.gridView.contentNode.style.height =
								this.gridView.contentNode.offsetHeight -
								this.dragContainer.placeholderNode.offsetHeight +
								'px';
							placeholderParent.removeChild(this.dragContainer.placeholderNode);
						}

						document.body.removeChild(this.dragContainer.containerNode);
						this.dragContainer = null;
					}
				},

				searchDropTarget: function (e) {
					if (e.rowIndex >= 0) {
						var targetRowIndex = e.rowIndex,
							targetRowNode = this.gridView.rowNodes[targetRowIndex],
							parentNode = targetRowNode.parentNode,
							targetRowRectangle = targetRowNode.getBoundingClientRect(),
							middleY = parseInt(
								targetRowRectangle.top + targetRowRectangle.height / 2
							),
							placeholderAttached = this.dragContainer.placeholderNode
								.parentNode,
							targetRowId;

						if (e.pageY < middleY) {
							if (e.rowIndex > 0) {
								targetRowIndex = targetRowIndex - 1;
							} else {
								targetRowIndex = -1;
							}
						}

						targetRowId =
							targetRowIndex === -1
								? ''
								: this.gridContainer.getRowId(targetRowIndex);

						if (
							this.dragTargetRowId === null ||
							this.dragTargetRowId !== targetRowId
						) {
							if (targetRowIndex == -1) {
								this.dragTargetRowId = '';
							} else {
								this.dragTargetRowId = targetRowId;
							}

							if (targetRowIndex + 1 < this.gridWidget.rowCount) {
								parentNode.insertBefore(
									this.dragContainer.placeholderNode,
									this.gridView.rowNodes[targetRowIndex + 1]
								);
							} else {
								parentNode.appendChild(this.dragContainer.placeholderNode);
							}
						}

						// if placeholder was just added to contentNode, then adjust contentNode height
						if (!placeholderAttached) {
							this.gridView.contentNode.style.height =
								this.gridView.contentNode.scrollHeight + 'px';
						}

						//this.dragContainer.avatarNode.style.backgroundColor = "#1f6d42";
						return true;
					} else {
						//this.dragContainer.avatarNode.style.backgroundColor = "#b83b1d";
						return false;
					}
				},

				processDnDEvent: function (e) {
					switch (e.type) {
						case 'mouseup':
							this.gridView.content.decorateEvent(e);
							this.onMouseUp(e);
							break;
						case 'mousedown':
							this.gridView.content.decorateEvent(e);
							this.onMouseDown(e);
							break;
						case 'mousemove':
							this.gridView.content.decorateEvent(e);
							this.onMouseMove(e);
							break;
						//mouseout
						case 'mouseout':
						case 'mouseleave':
							this.onMouseLeave(e);
							break;
						case 'keydown':
							this.onKeyDown(e);
							break;
						case 'keyup':
							this.onKeyUp(e);
							break;
					}
				},

				canStartDrag: function (e) {
					if (this.isDragPending) {
						if (
							Math.abs(e.pageX - this.startPoint.x) > this.dragDelay ||
							Math.abs(e.pageY - this.startPoint.y) > this.dragDelay
						) {
							this.gridContainer.setSelectedRow(
								this.gridContainer.getRowId(this.onMouseDownRowIndex),
								true,
								false
							);
							return this.gridContainer.canDragDrop_Experimental(e);
						}
					}

					return false;
				},

				beginDrag: function () {
					this.createDragContainer();
					this.isDragPending = false;
					this.dragStarted = true;

					// execute onDragStart_Experimental event handler
					if (this.gridContainer.onDragStart_Experimental) {
						this.gridContainer.onDragStart_Experimental();
					}
				},

				endDrag: function (dropAllowed, e) {
					if (this.dragStarted) {
						this.destroyDragContainer();
						this.dragStarted = false;

						if (dropAllowed) {
							// execute onDragDrop_Experimental event handler
							if (this.gridContainer.onDragDrop_Experimental) {
								this.gridContainer.onDragDrop_Experimental(
									this.dragTargetRowId,
									this.ctrlKeyState
								);
							}
						}
					}

					this.isDragPending = false;
				},

				onMouseDown: function (e) {
					if (e.button === 0 && e.rowIndex >= 0) {
						if (
							this.gridContainer.isEditable() &&
							!this.gridWidget.edit.isEditing()
						) {
							this.dragSourceRowNode = e.rowNode;
							this.startPoint = { x: e.pageX, y: e.pageY };
							this.onMouseDownRowIndex = e.rowIndex;
							this.isDragPending = true;
						}
					}
				},

				onMouseUp: function (e) {
					this.dropPoint = { x: e.pageX, y: e.pageY };
					this.endDrag(true, e);
				},

				onMouseMove: function (e) {
					if (this.dragStarted) {
						this.repositionDragContainer(e.pageX, e.pageY);
						this.searchDropTarget(e);
					} else if (this.canStartDrag(e)) {
						this.beginDrag();

						this.refreshCtrlState(e);
						this.repositionDragContainer(e.pageX, e.pageY);
					}
				},

				onMouseLeave: function (e) {
					this.endDrag(false);
				},

				onKeyDown: function (e) {
					if (this.dragStarted) {
						switch (e.keyCode) {
							case 27:
								// if escape pressed, then stop dragging
								this.endDrag(false);
								break;
							case 17:
								this.refreshCtrlState(e);
								break;
						}
					}
				},

				onKeyUp: function (e) {
					if (this.dragStarted) {
						switch (e.keyCode) {
							case 17:
								this.refreshCtrlState(e);
								break;
						}
					}
				},

				refreshCtrlState: function (e) {
					var isCtrlPressed = this._isMacOs ? e.metaKey : e.ctrlKey;

					if (isCtrlPressed !== this.ctrlKeyState) {
						this.ctrlKeyState = isCtrlPressed;

						if (this.dragStarted) {
							this.drawAvatar();
						}
					}
				}
			};

			dndModule.init();
			return dndModule;
		},

		redline: function (grid) {
			return {
				gridContainer: grid,
				dataGrid: grid.grid_Experimental,
				isInitialized: false,
				compareColumnList: [],
				baselineRows: [],
				baselineTableRows: [],
				isRedlineActive: false,
				defaultRowStatus: { rowStatus: 'initial', baselineIndex: undefined },
				gridRowIdPrefix: 'rlrow',
				gridRowIdIndex: 0,
				_rowStyleHandler: null,
				styling: {
					deletedRow: 'redlineDeletedRow',
					newRow: 'redlineNewRow',
					baseValue: 'redlineValue',
					baseValueContainer: 'redlineValueContainer',
					divLineThrough: 'redlineDivLine'
				},

				addGridColumnsToCompareList: function () {
					var i = 0;

					for (; i < this.dataGrid.layout.cellCount; i++) {
						this.compareColumnList.push(this.dataGrid.layout.cells[i].field);
					}
				},

				addColumnToCompareList: function (columnName) {
					if (this.compareColumnList.indexOf(columnName) == -1) {
						this.compareColumnList.push(columnName);
					}
				},

				attachRowStyleHandler: function () {
					this._rowStyleHandler = connect.connect(
						this.dataGrid,
						'onStyleRow',
						this,
						function (row) {
							var storeItem = this.dataGrid.getItem(row.index);
							if (storeItem && storeItem.redlineStatus) {
								var redlineRowStatus = this.dataGrid.store.getValue(
									storeItem,
									'redlineStatus'
								);

								switch (redlineRowStatus.rowStatus) {
									case 'deleted':
										row.customClasses += ' ' + this.styling.deletedRow;
										break;
									case 'new':
										row.customClasses += ' ' + this.styling.newRow;
										break;
								}
							}
						}
					);
				},

				detachRowStyleHandler: function () {
					if (this._rowStyleHandler) {
						this._rowStyleHandler.remove();
					}
				},

				clearCompareList: function () {
					this.compareColumnList.length = 0;
				},

				enableRedlineMode: function (doEnabled) {
					if (this.isRedlineActive != doEnabled) {
						this.isRedlineActive = doEnabled;

						if (this.isRedlineActive) {
							// some actions during redline activation
							this.attachRowStyleHandler();
						} else {
							this.dataGrid.beginUpdate();
							this.clearGridStore();
							this.dataGrid.endUpdate();

							this.detachRowStyleHandler();
						}
					}
				},

				formatBaseValue: function (structureCell, baseValue, cellInfo) {
					var formattedValue,
						formatType = 'simple',
						i;

					if ('boolean' === typeof baseValue) {
						formatType = 'boolean';
					} else if (/^(&lt;|<)img[\w\W]*>$/.test(baseValue)) {
						var cellTopIndent = 4,
							cellBottomIndent = 4,
							rowHeight = this.gridContainer.rowHeight,
							maxSize = rowHeight - (cellTopIndent + cellBottomIndent),
							styleImg =
								'margin: 0px; max-height: ' +
								maxSize +
								'px; max-width: ' +
								maxSize +
								'px;';

						if (/src=['"]{2}/.test(baseValue)) {
							baseValue = '';
						} else {
							formatType = 'image';
							var imgSrc = this.gridContainer.formatter_Experimental.getImgSrcAttribute(
								baseValue
							);
							baseValue =
								'<img style="' + styleImg + '" src="' + imgSrc + '" />';
						}
					} else {
						var listId = cellInfo && cellInfo.listId,
							list;
						//listId can be 0 and it's truly value, so don't use "if (listId)..."
						if (listId !== undefined && listId !== '') {
							list = structureCell.cellLayoutLists[listId];
						}

						var editableType =
								(cellInfo && cellInfo.editableType) ||
								structureCell.editableType,
							optionsLables = list ? list.labels : structureCell.optionsLables,
							options = list ? list.values : structureCell.options;

						var converter = dojoConfig.arasContext.converter;
						if (optionsLables && optionsLables.length) {
							if ('CheckedMultiSelect' === editableType) {
								if (baseValue && baseValue !== '') {
									var valueArray = baseValue.split(',');

									baseValue = optionsLables[options.indexOf(valueArray[0])];
									for (i = 1; i < valueArray.length; i++) {
										baseValue +=
											', ' + optionsLables[options.indexOf(valueArray[i])];
									}
								} else {
									baseValue = '';
								}
							} else {
								baseValue =
									optionsLables[options.indexOf(baseValue)] || baseValue;
							}
						} else if ('NUMERIC' === structureCell.sort) {
							if (structureCell.inputformat) {
								baseValue = converter.convertFromNeutral(
									baseValue,
									'decimal',
									structureCell.inputformat
								);
							} else {
								baseValue = converter.convertFromNeutral(baseValue, 'float');
							}
						} else if (
							'DATE' === structureCell.sort &&
							structureCell.inputformat
						) {
							baseValue = converter.convertFromNeutral(
								baseValue,
								'date',
								structureCell.inputformat
							);
						}
					}

					switch (formatType) {
						case 'simple':
							baseValue = this._escapeHtml(baseValue);
							formattedValue =
								"<div class='" +
								this.styling.baseValue +
								' ' +
								this.styling.baseValueContainer +
								"'>";
							formattedValue += baseValue;
							formattedValue += '</div>';
							break;
						case 'boolean':
							formattedValue =
								"<div class='" +
								this.styling.baseValue +
								' ' +
								this.styling.baseValueContainer +
								"'>";
							formattedValue +=
								"<input class='arasCheckboxOrRadio' type='checkbox' onclick='return false'";
							formattedValue += baseValue ? 'checked' : '';
							formattedValue += ' /><label></label>';
							formattedValue +=
								"<div class='" + this.styling.divLineThrough + "'></div>";
							formattedValue += '</div>';
							break;
						case 'image':
							formattedValue =
								"<div class='" +
								this.styling.baseValue +
								' ' +
								this.styling.baseValueContainer +
								"'>";
							formattedValue += baseValue;
							formattedValue +=
								"<div class='" + this.styling.divLineThrough + "'></div>";
							formattedValue += '</div>';
							break;
					}

					return formattedValue;
				},

				initialize: function () {
					if (!this.isInitialized) {
						// some initialization, before using redline functionality
						var self = this;
						Object.defineProperty(this.gridContainer, 'EnableDiffMode', {
							get: function () {
								return self.isRedlineActive;
							},
							set: function (doEnabled) {
								self.enableRedlineMode(doEnabled);
							}
						});

						this.isInitialized = true;
					}
				},

				isColumnComparable: function (columnName) {
					return this.compareColumnList.indexOf(columnName) > -1;
				},

				isRedlineId: function (rowId) {
					return rowId && rowId.indexOf(this.gridRowIdPrefix) === 0;
				},

				removeColumnFromCompareList: function (columnName) {
					var columnIndex = this.compareColumnList.indexOf(columnName);

					if (columnIndex != -1) {
						this.compareColumnList.splice(columnIndex, 1);
					}
				},

				_escapeHtml: function (htmlString) {
					return htmlString
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#039;');
				},

				_getStoreItems: function () {
					var fetchedItems;

					this.dataGrid.store.fetch({
						onComplete: function (items) {
							fetchedItems = items;
						}
					});
					return fetchedItems;
				},

				clearGridStore: function () {
					var store = this.dataGrid.store,
						storeItems = this._getStoreItems(),
						redlineStatus,
						item,
						i,
						rowsAffected = 0;

					this.dataGrid.beginUpdate();
					for (i = 0; i < storeItems.length; i++) {
						item = storeItems[i];
						redlineStatus = store.getValue(item, 'redlineStatus');

						if (redlineStatus) {
							switch (redlineStatus.rowStatus) {
								case 'deleted':
									store.deleteItem(item);
									break;
								default:
									store.setValue(item, 'redlineStatus', this.defaultRowStatus);
									break;
							}
							rowsAffected++;
						}
					}

					if (rowsAffected) {
						store.save();
					}
					this.dataGrid.endUpdate();
				},

				loadBaselineXML: function (xml) {
					this.baselineRows.length = 0;
					this.baselineTableRows = null;
					this.clearCompareList();

					if (xml) {
						var dom = new XmlDocument(),
							rowData,
							i;

						dom.loadXML(xml);
						this.baselineTableRows = dom.selectNodes('./table/tr');
						for (i = 0; i < this.baselineTableRows.length; i++) {
							rowData = this._prepareBaselineRow(this.baselineTableRows[i]);
							this.baselineRows.push(rowData);
						}
					}
				},

				refreshRedlineView: function () {
					this.clearGridStore();

					this.dataGrid.beginUpdate();
					if (this.baselineRows.length) {
						var store = this.dataGrid.store,
							storeItems = this._getStoreItems(),
							matchesArray = [],
							mismatchCount = parseInt(this.compareColumnList.length / 2 + 1),
							minMatchCount,
							bestMatchIndex,
							bestMatchValue,
							currentMatchIndexes = new Array(storeItems.length),
							baselineMatchIndexes = new Array(this.baselineRows.length),
							item,
							newRowId,
							i,
							j;

						mismatchCount = mismatchCount > 5 ? 5 : mismatchCount;
						minMatchCount = this.compareColumnList.length - mismatchCount;
						for (i = 0; i < this.baselineRows.length; i++) {
							matchesArray.push(
								this._compareBaselineRow(storeItems, this.baselineRows[i])
							);
						}

						for (i = 0; i < storeItems.length; i++) {
							bestMatchValue = 0;
							for (j = 0; j < this.baselineRows.length; j++) {
								if (matchesArray[j][i] > bestMatchValue) {
									bestMatchIndex = j;
									bestMatchValue = matchesArray[j][i];
								}
							}

							if (bestMatchValue > minMatchCount) {
								for (j = 0; j < storeItems.length; j++) {
									matchesArray[bestMatchIndex][j] = 0;
								}
								currentMatchIndexes[i] = bestMatchIndex;
								baselineMatchIndexes[bestMatchIndex] = i;
							}
						}

						for (i = 0; i < storeItems.length; i++) {
							item = storeItems[i];
							if (typeof currentMatchIndexes[i] === 'undefined') {
								store.setValue(item, 'redlineStatus', { rowStatus: 'new' });
							} else {
								store.setValue(item, 'redlineStatus', {
									rowStatus: 'edited',
									baselineIndex: currentMatchIndexes[i]
								});
							}
						}

						for (i = 0; i < this.baselineRows.length; i++) {
							if (typeof baselineMatchIndexes[i] === 'undefined') {
								var currentRow = this.baselineTableRows[i];
								var rowObj = {
									getUserData: function () {
										return currentRow.selectNodes('./userdata');
									},
									getFields: function () {
										return currentRow.selectNodes('./td');
									},
									getFieldText: function (fieldItem) {
										return fieldItem.text;
									},
									getFieldAttribute: function (fieldItem, attr) {
										return (
											fieldItem.getAttribute(attr) ||
											currentRow.getAttribute(attr)
										);
									}
								};

								newRowId = this._newRedlineRowId();
								if (
									this.gridContainer._addRowImplementation_Experimental(
										newRowId,
										rowObj
									)
								) {
									item = store._getItemByIdentity(newRowId);
									store.setValue(item, 'redlineStatus', {
										rowStatus: 'deleted'
									});
								}
							}
						}

						this.dataGrid.store.save();
					}
					this.dataGrid.endUpdate();
				},

				_newRedlineRowId: function () {
					return this.gridRowIdPrefix + this.gridRowIdIndex++;
				},

				_prepareBaselineRow: function (row) {
					var reCheck = /<checkbox.*>/,
						reCheckState = /.*(state|value)=["'](1|true)["'].*/,
						fields = row.selectNodes('./td'),
						newRow = { fields: {}, dataType: {} },
						layoutCell,
						i;

					for (
						i = this.dataGrid.layout.cells.length - fields.length;
						i > 0;
						i--
					) {
						fields.push('');
					}

					for (i = 0; i < fields.length; i++) {
						layoutCell = this.dataGrid.layout.cells[this.dataGrid.order[i]];

						if (layoutCell) {
							var fieldName = layoutCell.field,
								sort = layoutCell.sort,
								fieldText = fields[i].text,
								fieldValue = fieldText,
								fieldDataType =
									fields[i].getAttribute('fdt') ||
									row.getAttribute('fdt') ||
									'';

							if (reCheck.test(fieldText)) {
								fieldValue = reCheckState.test(fieldText);
							} else if ('NUMERIC' === sort) {
								fieldValue = fieldText ? parseFloat(fieldText) : '';
							} else if ('DATE' === sort) {
								fieldValue = fieldText;
							} else {
								fieldValue = fieldText;
								var link =
									fields[i].getAttribute('link') || row.getAttribute('link');
								if (link) {
									newRow[fieldName + 'link'] = link;
								}
							}

							newRow[fieldName] = fieldValue;
							newRow.fields[fieldName] = fieldName;
							newRow.dataType[fieldName] = fieldDataType;
						} else {
							return;
						}
					}

					return newRow;
				},

				_compareBaselineRow: function (storeItems, baseRow) {
					if (baseRow) {
						var store = this.dataGrid.store,
							item,
							compareMap = [],
							columnName,
							matchesCount,
							i,
							j;

						for (i = 0; i < storeItems.length; i++) {
							matchesCount = 0;
							item = storeItems[i];

							if (item) {
								for (j = 0; j < this.compareColumnList.length; j++) {
									columnName = this.compareColumnList[j];
									if (
										item.hasOwnProperty(columnName) &&
										store.getValue(item, columnName) === baseRow[columnName]
									) {
										matchesCount++;
									}
								}
								compareMap[i] = matchesCount;
							}
						}
						return compareMap;
					}
				}
			};
		},

		initClearData: function (grid) {
			//todo: remove this override after fix in dojo;
			var that = grid;
			grid._clearData = function () {
				that.height = 0;
				that._by_idty = {};
				that._by_idx = [];
				that._pages = [];
				that._bop = that._eop = -1;
				that._isLoaded = false;
				that._isLoading = false;
			};
		},

		_parseCSS: function (css) {
			function normalizeCSS(cssString) {
				if (!css) {
					return '';
				}
				css = css.trim();
				css = css.replace(/[ \t]*\{[ \t]*/g, '{');
				css = css.replace(/[ \t]*\}[ \t]*/g, '}');
				css = css.replace(/[ \t]*:[ \t]*/g, ':');
				css = css.replace(/[ \t]*;[ \t]*/g, ';');
				css = css.replace(/[ \t]*-[ \t]*/g, '-');
				return css;
			}
			css = normalizeCSS(css);
			var rulesArr = css.split(';');
			var result = {};
			for (var i = 0; i < rulesArr.length; i++) {
				var rule = rulesArr[i].split(':');
				if (rule && rule[0] !== '' && !result[rule[0]]) {
					result[rule[0]] = rule[1];
				}
			}
			return result;
		},

		GetColumnIndex: function (grid, columnName) {
			var i;
			for (i = 0; i < grid.grid_Experimental.nameColumns.length; i++) {
				if (columnName === grid.grid_Experimental.nameColumns[i]) {
					return i;
				}
			}
		},

		formatter: function (grid) {
			//  grid = Public GridContainer or Public TreeGridContainer
			var cellBorderWidth = 1,
				cellLeftRightPadding = 3,
				cellTopBottomPadding = 3,
				restrictedWarning =
					dojoConfig.arasContext.resources[
						'common.restricted_property_warning'
					] || 'Restricted';

			return {
				grid: grid,
				cellTopIndent: cellBorderWidth + cellTopBottomPadding,
				cellBottomIndent: cellBorderWidth + cellTopBottomPadding,

				img: function (value) {
					if (!value) {
						return '';
					}
					//var maxSizeHeight = this.grid.rowHeight - 6;
					//var maxSizeWidth = this.getHeaderNode().clientWidth - 10;
					var maxSize = this.grid.rowHeight - 7;
					var style =
						'style="max-height: ' +
						maxSize +
						'px; max-width: ' +
						maxSize +
						'px;"';
					return (
						'<img ' +
						style +
						' src="' +
						config.baseUrl +
						'../../cbin/' +
						value +
						'" />'
					);
				},

				getImgSrcAttribute: function (imgString) {
					var re = /\ssrc=(?:(?:'([^']*)')|(?:"([^"]*)")|([^\s]*))/i; // match src='a' OR src="a" OR src=a
					var res = imgString.match(re);
					var imgSrc = '';

					if (res) {
						imgSrc = res[1] || res[2] || res[3] || '';
					}
					if (/(http[s]*:\/\/)/i.test(imgSrc) === false) {
						imgSrc = config.baseUrl + '../../cbin/' + imgSrc;
					}

					imgSrc = imgSrc.split('"').join('');

					return imgSrc;
				},

				html: function (value, rowIndex) {
					var item, id, frameWidget;
					if (!value) {
						return value;
					}
					if (!/^<html>.*^<\/html>$/.test(value)) {
						value =
							"<html><body style='background-color: transparent;margin:0;'>" +
							value +
							'</body></html>';
					}
					item = this.grid.getItem(rowIndex);
					id = item.uniqueId[0];
					frameWidget = new safeIFrame({
						id: id,
						index: rowIndex,
						headerCell: this,
						htmlString: value.replace(/&amp;/g, '&').replace(/&lt;/g, '<'),
						grid: this.grid,
						width: this.unitWidth || this.width
					});
					frameWidget._destroyOnRemove = true;
					return frameWidget;
				},

				formatHandler: function (layoutCell, storeValue, index) {
					var item = this.grid.grid_Experimental.getItem(index),
						store = this.grid.grid_Experimental.store,
						attrs = store.getValue(item, 'attrs')
							? store.getValue(item, 'attrs')[layoutCell.field]
							: {},
						attrItem,
						valueArray,
						i,
						redlineModule = this.grid.redline_Experimental,
						redlineRowStatus = store.getValue(item, 'redlineStatus'),
						cellContent;
					var customStyle = '',
						styleItem,
						style = store.getValue(item, 'style')
							? store.getValue(item, 'style')[layoutCell.field]
							: {};

					var markup = layoutCell.markup[2],
						cellInfo =
							item === undefined
								? undefined
								: store.getValue(item, layoutCell.field + '$cellInfo'),
						listId = cellInfo && cellInfo.listId,
						list;

					//listId can be 0 and it's truly value, so don't use "if (listId)..."
					if (listId !== undefined && listId !== '') {
						list = layoutCell.cellLayoutLists[listId];
					}
					var editableType =
							(cellInfo && cellInfo.editableType) || layoutCell.editableType,
						optionsLables = list ? list.labels : layoutCell.optionsLables,
						options = list ? list.values : layoutCell.options;

					for (attrItem in attrs) {
						if (
							attrs.hasOwnProperty(attrItem) &&
							markup.indexOf(attrItem) < 0
						) {
							markup = '" ' + attrItem + '="' + attrs[attrItem] + markup;
						}
					}
					layoutCell.markup[2] = markup;

					var isFieldLink = store.getValue(item, layoutCell.field + 'link');
					for (styleItem in style) {
						if (style.hasOwnProperty(styleItem)) {
							customStyle += styleItem + ':' + style[styleItem] + ';';
						}
					}

					layoutCell.customStyles.push(customStyle);

					var cellViewTypeSettings;
					if (this.grid.cellViewTypeHelper_Experimental) {
						var cellViewType = store.getValue(
							item,
							layoutCell.field + '$cellViewType'
						);
						cellViewTypeSettings = this.grid.cellViewTypeHelper_Experimental.getCellViewTypeSettings(
							cellViewType
						);
					}
					var sort;
					var inputformat;
					if (cellViewTypeSettings) {
						sort = cellViewTypeSettings.sort;
						inputformat = cellViewTypeSettings.inputformat;
					} else {
						sort = layoutCell.sort;
						inputformat = layoutCell.inputformat;
					}

					var converter = dojoConfig.arasContext.converter;
					if (
						layoutCell.externalWidget &&
						layoutCell.externalWidget.functionalFlags.render
					) {
						cellContent = layoutCell.externalWidget.generateCellHTML(
							layoutCell,
							storeValue,
							index
						);
					} else if ('boolean' === typeof storeValue) {
						cellContent = "<div class='checkBoxContainer'>";
						cellContent +=
							"<input class='aras_grid_input_checkbox arasCheckboxOrRadio' type='checkbox' onclick='( function(e){ e.target.isCheckBox = true; e.preventDefault(); return false;} )(event)' ";
						cellContent += storeValue ? 'checked' : '';
						cellContent +=
							" /><div class='aras_grid_checkbox " +
							(storeValue ? 'checked' : 'unchecked') +
							"'></div>";
						cellContent += '</div>';
					} else if (/^&lt;img[\w\W]*>$/.test(storeValue)) {
						if (/src=['"]{2}/.test(storeValue)) {
							cellContent = '';
						} else {
							const maxSize =
								this.grid.rowHeight -
								(this.cellTopIndent + this.cellBottomIndent);
							const styleImg =
								'margin: 0px; max-height: ' +
								maxSize +
								'px; max-width: ' +
								maxSize +
								'px;';
							const titleRes = storeValue.match(
								/title=(?:(?:'([^']*)')|(?:"([^"]*)"))/
							);
							const titleAttr = titleRes
								? ' title="' + titleRes[1].split('"').join('') + '"'
								: '';
							cellContent =
								'<img style="' +
								styleImg +
								'" src="' +
								this.getImgSrcAttribute(storeValue) +
								'"' +
								titleAttr +
								' />';
						}
					} else if (isFieldLink) {
						cellContent =
							'<a href="#" class="gridLink" ' +
							(customStyle ? 'style="' + customStyle + '"' : '') +
							'>' +
							storeValue +
							'</a>';
					} else if (optionsLables && optionsLables.length) {
						if ('CheckedMultiSelect' === editableType) {
							if (storeValue && storeValue !== '') {
								if (storeValue === restrictedWarning) {
									cellContent = storeValue;
								} else {
									valueArray = storeValue.split(',');

									cellContent = optionsLables[options.indexOf(valueArray[0])];
									for (i = 1; i < valueArray.length; i++) {
										cellContent +=
											', ' + optionsLables[options.indexOf(valueArray[i])];
									}
								}
							} else {
								cellContent = '';
							}
						} else {
							cellContent =
								optionsLables[options.indexOf(storeValue)] || storeValue;
						}
					} else if ('NUMERIC' === sort) {
						if (inputformat) {
							cellContent = converter.convertFromNeutral(
								storeValue,
								'decimal',
								inputformat
							);
						} else {
							cellContent = converter.convertFromNeutral(storeValue, 'float');
						}
					} else if ('DATE' === sort && inputformat) {
						cellContent = converter.convertFromNeutral(
							storeValue,
							'date',
							inputformat
						);
					} else {
						cellContent = storeValue;
					}

					if (redlineRowStatus && redlineRowStatus.rowStatus == 'edited') {
						if (redlineModule.isColumnComparable(layoutCell.field)) {
							var baselineRow =
									redlineModule.baselineRows[redlineRowStatus.baselineIndex],
								baseValue = baselineRow[layoutCell.field],
								isBaseValueExists = baseValue || typeof baseValue == 'boolean';

							if (isBaseValueExists && baseValue != storeValue) {
								cellContent += redlineModule.formatBaseValue(
									layoutCell,
									baseValue,
									cellInfo
								);
							}
						}
					}

					return cellContent;
				}
			};
		},

		getUserData_Gm: function (store, rowId, keyOptional) {
			if (rowId === null || rowId === undefined) {
				throw new Error("The 'rowId' value cannot be null or undefined.");
			}
			var item = store._getItemByIdentity(rowId);
			if (!item) {
				return;
			}

			var key =
				keyOptional !== undefined && keyOptional !== null
					? keyOptional
					: 'key7aa8b83dArasAnyConst';
			return item.userData$Gm && item.userData$Gm[key];
		},

		setUserData_Gm: function (store, rowId, keyOrValue, value) {
			if (rowId === null || rowId === undefined) {
				throw new Error("The 'rowId' value cannot be null or undefined.");
			}
			var item = store._getItemByIdentity(rowId);
			if (!item) {
				return;
			}
			if (!item.userData$Gm) {
				item.userData$Gm = [];
			}

			if (value !== undefined) {
				item.userData$Gm[keyOrValue] = value;
			} else {
				var key = 'key7aa8b83dArasAnyConst';
				item.userData$Gm[key] = keyOrValue;
			}
		},

		moveRowUpDownForPublicGrid: function (grid, rowId, isUp) {
			var index = grid.getRowIndex(rowId),
				arrayOfAllItems = grid.grid_Experimental.store._arrayOfAllItems,
				arrayOfTopLevelItems =
					grid.grid_Experimental.store._arrayOfTopLevelItems,
				increment = isUp ? -1 : 1,
				rowAbove = arrayOfAllItems[index + increment],
				row = arrayOfAllItems[index];

			if (!row || !rowAbove) {
				return;
			}

			var itemNumPropName = grid.grid_Experimental.store._itemNumPropName,
				rowAboveNumProp = rowAbove[itemNumPropName];

			rowAbove[itemNumPropName] = row[itemNumPropName];
			row[itemNumPropName] = rowAboveNumProp;

			arrayOfTopLevelItems[index + increment] = arrayOfAllItems[
				index + increment
			] = row;
			arrayOfTopLevelItems[index] = arrayOfAllItems[index] = rowAbove;
			grid.grid_Experimental._refresh();
		},

		setFont_Gm: function (fontString, fieldStyle) {
			if (!fontString) {
				return;
			}

			delete fieldStyle.font;

			var fontParts = fontString.split('-');
			fieldStyle['font-family'] = fontParts[0];

			if (fontParts.length > 1) {
				var fontSize = fontParts[fontParts.length - 1];
				if (!isNaN(parseFloat(fontSize))) {
					fieldStyle['font-size'] = fontSize + 'pt';
				}

				var fontStyle = fontParts[1];
				if (fontStyle.indexOf('italic') >= 0) {
					fieldStyle['font-style'] = fieldStyle['font-style'];
				}

				if (fontStyle.indexOf('bold') >= 0) {
					fieldStyle['font-weight'] = 'bold';
				}
			}
		},

		getAlign_Gm: function (align) {
			var alignLetter = align && align[0].toLowerCase();
			if ('c' === alignLetter) {
				return 'text-align:center;';
			} else if ('r' === alignLetter) {
				return 'text-align:right;';
			} else {
				return 'text-align:left;';
			}
		}
	};
});
