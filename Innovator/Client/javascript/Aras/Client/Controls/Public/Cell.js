﻿define([
	'dojo/_base/declare',
	'dojo/date/locale',
	'dojo/date/stamp',
	'Aras/Client/Controls/Experimental/GridModules'
], function (declare, DateLocal, DateIso, GridModules) {
	var privateProps = {},
		privatePropsInstanceCounter = 0,
		maxIntConstant = Math.pow(2, 53);

	return declare('Aras.Client.Controls.Public.Cell', null, {
		//don't add property here without "_Experimental" - it will be shown as field in documentation, properties are defined in constructor using defineProperties
		isInputRow_Experimental: false,
		grid_Experimental: null,
		sortNumber_Experimental: false,
		cell_Experimental_Experimental: null,
		sortDate_Experimental: false,
		indexColumn_Experimental: null,

		constructor: function (
			grid,
			cellNodFunc,
			cell,
			indexColumn,
			publicGridOrTreeGridContainer,
			skipMethodNamingConventionForPerformance
		) {
			/// <summary>
			/// Is returned, e.g., by method "cells" of "GridContainer"
			/// </summary>
			//this variable is used to build documentation in ExtractJSApiDocs.wsf file
			if (typeof arasDocumentationHelper !== 'undefined') {
				arasDocumentationHelper.registerProperties({});
				arasDocumentationHelper.registerEvents('');
				return;
			}
			if (privatePropsInstanceCounter === maxIntConstant) {
				privatePropsInstanceCounter = 0;
			}
			privatePropsInstanceCounter++;
			this.propsId_Experimental = privatePropsInstanceCounter;

			privateProps[this.propsId_Experimental] = {
				_dataType: '',
				_publicGridOrTreeGridContainer: null //don't use "," after the last property all over the file, e.g, here because documentation will not be built
			};

			privateProps[
				this.propsId_Experimental
			]._publicGridOrTreeGridContainer = publicGridOrTreeGridContainer;
			this.grid_Experimental = grid;
			this.cell_Experimental = cell;
			this.indexColumn_Experimental = indexColumn;
			if (cell && cell.dataType) {
				privateProps[this.propsId_Experimental]._dataType =
					cell.dataType[0][
						this.grid_Experimental.layout.cells[indexColumn].field
					];
			}

			var cellNodCurrent;
			Object.defineProperties(this, {
				cellNod_Experimental: {
					get: function () {
						if (!cellNodCurrent) {
							cellNodCurrent = cellNodFunc();
						}
						return cellNodCurrent;
					}
				}
			});

			//For ExcelGridContainer method getListsById_Experimental is not exist
			if (publicGridOrTreeGridContainer.getListsById_Experimental) {
				var cellLayout = this.grid_Experimental.layout.cells[
					this.indexColumn_Experimental
				];
				cellLayout.cellLayoutLists = publicGridOrTreeGridContainer.getListsById_Experimental();
			}

			if (!skipMethodNamingConventionForPerformance) {
				for (var method in this) {
					if (typeof this[method] === 'function') {
						var methodName =
							method.substr(0, 1).toUpperCase() + method.substr(1);
						this[methodName] = this[method];
					}
				}
			}
		},

		// public methods

		getBgColor: function () {
			//TODO: "issue format" - e.g. .net work with FFFF00, but .js work only with #FFFF00; .NET have other logic with format.
			/// <summary>
			/// Gets the background color of this Cell.
			/// </summary>
			/// <returns>string</returns>
			var style =
				this.grid_Experimental.store.getValue(
					this.cell_Experimental,
					'style'
				) || {};
			var fieldStyle =
				style[
					this.grid_Experimental.layout.cells[this.indexColumn_Experimental]
						.field
				];
			return fieldStyle ? fieldStyle['background-color'] : undefined;
		},

		setBgColor: function (value) {
			//TODO: see "issue format"
			//note: set font works without update
			/// <summary>
			/// Sets cell background color.
			/// </summary>
			/// <param name="value" type="string"></param>
			this.setBgColor_Experimental(value);
			this.grid_Experimental.update();
		},

		getBounds: function () {
			//TODO: shows zero's when cell was gotten in OnXmlLoaded Event in .js, but not in .net (perhaps this isn't used)
			//TODO:	shows the right results only for the first row and column (first cell), but wrong for others in .js. But works right in .net
			//TODO: by default the grids have different sizes, perhaps need to play with css's
			var n = this.cellNod_Experimental;
			return {
				width: n.clientWidth,
				height: n.clientHeight,
				x: n.scrollWidth,
				y: n.scrollHeight
			};
		},

		getColumnIndex: function () {
			//TODO: see "issue order"
			/// <summary>
			/// Gets index of column which contains current cell.
			/// </summary>
			/// <returns>int</returns>
			return this.indexColumn_Experimental;
		},

		getValue: function () {
			/// <summary>
			/// Returns the value of the cell.
			/// </summary>
			/// <returns></returns>
			if (this.isInputRow_Experimental) {
				var cellNod = this.cellNod_Experimental;
				if (
					'DATE' ==
						this.grid_Experimental.layout.cells[this.indexColumn_Experimental]
							.sort &&
					cellNod.value
				) {
					var date = DateLocal.parse(cellNod.value, {
						datePattern: this.grid_Experimental.layout.cells[
							this.indexColumn_Experimental
						].inputformat,
						selector: 'date'
					});
					return DateIso.toISOString(date);
				}
				return 'IMG' == cellNod.nodeName
					? "<img src='" + cellNod.getAttribute('src') + "'>"
					: cellNod.value;
			}

			if (
				this.grid_Experimental.edit.isEditing() &&
				this.grid_Experimental.getItemIndex(this.cell_Experimental) ===
					this.grid_Experimental.edit.info.rowIndex &&
				this.indexColumn_Experimental ===
					this.grid_Experimental.edit.info.cell.index
			) {
				return this.grid_Experimental.edit.info.cell.getValue();
			}
			var columnId = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			].field;
			return this.cell_Experimental[columnId][0];
		},

		setFont: function (font) {
			//TODO: if we set font bigger, e.g., 24,
			//TODO: .NET -  the cell doesn't show the value. But if you are editing the cell you will see changed (big) font in .NET.
			//TODO: .js - cell becomes bigger and you see changed font. But if you are editing the cell you will see default font.
			/// <summary>
			/// Sets font for current cell.
			/// </summary>
			/// <param name="font" type="string">
			/// Value is in the following formats:
			/// Name-style-size, style:{bold,italic,bolditalic}
			/// [examples: Courier-bold-12]
			/// </param>
			var style = this.grid_Experimental.store.getValue(
				this.cell_Experimental,
				'style'
			);
			var fieldStyle =
				style[
					this.grid_Experimental.layout.cells[this.indexColumn_Experimental]
						.field
				];
			GridModules.setFont_Gm(font, fieldStyle);
		},

		getFont: function () {
			//TODO: .js - get only font-family. .NET - get "fontName-fontStyle-fontSize"
			/// <summary>
			/// Gets current cell font.
			/// </summary>
			/// <returns>Returns string like "fontName-fontStyle-fontSize</returns>
			var style =
				this.grid_Experimental.store.getValue(
					this.cell_Experimental,
					'style'
				) || {};
			var fieldStyle =
				style[
					this.grid_Experimental.layout.cells[this.indexColumn_Experimental]
						.field
				];
			return fieldStyle ? fieldStyle['font-family'] : undefined;
		},

		getHorAlign: function () {
			var layoutCell = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			];
			if (!layoutCell) {
				return;
			}

			var match = /text-align:(.*?);/.exec(layoutCell.styles);
			if (match.length > 1) {
				return match[1];
			} else {
				return 'left';
			}
		},

		getRowId: function () {
			/// <summary>
			/// Gets Row ID for current cell.
			/// </summary>
			/// <returns>string</returns>
			return this.grid_Experimental.store.getValue(
				this.cell_Experimental,
				'uniqueId'
			);
		},

		getRowSpan: function () {
			//TODO
		},

		getTextColor: function () {
			//TODO: see "issue format"
			//When the value was not set it returns undefined in .js. .NET return string for black, but perhaps we can't change default color, it can be useless (I assume the same for other getter where issue format)
			/// <summary>
			/// Gets text color for current cell.
			/// </summary>
			/// <returns>string</returns>
			var style =
				this.grid_Experimental.store.getValue(
					this.cell_Experimental,
					'style'
				) || {};
			var fieldStyle =
				style[
					this.grid_Experimental.layout.cells[this.indexColumn_Experimental]
						.field
				];
			return fieldStyle ? fieldStyle.color : undefined;
		},

		getCellStyle: function () {
			/// <summary>
			/// Get cell css styles for current cell.
			/// </summary>
			/// <returns>object</returns>
			var style =
				this.grid_Experimental.store.getValue(
					this.cell_Experimental,
					'style'
				) || {};
			return style[
				this.grid_Experimental.layout.cells[this.indexColumn_Experimental].field
			];
		},

		setTextColor: function (color) {
			//TODO: see "issue format"
			/// <summary>
			/// This method sets the text color in cell to the specified color.
			/// </summary>
			/// <param name="color" type="string"></param>
			var style = this.grid_Experimental.store.getValue(
				this.cell_Experimental,
				'style'
			);
			style[
				this.grid_Experimental.layout.cells[this.indexColumn_Experimental].field
			].color = color;
			this.grid_Experimental.store.setValue(
				this.cell_Experimental,
				'style',
				style
			);
		},

		getText: function () {
			//TODO: this method has different realization in .Net from getValue(), but the same here
			/// <summary>
			/// Returns cell's visible text.
			/// </summary>
			/// <returns>string</returns>
			var layoutCell = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			];
			if (!layoutCell) {
				return;
			}

			var fieldValue = this.getValue();
			var fieldText = '';

			if ('DATE' === layoutCell.sort) {
				if (layoutCell.inputformat) {
					fieldText = aras.convertFromNeutral(
						fieldValue,
						'date',
						layoutCell.inputformat
					);
				} else {
					fieldText = this.cellNod_Experimental.innerHTML;
				}
			} else if ('NUMERIC' === layoutCell.sort) {
				if (layoutCell.inputformat) {
					fieldText = aras.convertFromNeutral(
						fieldValue,
						'decimal',
						layoutCell.inputformat
					);
				} else {
					fieldText = aras.convertFromNeutral(fieldValue, 'float');
				}
			} else if (
				(layoutCell.optionsLables &&
					layoutCell.optionsLables.length &&
					layoutCell.editableType === 'FilterComboBox') ||
				layoutCell.editableType === 'CheckedMultiSelect'
			) {
				var fieldValueIndex;
				var subValues = fieldValue.split(',');
				for (var i = 0; i < subValues.length; ++i) {
					fieldValueIndex = layoutCell.options.indexOf(subValues[i]);
					fieldText += fieldValueIndex > -1 && i > 0 ? ', ' : '';
					fieldText +=
						fieldValueIndex > -1
							? layoutCell.optionsLables[fieldValueIndex]
							: '';
				}
			} else {
				fieldText = fieldValue;
			}
			return fieldText;
		},

		isChecked: function () {
			/// <summary>
			/// Returns the state of this cell's checkbox.
			/// </summary>
			/// <returns>bool</returns>
			return this.isCheckbox() && this.isChecked_Experimental();
		},

		isCheckbox: function () {
			/// <summary>
			/// Returns true if this cell contains a checkbox.
			/// </summary>
			/// <returns>bool</returns>
			if (this.isInputRow_Experimental) {
				return false;
			}
			var columnId = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			].field;
			return 'boolean' === typeof this.cell_Experimental[columnId][0];
		},

		setEditable: function (value) {
			/// <summary>
			/// Sets a value indicating whether the cell can be edited.
			/// </summary>
			/// <param name="value" type="bool"></param>
			this.grid_Experimental.getCell(
				this.indexColumn_Experimental
			).editable = value;
		},

		isEditable: function () {
			/// <summary>
			/// Gets a value indicating whether the cell can be edited.
			/// </summary>
			/// <returns>bool</returns>
			if (this.isInputRow_Experimental) {
				return true;
			}
			return this.grid_Experimental.getCell(this.indexColumn_Experimental)
				.editable;
		},

		isEdited: function () {
			/// <summary>
			/// Gets a value indicating whether the cell is in an editable state.
			/// </summary>
			/// <returns>bool</returns>
			var rowIndex = privateProps[
				this.propsId_Experimental
			]._publicGridOrTreeGridContainer.getRowIndex(this.getRowId());
			return this.grid_Experimental.edit.isEditCell(
				rowIndex,
				this.getColumnIndex()
			);
		},

		setChecked: function () {
			//TODO
		},

		setCombo: function (labels, values) {
			/// <summary>
			/// Dynamically fills the combobox for current cell with labels and
			/// values (separated by grid delimiter). Used in the OnEditCell
			/// event handler on type=0 event.
			/// </summary>
			/// <param name="labels" type="string"></param>
			/// <param name="values" type="string"></param>
			var cellLayout = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			];
			var cellInfo = this.grid_Experimental.store.getValue(
				this.cell_Experimental,
				cellLayout.field + '$cellInfo'
			);
			var listId = cellInfo && cellInfo.listId;
			if (listId === undefined) {
				alert('Error: List Id is undefined');
				return;
			}

			var arrayLabel = labels.split(
					privateProps[this.propsId_Experimental]._publicGridOrTreeGridContainer
						.delimeter
				),
				arrayValue = values.split(
					privateProps[this.propsId_Experimental]._publicGridOrTreeGridContainer
						.delimeter
				),
				space = arrayValue.indexOf(' ');
			if (space > -1 && arrayLabel[space] === ' ') {
				arrayLabel[space] = '';
				arrayValue[space] = '';
			}

			// For ExcelGridContainer method getListsById_Experimental is not exist
			if (
				privateProps[this.propsId_Experimental]._publicGridOrTreeGridContainer
					.getListsById_Experimental
			) {
				privateProps[
					this.propsId_Experimental
				]._publicGridOrTreeGridContainer.getListsById_Experimental()[listId] = {
					labels: arrayLabel,
					values: arrayValue
				};
			}
		},

		setListId: function (listId) {
			/// <summary>
			/// Sets list ID
			/// </summary>
			/// <param name="listId" type="int"></param>
			var cellLayout = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			];
			var cellInfo = this.grid_Experimental.store.getValue(
				this.cell_Experimental,
				cellLayout.field + '$cellInfo'
			);
			if (!cellInfo) {
				cellInfo = {};
				this.grid_Experimental.store.setValue(
					this.cell_Experimental,
					cellLayout.field + '$cellInfo',
					cellInfo
				);
			}

			cellInfo.listId = listId;
		},

		setEditType: function (editTypeInt, dropDownStyleInt) {
			//BUG Major After changing value on Combo Bound sometimes error shows about the value isn't in list of the values and hard to set any value. Set edit type Bound - select in one cell some value. Then click some right than the place of dropdown button in cell where some text is shown. Error shows.
			//BUG Minor - IE 11 win 7/8 (not alway reproducible, when first select after loading page, perhaps clear cache - need to click on center of label and it will be reproducible always until loading page/clear cache)- MVList - when checked - it hard to understand that it checked, if checkbox is checked then it is not visible, but user can uncheck to see checkbox
			/// <summary>
			/// Sets the type of cell editor, either 1-inputbox or 2-combobox. Used in the onEditCell event handler on type=0 event. So you can use different editors in same column/cell.
			/// </summary>
			/// <param name="editTypeInt" type="int">
			/// <table>
			/// <tr><td>0</td><td>NOEDIT. Editing is disabled.</td></tr>
			/// <tr><td>1</td><td>FIELD. Editing is allowed. TextBox is displayed.</td></tr>
			/// <tr><td>2</td><td>COMBO. Editing is allowed. DropDown is displayed.</td></tr>
			/// <tr><td>3</td><td>MV_LIST. Editing is allowed. MV_LIST is displayed.</td></tr>
			/// </table>
			/// </param>
			/// <param name="dropDownStyleInt" type="int">
			/// Optional. Integer. Is used when editType is 2 (COMBO). Specifies type of dropdown:
			/// <table>
			/// <tr>
			/// <td>0</td><td>The user cannot directly edit the text portion. The user must click the arrow button to display the list portion. This is the default style.</td>
			/// </tr>
			/// <tr>
			/// <td>1</td><td>The text portion is editable. The user must click the arrow button to display the list portion.</td>
			/// </tr>
			/// </table>
			/// </param>
			var cellLayout = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			];
			var cellInfo = this.grid_Experimental.store.getValue(
				this.cell_Experimental,
				cellLayout.field + '$cellInfo'
			);
			if (!cellInfo) {
				cellInfo = {};
				this.grid_Experimental.store.setValue(
					this.cell_Experimental,
					cellLayout.field + '$cellInfo',
					cellInfo
				);
			}
			switch (editTypeInt) {
				case 0: //NOEDIT
				case 1: //FIELD
					if (editTypeInt === 1) {
						cellInfo.editableType = 'Field';
						this.setEditable(true);
					} else {
						this.setEditable(false);
					}
					break;
				case 2: //COMBO
				case 3: //MV_LIST
					this.setEditable(true);
					if (editTypeInt === 2) {
						if (dropDownStyleInt === 1) {
							cellInfo.editableType = 'UnboundSelect';
						} else {
							cellInfo.editableType = 'FilterComboBox';
						}
					} else {
						cellInfo.editableType = 'CheckedMultiSelect';
					}
					break;
			}
		},

		setHorAlign: function () {
			//TODO
		},

		setLink: function (link) {
			/// <summary>
			/// Sets value as link in cell.
			/// </summary>
			/// <param name="link" type="string"></param>
			this.grid_Experimental.store.setValue(
				this.cell_Experimental,
				this.grid_Experimental.layout.cells[this.indexColumn_Experimental]
					.field + 'link',
				link
			);
		},

		setValue: function (value) {
			/// <summary>
			/// Sets a value to the cell.
			/// </summary>
			/// <param name="value" type="object"></param>
			var cellLayout = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			];
			var regCheck = /<checkbox.*>/;
			var regCheckState = /.*(state|value)=["'](1|true)["'].*/;

			if (regCheck.test(value)) {
				value = regCheckState.test(value);
			} else if (this.sortNumber_Experimental) {
				value = value ? parseFloat(value) : '';
			}
			//	if (this.sortDate)  then do nothing, neutral format is supposed
			this.grid_Experimental.store.setValue(
				this.cell_Experimental,
				cellLayout.field,
				value
			);
		},

		wasChanged: function () {
			//.js - shows even if wasn't changed but trying to change, not by value
			//.js - works only if add throw xml, but always true when added from addrow
			//.net - works different way, need to see deeper in cs code, it seems it shows always true
			/// <summary>
			/// Returns true if cell's value was changed by user during the last
			/// editing of this cell, false otherwise.
			/// </summary>
			/// <returns>bool</returns>
			if (
				this.grid_Experimental.edit.isEditing() &&
				this.grid_Experimental.getItemIndex(this.cell_Experimental) ===
					this.grid_Experimental.edit.info.rowIndex &&
				this.indexColumn_Experimental ===
					this.grid_Experimental.edit.info.cell.index
			) {
				return true;
			}
			return this.grid_Experimental.store.isDirty(this.cell_Experimental);
		},

		initXml: function (xml) {
			//TODO:
		},

		setInputHelperIcon: function () {
			//TODO:
		},

		// end public methods

		// experimental methods

		isChecked_Experimental: function () {
			return this.getValue();
		},

		setCombo_Experimental: function (label, value, splitter) {
			if (typeof label === 'string' && typeof value === 'string') {
				if (!splitter) {
					splitter = '$';
				}
				var arrayLabel = label.split(splitter),
					arrayValue = value.split(splitter),
					space = arrayValue.indexOf(' ');
				if (space > -1 && arrayLabel[space] === ' ') {
					arrayLabel[space] = '';
					arrayValue[space] = '';
				}
				this.grid_Experimental.layout.cells[
					this.indexColumn_Experimental
				].optionsLables = arrayLabel;
				this.grid_Experimental.layout.cells[
					this.indexColumn_Experimental
				].options = arrayValue;
			} else if (Array.isArray(label) && Array.isArray(value)) {
				this.grid_Experimental.layout.cells[
					this.indexColumn_Experimental
				].optionsLables = label;
				this.grid_Experimental.layout.cells[
					this.indexColumn_Experimental
				].options = value;
			}
		},

		setListId_Experimental: function (listId) {
			this.grid_Experimental.store.setValue(
				this.cell_Experimental,
				'listId',
				listId
			);
		},

		getListId_Experimental: function () {
			return this.grid_Experimental.store.getValue(
				this.cell_Experimental,
				'listId'
			);
		},

		setBgColor_Experimental: function (value) {
			var fieldName = this.grid_Experimental.layout.cells[
				this.indexColumn_Experimental
			].field;
			var cellStyle = this.cell_Experimental.style[0];
			value +=
				-1 <
					privateProps[this.propsId_Experimental]._dataType.indexOf('color') &&
				-1 === value.indexOf('important')
					? '!important'
					: '';
			cellStyle[fieldName]['background-color'] = value;
		} //don't use "," after the last property all over the file, e.g, here because documentation will not be built
	});
});
