﻿define([
	'dojo/_base/declare',
	'TechDoc/Aras/Client/Controls/TechDoc/Action/ActionBase',
	'TechDoc/Aras/Client/Controls/TechDoc/ViewModel/DocumentationEnums'
], function (declare, ActionBase, Enums) {
	return declare(
		'Aras.Client.Controls.TechDoc.Action.TableAction',
		ActionBase,
		{
			/*  Public Methods */
			Execute: function (/*Object*/ context) {
				if (
					context.createHelper &&
					context.createHelper.updateClassification &&
					context.createHelper.contextObject
				) {
					this._updateClassification =
						context.createHelper.updateClassification;
					this.contextObject = context.createHelper.contextObject;
				}

				var actionCallName = '_CallAction_' + context.action;
				this[actionCallName](context.createHelper);
			},

			GetTablesMenu: function (/*WrappedObject*/ targetElement) {
				var elementMenu;

				if (targetElement.is('ArasTableXmlSchemaElement')) {
					elementMenu = {
						table: {
							id: 'table:add',
							name: this.aras.getResource(
								'../Modules/aras.innovator.TDF',
								'contextmenu.table'
							),
							priority: 11,
							subMenu: [
								{
									id: 'table:addrow',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.addrow'
									)
								},
								{
									id: 'table:addcolumn',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.addcolumn'
									)
								}
							]
						}
					};
				} else if (targetElement.is('ArasRowXmlSchemaElement')) {
					elementMenu = {
						append: {
							id: 'table:append',
							name: this.aras.getResource(
								'../Modules/aras.innovator.TDF',
								'action.add'
							),
							priority: 11,
							subMenu: [
								{
									id: 'appendelement:External Content',
									name: 'External Content',
									icon: '../../images/TechDocItemType.svg'
								},
								{
									id: 'table:appendrow',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.row'
									),
									icon: '../../images/TableRow.svg'
								}
							]
						},
						table: {
							id: 'table:add',
							name: this.aras.getResource(
								'../Modules/aras.innovator.TDF',
								'contextmenu.table'
							),
							priority: 12,
							subMenu: [
								{
									id: 'table:removerow',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.removerow'
									)
								}
							]
						},
						wrapping: {
							id: 'group',
							name: this.actionsHelper.viewActions.group.title,
							priority: 13
						}
					};
				} else if (targetElement.is('ArasCellXmlSchemaElement')) {
					var parentTable = targetElement.GetTable();

					elementMenu = {
						table: {
							id: 'table:add',
							name: this.aras.getResource(
								'../Modules/aras.innovator.TDF',
								'contextmenu.table'
							),
							priority: 11,
							subMenu: [
								{
									id: 'table:addrow',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.addrow'
									)
								},
								{
									id: 'table:addcolumn',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.addcolumn'
									)
								},
								{
									id: 'table:removerow',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.removerow'
									)
								},
								{
									id: 'table:removecolumn',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.removecolumn'
									)
								}
							]
						}
					};

					if (parentTable) {
						var mergeMatrix = parentTable._GetMergeMatrix();
						var rowItem = targetElement.Parent;
						var rowIndex = parentTable._GetRowIndex(rowItem);
						var columnIndex = rowItem.ChildItems().index(targetElement);
						var aroundMatrix = mergeMatrix._BiuldArroundMatrix(
							rowIndex,
							columnIndex
						);

						elementMenu.table.subMenu.push({
							id: 'table:merge',
							name: this.aras.getResource(
								'../Modules/aras.innovator.TDF',
								'contextmenu.merge'
							),
							priority: 13,
							subMenu: [
								{
									id: 'table:mergeleft',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.withleftcolumn'
									),
									disable: !mergeMatrix.ValidateMerge(
										rowIndex,
										columnIndex,
										'left'
									)
								},
								{
									id: 'table:mergeright',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.withrightcolumn'
									),
									disable: !mergeMatrix.ValidateMerge(
										rowIndex,
										columnIndex,
										'right'
									)
								},
								{
									id: 'table:mergetop',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.withrowabove'
									),
									disable: !mergeMatrix.ValidateMerge(
										rowIndex,
										columnIndex,
										'top'
									)
								},
								{
									id: 'table:mergebot',
									name: this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'contextmenu.withrowbelow'
									),
									disable: !mergeMatrix.ValidateMerge(
										rowIndex,
										columnIndex,
										'bot'
									)
								}
							]
						});

						if (aroundMatrix.w > 1 || aroundMatrix.h > 1) {
							elementMenu.table.subMenu.push({
								id: 'table:unmerge',
								name: this.aras.getResource(
									'../Modules/aras.innovator.TDF',
									'contextmenu.unmerge'
								),
								priority: 14
							});
						}
					}
				}

				return elementMenu || {};
			},

			getCreateSiblingMenu: function (/*WrappedObject*/ targetElement) {
				if (targetElement.is('ArasRowXmlSchemaElement')) {
					return [
						{
							id: 'appendelement:External Content',
							name: 'External Content',
							icon: '../../images/TechDocItemType.svg'
						},
						{
							id: 'table:appendrow',
							name: this.aras.getResource(
								'../Modules/aras.innovator.TDF',
								'contextmenu.row'
							),
							icon: '../../images/TableRow.svg'
						}
					];
				}
			},

			/*private actions*/
			//++++++++++ Table menu action execute ++++++++++++//
			_CallAction_table: function (createTableHelper) {
				var selectedItem = this._viewmodel.GetSelectedItems();

				if (selectedItem.length == 1) {
					var direction = createTableHelper && createTableHelper.direction;
					var element = createTableHelper && createTableHelper.newElementName;
					var schemaHelper = this._viewmodel.Schema();

					if (!direction || !element) {
						var expetedElements = schemaHelper.GetExpectedElements(
							selectedItem[0]
						);
						var insertList = expetedElements.insert;
						var appendList = expetedElements.append;
						var type;
						var i;

						if (!direction || direction == 'insert') {
							for (i = 0; i < insertList.length; i++) {
								element = insertList[i];
								type = schemaHelper.GetSchemaElementType(element);

								if (
									(type & Enums.XmlSchemaElementType.Table) ==
									Enums.XmlSchemaElementType.Table
								) {
									direction = 'insert';
									break;
								}
							}
						}

						if (!direction || direction == 'append') {
							for (i = 0; i < appendList.length; i++) {
								element = appendList[i];
								type = schemaHelper.GetSchemaElementType(element);

								if (
									(type & Enums.XmlSchemaElementType.Table) ==
									Enums.XmlSchemaElementType.Table
								) {
									direction = 'append';
									break;
								}
							}
						}
					}

					if (direction && element) {
						var param = {
							title: 'Attributes Dialog',
							formId: 'C25EF9D09C844CF99E2FFC4BB19D3B28', // tp_AddTable Form
							aras: this.aras,
							isEditMode: true,
							dialogWidth: 250,
							dialogHeight: 100,
							content: 'ShowFormAsADialog.html'
						};

						this.actionsHelper.topWindow.ArasModules.Dialog.show(
							'iframe',
							param
						).promise.then(
							function (result) {
								if (result) {
									var createTableInfo = {};
									createTableInfo.direction = direction;
									createTableInfo.newElementName = element;

									this._viewmodel.SuspendInvalidation();

									if (this._updateClassification) {
										this._updateClassification({
											newElementName: createTableInfo.newElementName,
											contextObject: this.contextObject,
											xmlSchemaElements: schemaHelper._xmlSchemaElements
										});
									}

									this._GenerateNewTable(
										result.cols,
										result.rows,
										createTableInfo
									);

									this._viewmodel.ResumeInvalidation();
								}
							}.bind(this)
						);
					} else {
						this.aras.AlertError(
							this.aras.getResource(
								'../Modules/aras.innovator.TDF',
								'action.cannot_table_here'
							)
						);
					}
				}
			},

			/*Table Action*/
			_CallAction_addrow: function () {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];

				if (selectedItem.is('ArasTableXmlSchemaElement')) {
					selectedItem.AddRow(0);
				} else if (selectedItem.is('ArasRowXmlSchemaElement')) {
					var parentItem = selectedItem.GetTable();

					parentItem.AddRow(selectedItem);
				} else if (selectedItem.is('ArasCellXmlSchemaElement')) {
					var rowItem = selectedItem.Parent;

					if (rowItem && rowItem.is('ArasRowXmlSchemaElement')) {
						var tableItem = rowItem.GetTable();

						if (tableItem) {
							tableItem.AddRow(rowItem);
						} else {
							rowItem.GetRowsController().AppendRow(rowItem);
						}
					}
				}
			},

			_CallAction_addcolumn: function () {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];

				if (selectedItem.is('ArasTableXmlSchemaElement')) {
					selectedItem.AddColumn(0);
				} else if (selectedItem.is('ArasCellXmlSchemaElement')) {
					var rowItem = selectedItem.Parent;

					if (rowItem && rowItem.is('ArasRowXmlSchemaElement')) {
						var tableItem = rowItem.GetTable();
						var indexInParent = rowItem.ChildItems().index(selectedItem);

						if (tableItem) {
							tableItem.AddColumn(indexInParent + 1);
						} else {
							rowItem.GetRowsController().AppendCell(indexInParent + 1);
						}
					}
				}
			},

			/*Row Action*/
			_CallAction_appendrow: function () {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];

				if (selectedItem.is('ArasRowXmlSchemaElement')) {
					var tableItem = selectedItem.GetTable();

					if (tableItem) {
						tableItem.AddRow(selectedItem);
					} else {
						selectedItem.GetRowsController().AppendRow(selectedItem);
					}
				}
			},

			/*Cell Action*/
			_CallAction_removerow: function () {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];
				var rowItem;
				var tableItem;

				if (selectedItem.is('ArasCellXmlSchemaElement')) {
					rowItem = selectedItem.Parent;
				} else if (selectedItem.is('ArasRowXmlSchemaElement')) {
					rowItem = selectedItem;
				}

				if (rowItem && rowItem.is('ArasRowXmlSchemaElement')) {
					tableItem = rowItem.GetTable();

					if (tableItem) {
						tableItem.RemoveRow(rowItem);
					} else {
						rowItem.GetRowsController().RemoveRow(rowItem);
					}
				}
			},

			_CallAction_removecolumn: function () {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];

				if (selectedItem.is('ArasCellXmlSchemaElement')) {
					var rowItem = selectedItem.Parent;

					if (rowItem) {
						var tableItem = rowItem.GetTable();
						var colIndex = rowItem.ChildItems().index(selectedItem);

						if (tableItem) {
							tableItem.RemoveColumn(colIndex);
						} else {
							rowItem.GetRowsController().RemoveCell(colIndex);
						}
					}
				}
			},

			_CallAction_mergeleft: function () {
				this._MergeCellsInTable('left');
			},

			_CallAction_mergeright: function () {
				this._MergeCellsInTable('right');
			},

			_CallAction_mergetop: function () {
				this._MergeCellsInTable('top');
			},

			_CallAction_mergebot: function () {
				this._MergeCellsInTable('bot');
			},

			_CallAction_unmerge: function () {
				this._UnmergeTableCells();
			},

			/*For all*/
			_CallAction_remove: function () {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];
				var parent = selectedItem.Parent;
				var childList = parent.ChildItems();
				var childIndex = childList.index(selectedItem);

				childList.splice(childIndex, 1);
			},
			//---------- Table menu action execute ------------//

			/*Cell styles*/
			_CallAction_center: function () {
				this._SetStyleForCell('align', 'center');
			},

			_CallAction_justify: function () {
				this._SetStyleForCell('align', 'justify');
			},

			_CallAction_left: function () {
				this._SetStyleForCell('align', 'left');
			},

			_CallAction_right: function () {
				this._SetStyleForCell('align', 'right');
			},

			_CallAction_top: function () {
				this._SetStyleForCell('valign', 'top');
			},

			_CallAction_middle: function () {
				this._SetStyleForCell('valign', 'middle');
			},

			_CallAction_bottom: function () {
				this._SetStyleForCell('valign', 'bottom');
			},

			_SetStyleForCell: function (style, value) {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];

				if (selectedItem && selectedItem.is('ArasCellXmlSchemaElement')) {
					selectedItem.Attribute(style, value);
				}
			},

			/*Other*/
			_MergeCellsInTable: function (/*String*/ direction) {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];

				if (selectedItem.is('ArasCellXmlSchemaElement')) {
					var rowItem = selectedItem.Parent;

					if (rowItem) {
						var tableItem = rowItem.GetTable();

						if (tableItem) {
							var rowIndex = tableItem._GetRowIndex(rowItem);
							var columnIndex = rowItem.ChildItems().index(selectedItem);

							if (
								!tableItem.ExecuteCellsMerge(rowIndex, columnIndex, direction)
							) {
								this.aras.AlertError(
									this.aras.getResource(
										'../Modules/aras.innovator.TDF',
										'action.mergeisinvalid'
									)
								);
							}
						}
					}
				}
			},

			_UnmergeTableCells: function () {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];

				if (selectedItem.is('ArasCellXmlSchemaElement')) {
					var rowItem = selectedItem.Parent;

					if (rowItem) {
						var tableItem = rowItem.GetTable();

						if (tableItem) {
							var rowIndex = tableItem._GetRowIndex(rowItem);
							var columnIndex = rowItem.ChildItems().index(selectedItem);

							tableItem.UnmergeCells(rowIndex, columnIndex);
						}
					}
				}
			},

			_GenerateNewTable: function (colsNum, rowsNum, helper) {
				var selectedItem = this._viewmodel.GetSelectedItems()[0];
				var newElementName = helper.newElementName;
				var newTableElement = this._viewmodel.CreateElement('element', {
					type: newElementName
				});
				var direction = helper.direction;

				switch (direction) {
					case 'insert':
						selectedItem.ChildItems().insertAt(0, newTableElement);
						break;
					case 'append':
						var indexInParent = selectedItem.Parent.ChildItems().index(
							selectedItem
						);
						selectedItem.Parent.ChildItems().insertAt(
							indexInParent + 1,
							newTableElement
						);
						break;
				}

				newTableElement.GenerateTableBody(colsNum, rowsNum);
				this._viewmodel.focusElement(newTableElement, true);
			}
		}
	);
});
