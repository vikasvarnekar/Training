﻿define([
	'dojo/_base/declare',
	'dojo/_base/connect',
	'dojo/_base/lang',
	'dojo/dom',
	'dojo/dom-class',
	'dojox/grid/DataGrid',
	'dojox/grid/_RowManager',
	'dojo/aspect',
	'dojo/_base/event',
	'dijit/form/TextBox',
	'dijit/form/DropDownButton',
	'dijit/DropDownMenu',
	'dijit/MenuItem',
	'dijit/form/FilteringSelect',
	'./_grid/CheckedMultiSelect',
	'dojo/data/ItemFileReadStore',
	'dojo/store/Memory',
	'dijit/form/ComboBox',
	'dijit/form/DateTextBox',
	'dojox/grid/_FocusManager',
	'dojox/grid/_EditManager',
	'dojo/keys',
	'dojo/date',
	'dojo/date/locale',
	'dojo/date/stamp',
	'dojo/on'
], function (
	declare,
	connect,
	lang,
	domSelect,
	DomClass,
	DataGrid,
	_RowManager,
	aspect,
	event,
	TextBox,
	DropDownButton,
	DropDownMenu,
	MenuItem,
	FilteringSelect,
	CheckedMultiSelect,
	ItemFileReadStore,
	Memory,
	ComboBox,
	_DateTextBox,
	_FocusManager,
	_EditManager,
	keys,
	date,
	locale,
	stamp,
	on
) {
	var EditorManager = declare(_EditManager, {
		_applyRowStarted: false,
		_applyStarted: false,

		setEditCell: function (inCell, inRowIndex) {
			if (this.isEditing()) {
				this.apply();
			}
			this.inherited(arguments);
		},

		//remove CanEdit, oneditStart event calls repeatedly in handler CanEdit
		applyCellEdit: function (inValue, inCell, inRowIndex) {
			this.doApplyCellEdit.call(this.grid, inValue, inRowIndex, inCell.field);
		},

		doApplyCellEdit: function (inValue, inRowIndex, inAttrName) {
			this.store.fetchItemByIdentity({
				identity: this._by_idx[inRowIndex].idty,
				onItem: lang.hitch(this, function (item) {
					var oldValue = this.store.getValue(item, inAttrName);
					if (typeof oldValue == 'number') {
						inValue = isNaN(parseFloat(inValue))
							? inValue
							: parseFloat(inValue);
					} else if (typeof oldValue == 'boolean') {
						inValue =
							inValue == 'true' ? true : inValue == 'false' ? false : inValue;
					} else if (oldValue instanceof Date) {
						var asDate = new Date(inValue);
						inValue = isNaN(asDate.getTime()) ? inValue : asDate;
					}
					this.store.setValue(item, inAttrName, inValue);
					this.onApplyCellEdit(inValue, inRowIndex, inAttrName);
				})
			});
		},

		applyRowEdit: function () {
			if (undefined !== this.info.rowIndex && this.info.cell) {
				this.grid.doApplyEdit(this.info.rowIndex, this.info.cell.field);
			}
		},

		apply: function () {
			if (this.isEditing() && this._isValidInput() && !this._applyRowStarted) {
				this._applyRowStarted = true;
				this.grid.beginUpdate();
				this.editorApply();
				this.applyRowEdit();
				this.info = {};
				this._applyRowStarted = false;
				this.grid.endUpdate();
				// commented because grid always captures focus during apply event
				//this.grid.focus.focusGrid();
				this._doCatchBoomerang();
			}
			this._applyStarted = false;
		}
	});

	var FocusManager = declare(
		'Aras.Client.Controls.Experimental._FocusManager',
		_FocusManager,
		{
			//copy next Key from _FocusManager file, remove tabOut
			nextKey: function (e) {
				if (!this.grid.edit._isValidInput()) {
					event.stop(e);
					return;
				}
				var isEmpty = this.grid.rowCount === 0;
				if (e.target === this.grid.domNode && this._colHeadFocusIdx == null) {
					this.focusHeader();
					event.stop(e);
				} else if (this.isNavHeader()) {
					// if tabbing from col header, then go to grid proper.
					this.blurHeader();
					if (!this.findAndFocusGridCell()) {
						this.tabOut(this.grid.lastFocusNode);
					}
					this._colHeadNode = this._colHeadFocusIdx = null;
				} else {
					event.stop(e);
					this.next();
				}
			},
			previousKey: function (e) {
				event.stop(e);
				if (!this.grid.edit._isValidInput()) {
					return;
				}
				this.previous();
			},
			next: function () {
				if (this.grid.edit.isEditing()) {
					this.grid.edit.apply();
				}
				//Copy from origin next without if(this.grid.edit.isEditing())
				if (this.cell) {
					var row = this.rowIndex,
						col = this.cell.index + 1,
						cc = this.grid.layout.cellCount - 1,
						rc = this.grid.rowCount - 1;
					if (col > cc) {
						col = 0;
						row++;
						if (row <= rc) {
							this.grid.selection.clear();
							this.grid.selection.setSelected(row, true);
						}
					}
					if (row > rc) {
						col = cc;
						row = rc;
					}

					var nextCell = this.grid.getCell(col);
					if (this.isLastFocusCell()) {
						return;
					}

					//remove check editable cell
					this.setFocusIndex(row, col);
					this.grid.edit.setEditCell(nextCell, row);
				}
			},
			previous: function () {
				if (this.grid.edit.isEditing()) {
					this.grid.edit.apply();
				}
				//Copy from origin next without if(this.grid.edit.isEditing())
				if (this.cell) {
					var row = this.rowIndex || 0,
						col = (this.cell.index || 0) - 1;
					if (col < 0) {
						col = this.grid.layout.cellCount - 1;
						row--;
						if (row >= 0) {
							this.grid.selection.clear();
							this.grid.selection.setSelected(row, true);
						}
					}
					if (row < 0) {
						row = 0;
						col = 0;
					}

					var nextCell = this.grid.getCell(col);
					if (this.isFirstFocusCell()) {
						return;
					}
					//remove check editable cell
					this.setFocusIndex(row, col);
					this.grid.edit.setEditCell(nextCell, row);
				}
			},
			doContextMenu: function (e) {
				//Override this method in order to show standard menu if there is nothing to show
				//Copy from origin doContextMenu but 'e.cell' set instead of '!this.headerMenu'
				//Do not prevent default behaviour if click was not on cell
				if (e.cell) {
					event.stop(e);
				}

				// I-003448 Context menu on the relationship grid does not disappear
				const scrollboxNode = this.focusView && this.focusView.scrollboxNode;
				// This is a dojo and IE problem.
				// When the grid is converted to CUI, this fix can be removed
				// The attribute unselectable is set for IE, so the blur event when you click for this area not working
				if (scrollboxNode && scrollboxNode.getAttribute('unselectable')) {
					scrollboxNode.removeAttribute('unselectable');
				}
			}
		}
	);

	var ArasDateTextBox = declare(_DateTextBox, {
		datePackage: lang.mixin(date, { locale: locale, stamp: stamp }),
		format: function (value, pos) {
			var res = '';
			if (value) {
				this.constraints = { selector: 'date', datePattern: this.inputformat };
				res = this.datePackage.locale.format(value, {
					selector: 'date',
					datePattern: this.inputformat
				});
			}
			return res;
		},
		onFocus: function () {
			this.constraints = { selector: 'date' };
			this.inherited(arguments);
		},
		validator: function (value, constraints) {
			var con = constraints.datePattern
				? { selector: 'date' }
				: { selector: 'date', datePattern: this.inputformat };
			var res = true;
			if (!this.inherited(arguments)) {
				this.constraints = con;
				constraints = con;
				res = this.inherited(arguments);
			}
			return res;
		},
		_setValueAttr: function (value) {
			if (!value) {
				value = null;
			}
			this.inherited(arguments);
		}
	});

	return declare('Aras.Client.Controls.Experimental.DataGrid', DataGrid, {
		inputRowNode: null,
		inputRowCollections: null,
		nameColumns: null,
		openHTMLCell: null,
		order: null,
		styleGrid: null,
		//fix of bug related on the transition to edit mode for inputRow
		selectable: true,

		constructor: function (args) {
			this.nameColumns = [];
			this.order = [];
			this.inputRowCollections = {};
			this.noBodyCollections = {};
			this.styleGrid = {};
			this.openHTMLCell = [];

			aspect.after(this, 'createScroller', function () {
				this.scroller.defaultRowHeight = this.rowHeight;
				this.scroller.needPage = this._needPageModified;
			});
		},

		createManagers: function () {
			// row manager
			this.rows = new _RowManager(this);
			// focus manager
			this.focus = new FocusManager(this);
			// edit manager
			this.edit = new EditorManager(this);
		},

		endUpdate: function () {
			this.updating = false;
			var i = this.invalidated;
			if (i.all && i.rowCount != undefined) {
				this.updateRowCount(i.rowCount);
			}
			this.inherited(arguments);
		},

		_needPageModified: function (inPageIndex, inPos) {
			// internal method, used only in grid scroller object
			var h = this.getPageHeight(inPageIndex),
				oh = h;
			if (!this.pageExists(inPageIndex)) {
				this.buildPage(
					inPageIndex,
					!this.grid._autoHeight &&
						this.keepPages &&
						this.stack.length >= this.keepPages,
					inPos
				);
				h = this.updatePageHeight(inPageIndex, true);
			} else {
				this.positionPage(inPageIndex, inPos);

				// this is new code, most likely can be removed after transition on the new grid version
				var stackIndex = this.stack.indexOf(inPageIndex);
				this.stack.splice(stackIndex, 1);
				this.pushPage(inPageIndex);
			}
			return h;
		},

		renderInputRow: function () {
			var cells = this.grid.layout.cells,
				table = this.headerContentNode.lastChild.lastChild,
				row,
				rowCell,
				widget,
				i;

			connect.connect(this.headerNode, 'onscroll', this, function () {
				if (this.scrollboxNode && this.headerNode) {
					this.scrollboxNode.scrollLeft = this.headerNode.scrollLeft;
				}
			});

			// row dom creation
			row = document.createElement('TR');
			row.setAttribute('class', 'SearchBar');
			row.setAttribute(
				'style',
				this.grid.visibleSearchBar ? '' : 'display: none;'
			);

			connect.connect(row, 'onkeydown', this.grid, function (e) {
				e.inputRow = true;
			});
			on(
				row,
				'mousedown',
				function (evt) {
					this.grid.edit.apply();
					domSelect.setSelectable(row, true);
				}.bind(this)
			);

			table.appendChild(row);
			this.grid.inputRowNode = row;
			for (i = 0; i < cells.length; i++) {
				widget = this.grid.createWidgetInputRow(cells[i].field, i);
				rowCell = document.createElement('TD');
				if (this.grid.inputRowBgColor) {
					rowCell.style.backgroundColor =
						this.grid.inputRowBgColor + ' !important';
				}
				if (cells[i].hidden) {
					rowCell.style.display = 'none';
				}

				if (cells[i].editableType === 'InputHelper') {
					DomClass.add(rowCell, 'InputHelper');
				}

				rowCell.appendChild(widget.domNode);
				row.appendChild(rowCell);
			}
		},

		htmlButtonOnClick: function () {
			var parent = this.getParent();
			var value;
			if (parent.cell.optionsLables) {
				var indexLabel = parent.cell.optionsLables.indexOf(this.get('label'));
				value = parent.cell.options[indexLabel];
			} else {
				value = this.get('label');
			}
			parent.widget.set('label', value);
			parent.widget.domNode.classList.toggle('hideArrowButton', value);
		},

		createWidgetInputRow: function (field, index) {
			var cells = this.layout.cells;
			var widget, labels, j, data;

			if (!this.inputRowCollections[field]) {
				var cell = cells[index];
				var editableTypeOfCell = cell.editableType;
				if ('dropDownButton' === editableTypeOfCell) {
					labels = cell.optionsLables || cell.options;
					var menu = new DropDownMenu({ style: 'display: none;' });
					for (j = 0; j < cell.options.length; j++) {
						menu.addChild(
							new MenuItem({
								label: labels[j],
								onClick: this.htmlButtonOnClick
							})
						);
					}
					widget = new DropDownButton({
						class: 'dropDownInputRow',
						dropDown: menu,
						style: 'width:100%; height:100%; margin: 0;',
						onKeyDown: this._keyPressInputRow()
					});
					menu.widget = widget;
					menu.cell = cell;
					widget.watch('label', this._callEventSearchRow('onChangeInputRow'));
				} else if ('FilterComboBox' === editableTypeOfCell && cell.options) {
					data = [];
					for (var i = 0; i < cell.options.length; i++) {
						data.push({
							name: cell.optionsLables[i],
							id: cell.options[i]
						});
					}
					widget = new FilteringSelect({
						store: new Memory({ data: data }),
						onFocus: this._callEventSearchRow('onFocusInputRow'),
						onChange: this._callEventSearchRow('onChangeInputRow'),
						required: false,
						onKeyDown: this._keyPressInputRow()
					});
				} else if ('dateTime' === editableTypeOfCell) {
					var format = cell.editformat || cell.inputformat;
					widget = new ArasDateTextBox({
						inputformat: format,
						onKeyDown: this._keyPressInputHelper(),
						onChange: this._callEventSearchRow('onChangeInputRow'),
						// for now default dropDownWinget turned off
						openDropDown: function () {}
					});
					var self = this;
					connect.connect(widget._buttonNode, 'onclick', function () {
						self.onInputHelperShow(
							'input_row',
							grid.GetColumnIndex(widget.field)
						);
					});
				} else if (
					'CheckedMultiSelect' === editableTypeOfCell &&
					cell.options
				) {
					labels = cell.optionsLables || cell.options;
					var items = [];
					for (j = 0; j < cell.options.length; j++) {
						items.push({
							label: labels[j] || '&nbsp;',
							value: cell.options[j]
						});
					}
					data = { identifier: 'value', label: 'label', items: items };
					widget = new CheckedMultiSelect({
						store: new ItemFileReadStore({ data: lang.clone(data) }),
						onKeyDown: this._keyPressInputRow(),
						onChange: this._callEventSearchRow('onChangeInputRow')
					});
					widget.startup();
				} else if ('InputHelper' === editableTypeOfCell) {
					widget = new ComboBox({
						store: new ItemFileReadStore({
							data: { identifier: 'name', items: [] }
						}),
						validate: this._validateInputHelper(),
						onClick: this._comboBoxClick(),
						onKeyDown: this._keyPressInputHelper(),
						onChange: this._callEventSearchRow('onChangeInputRow')
					});
				} else {
					widget = new TextBox({
						onKeyDown: this._keyPressInputHelper(),
						onFocus: this._callEventSearchRow('onFocusInputRow'),
						onChange: this._callEventSearchRow('onChangeInputRow')
					});
				}
				widget.index = index;
				widget.field = field;
				this.inputRowCollections[field] = widget;
			} else {
				widget = this.inputRowCollections[field];
			}
			return widget;
		},

		_comboBoxClick: function () {
			var self = this;
			return function (e) {
				var targetClass = e.target.className.toLowerCase();
				if (targetClass.indexOf('dijitArrowButtonInner'.toLowerCase()) > -1) {
					self.onInputHelperShow('input_row', grid.GetColumnIndex(this.field));
				}
			};
		},

		_keyPressInputRow: function () {
			var self = this;
			return function (e) {
				if (keys.ENTER === e.keyCode) {
					this.onChange();
					self.onStartSearch();
				}
			};
		},

		_keyPressInputHelper: function () {
			var self = this;
			return function (e) {
				switch (e.keyCode) {
					case keys.F2:
					case keys.DOWN_ARROW:
						self.onInputHelperShow(
							'input_row',
							grid.GetColumnIndex(this.field)
						);
						break;
					case keys.ENTER:
						this.onChange();
						grid.turnEditOff();
						self.onStartSearch();
						break;
				}
			};
		},

		_callEventSearchRow: function (func) {
			var self = this;
			return function () {
				if (func && typeof self[func] == 'function') {
					self[func]('input_row', this.field);
				}
			};
		},

		_validateInputHelper: function () {
			var self = this;
			return function () {
				return self.validateCell('input_row', self.order[this.index]);
			};
		},

		buildViews: function () {
			this.inherited(arguments);
			var myView = this.views.views[0];
			//After the View creation that will have handlers for oncontextmenu event from myView.contentNode and myView.headerNode
			//However that leaves an area where the event is not handled and thus may bubble up.
			//That is the area left in myView.scrollboxNode below myView.contentNode.
			connect.connect(myView.scrollboxNode, 'oncontextmenu', this, function (
				e
			) {
				if (e.target === myView.scrollboxNode) {
					event.stop(e);
				}
			});
			aspect.before(myView, 'renderHeader', this.viewsRender);
			aspect.after(myView, 'renderHeader', this.renderInputRow);
		},

		_onDelete: function (item) {
			var id = this.store.getIdentity(item);
			delete this.styleGrid[id];
			this.inherited(arguments);
		},

		viewsRender: function () {
			var widget;
			for (var field in this.grid.inputRowCollections) {
				widget = this.grid.inputRowCollections[field];
				if (widget.domNode.parentNode != null) {
					widget.domNode.parentNode.removeChild(widget.domNode);
				}
			}
		},

		_setStructureAttr: function (structure) {
			for (var item in this.inputRowCollections) {
				this.inputRowCollections[item].destroyRecursive(false);
			}
			this.inputRowCollections = {};
			this.inherited(arguments);
		},

		_canDoOperationsOnCell: function (newCell, newRowIndex) {
			const editingCellChanged =
				this.edit.info.cell &&
				(!newCell ||
					this.edit.info.rowIndex !== newRowIndex ||
					this.edit.info.cell.field !== newCell.field);
			return !editingCellChanged || this.edit._isValidInput();
		},

		canSort: function (col) {
			return this.getCell(Math.abs(col) - 1).sort !== 'NOSORT';
		},

		onFocusInputRow: function (rowId, column) {
			//Event fired when focus on inputRow;
		},

		onChangeInputRow: function (rowId, column) {
			//Event fired when changed on inputRow;
		},

		onInputHelperShow: function (rowId, column) {
			//Event fired when click arrow inputHelper in edit mode cell;
		},

		onStartSearch: function () {
			//Event fired when call Enter in Simple Search;
		},

		validateCell: function (rowId, column, value) {
			//Event fired when start and finish edit cell;
			return true;
		},

		gridLinkClick: function (e) {
			//event when click on link
		},

		onSort_Dg: function (columnIndex, asc, savedOrder) {},

		doclick: function (e) {
			// Validate current cell
			let cellValid = true;
			if (!this._canDoOperationsOnCell(e.cell, e.rowIndex)) {
				cellValid = false;
				event.stop(e);
			}
			// Links should still be clickable even if current cell is not valid
			const cellWidgetHasInteractiveFlag =
				e.cell &&
				e.cell.externalWidget &&
				e.cell.externalWidget.functionalFlags.interactive;
			const cellContainsLink =
				(cellWidgetHasInteractiveFlag && 'textLink' === e.target.className) ||
				('A' === e.target.nodeName && 'gridLink' === e.target.className);
			if (cellContainsLink) {
				if ('textLink' === e.target.className) {
					e.cell.externalWidget.onClick(e);
				} else if ('gridLink' === e.target.className) {
					this.gridLinkClick(e);
				}
				event.stop(e);
			}
			// Switch to another cell if current cell is valid
			if (cellValid) {
				this.inherited(arguments);
				if (!cellContainsLink && cellWidgetHasInteractiveFlag) {
					e.cell.externalWidget.onClick(e);
					event.stop(e);
				}
			}
		},

		onCellClick: function (e) {
			var item = this.getItem(e.rowIndex),
				isCheckBox = e.target.isCheckBox,
				value = this.store.getValue(item, e.cell.field);

			if (
				!connect.isCopyKey(e) &&
				!e.shiftKey &&
				this.selection.isSelected(e.rowIndex) &&
				!this.edit.isEditing() &&
				!isCheckBox
			) {
				if ('boolean' !== typeof value) {
					this.focus.setFocusCell(e.cell, e.rowIndex);
					this.edit.setEditCell(e.cell, e.rowIndex);
				}
			} else if (!connect.isCopyKey(e) && !e.shiftKey && isCheckBox) {
				if (this.edit.isEditing()) {
					this.edit.apply();
				}
				this.focus.setFocusCell(e.cell, e.rowIndex);
				if (
					e.cell.editable &&
					this.canEdit &&
					this.canEdit(e.cell, e.rowIndex)
				) {
					this.store.setValue(item, e.cell.field, !value);
					this.onApplyCellEdit(!value, e.rowIndex, e.cell.field);
				}
			}

			this.inherited(arguments);
		},

		onCellDblClick: function (e) {
			//This is copy from dbClick without edit and focus on cell
			if (!this._canDoOperationsOnCell(e.cell, e.rowIndex)) {
				return;
			}
			var event;
			if (this._click.length > 1 && has('ie')) {
				event = this._click[1];
			} else if (
				this._click.length > 1 &&
				this._click[0].rowIndex != this._click[1].rowIndex
			) {
				event = this._click[0];
			} else {
				event = e;
			}
			this.onRowClick(event);
			this.onRowDblClick(e);
		},

		dokeydown: function (e) {
			//Workaround for Dojo bug #17569.
			//Remove it after transition to the version of Dojo where it will be fixed.
			var enterPressed = keys.ENTER === e.keyCode,
				noHeaderHasFocus = -1 === this.focus.getHeaderIndex(),
				cellHasFocus = this.focus.cell && -1 !== this.focus.rowIndex;

			if (
				enterPressed &&
				noHeaderHasFocus &&
				!e.shiftKey &&
				!this.edit.isEditing() &&
				!cellHasFocus
			) {
				return;
			}
			if (!e.inputRow) {
				this.inherited(arguments);

				if (cellHasFocus) {
					var focusCell = this.focus.cell;

					if (
						focusCell.externalWidget &&
						focusCell.externalWidget.functionalFlags.interactive
					) {
						focusCell.externalWidget.onKeyDown(
							focusCell,
							this.focus.rowIndex,
							e
						);
					}
				}
			}
		},

		onRowContextMenu: function (e) {
			if (
				e.cell &&
				this._canDoOperationsOnCell(e.cell, e.rowIndex) &&
				!this.selection.isSelected(e.rowIndex)
			) {
				this.onRowClick(e);
			}
		},

		onKeyDown: function (e) {
			// summary:
			//		Grid key event handler. By default enter begins editing and applies edits, escape cancels an edit,
			//		tab, shift-tab, and arrow keys move grid cell focus.
			//		Aras: this code copied from _Events.js and then modified
			if (e.altKey || e.metaKey) {
				return;
			}
			var colIdx, selectedRowIndex;
			switch (e.keyCode) {
				case keys.ESCAPE:
					this.edit.cancel();
					break;
				case keys.ENTER:
					if (!this.edit.isEditing()) {
						colIdx = this.focus.getHeaderIndex();
						if (colIdx >= 0) {
							this.setSortIndex(colIdx);
							break;
						} else {
							this.selection.clickSelect(
								this.focus.rowIndex,
								dojo.isCopyKey(e),
								e.shiftKey
							);
						}
						event.stop(e);
					}
					if (!e.shiftKey) {
						var isEditing = this.edit.isEditing();
						this.edit.apply();
						if (!isEditing) {
							this.edit.setEditCell(this.focus.cell, this.focus.rowIndex);
						}
					}
					if (!this.edit.isEditing()) {
						var curView = this.focus.focusView || this.views.views[0]; //if no focusView than only one view
						curView.content.decorateEvent(e);
						this.onRowClick(e);
						event.stop(e);
					}
					break;
				case keys.SPACE:
					if (!this.edit.isEditing()) {
						colIdx = this.focus.getHeaderIndex();
						if (colIdx >= 0) {
							this.setSortIndex(colIdx);
							break;
						} else {
							this.selection.clickSelect(
								this.focus.rowIndex,
								dojo.isCopyKey(e),
								e.shiftKey
							);
						}
						event.stop(e);
					}
					break;
				case keys.TAB:
					this.focus[e.shiftKey ? 'previousKey' : 'nextKey'](e);
					break;
				case keys.LEFT_ARROW:
				case keys.RIGHT_ARROW:
					if (!this.edit.isEditing()) {
						var keyCode = e.keyCode; // IE seems to lose after stopEvent when modifier keys
						event.stop(e);
						colIdx = this.focus.getHeaderIndex();
						if (colIdx >= 0 && e.shiftKey && e.ctrlKey) {
							this.focus.colSizeAdjust(
								e,
								colIdx,
								(keyCode == keys.LEFT_ARROW ? -1 : 1) * 5
							);
						} else {
							var offset = keyCode == keys.LEFT_ARROW ? 1 : -1;
							if (this.isLeftToRight()) {
								offset *= -1;
							}
							this.focus.move(0, offset);
						}
					}
					break;
				case keys.UP_ARROW:
					if (!this.edit.isEditing() && this.focus.rowIndex !== 0) {
						event.stop(e);
						this.focus.move(-1, 0);
					}
					break;
				case keys.DOWN_ARROW:
					if (
						!this.edit.isEditing() &&
						this.focus.rowIndex + 1 != this.rowCount
					) {
						event.stop(e);
						this.focus.move(1, 0);
					}
					break;
				case keys.PAGE_UP:
					if (!this.edit.isEditing() && this.selection.selectedIndex > 0) {
						selectedRowIndex =
							this.selection.selectedIndex -
							(this.scroller.lastVisibleRow - this.scroller.firstVisibleRow);
						newScrollTop = this.scrollTop - this.scroller.windowHeight;

						newScrollTop = newScrollTop < 0 ? 0 : newScrollTop;
						selectedRowIndex = selectedRowIndex < 0 ? 0 : selectedRowIndex;

						event.stop(e);

						this.setScrollTop(newScrollTop);
						this.selection.select(selectedRowIndex);
						if (this.focus.cell) {
							this.focus.setFocusIndex(selectedRowIndex, this.focus.cell.index);
						}
					}
					break;
				case keys.PAGE_DOWN:
					if (
						!this.edit.isEditing() &&
						this.selection.selectedIndex !== -1 &&
						this.selection.selectedIndex + 1 != this.rowCount
					) {
						selectedRowIndex =
							this.selection.selectedIndex +
							(this.scroller.lastVisibleRow - this.scroller.firstVisibleRow);
						selectedRowIndex =
							selectedRowIndex < this.rowCount
								? selectedRowIndex
								: this.rowCount - 1;

						event.stop(e);

						this.setScrollTop(this.scrollTop + this.scroller.windowHeight);
						this.selection.select(selectedRowIndex);
						if (this.focus.cell) {
							this.focus.setFocusIndex(selectedRowIndex, this.focus.cell.index);
						}
					}
					break;
				default:
					break;
			}
		}
	});
});
