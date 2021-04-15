﻿define(['dojo/_base/declare'], function (declare) {
	return declare(
		'Aras.Client.Controls.Experimental.ExternalCellWidget.FilePropertyManager',
		null,
		{
			aras: null,
			isInitialized: false,
			typeName: 'filePropertyManager',
			functionalFlags: {
				render: true,
				edit: true,
				interactive: true
			},
			resourceStrings: {},
			supportedKeys: [13, 32, 113],

			constructor: function (configuration) {
				if (configuration) {
					this.aras = configuration.aras;

					if (this.aras) {
						this.resourceStrings.selectFile = this.aras.getResource(
							'',
							'file_management.select_and_upload_file'
						);
						this.resourceStrings.manageFile = this.aras.getResource(
							'',
							'file_management.manage_file_property'
						);
						this.resourceStrings.restrictedWarning = this.aras.getResource(
							'',
							'common.restricted_property_warning'
						);

						this.isInitialized = true;
					}
				}
			},

			generateCellHTML: function (layoutCell, propertyValue, rowIndex) {
				var resultContent;

				if (this.isInitialized) {
					var rowHeight = layoutCell.grid.rowHeight,
						containerHeightProperties =
							'height:' +
							rowHeight +
							'px; line-height:' +
							(rowHeight - 4) +
							'px;',
						isEnabled = this.isEnabledCell(layoutCell, rowIndex);

					if (!propertyValue) {
						if (isEnabled && this.isEditableCell(layoutCell, rowIndex)) {
							resultContent =
								'<div class="externalWidget filePropertyManager" style="' +
								containerHeightProperties +
								'">' +
								'<div class="imageButton selectButton" widgetaction="selectfile" title="' +
								this.resourceStrings.selectFile +
								'"></div>' +
								'<span class="textLink" widgetaction="selectfile" style="margin-left:4px;" title="' +
								this.resourceStrings.selectFile +
								'">' +
								this.resourceStrings.selectFile +
								'</span>' +
								'</div>';
						} else {
							resultContent = '\u0081';
						}
					} else {
						var fileLink = this.getFileLink(layoutCell, rowIndex),
							fileAction = this.getFileAction(layoutCell, rowIndex),
							isActive = isEnabled && fileLink,
							isTemp = fileAction === 'add';

						var fileIconStyle = isTemp ? 'manageButtonUnsaved' : 'manageButton';
						var innerStyle = isTemp
							? ' text-decoration: none; color: #444444;'
							: '';
						if (
							!isActive &&
							propertyValue == this.resourceStrings.restrictedWarning
						) {
							resultContent =
								'<div class="externalWidget filePropertyManager restricted" style="' +
								containerHeightProperties +
								'">' +
								'<span class="textLink" style="margin-left:4px;' +
								innerStyle +
								'">' +
								propertyValue +
								'</span>' +
								'</div>';
						} else {
							resultContent =
								'<div class="externalWidget filePropertyManager' +
								(isActive ? '' : ' widgetDisabled') +
								'" style="' +
								containerHeightProperties +
								'">' +
								'<div class="imageButton ' +
								fileIconStyle +
								'"' +
								(isActive ? 'widgetaction="managefile"' : '') +
								' title="' +
								this.resourceStrings.manageFile +
								'"></div>' +
								'<span class="textLink"' +
								(isActive ? 'widgetaction="showfile"' : '') +
								' style="margin-left:4px;' +
								innerStyle +
								'" title="' +
								propertyValue +
								'">' +
								propertyValue +
								'</span>' +
								'</div>';
						}
					}
				}

				return resultContent;
			},

			applyValue: function (layoutCell, rowIndex, newFile) {
				var gridWidget = layoutCell.grid,
					rowItem = gridWidget.getItem(rowIndex);

				if (rowItem) {
					var fileId = newFile ? newFile.getAttribute('id') : '',
						fileName = newFile
							? this.aras.getItemProperty(newFile, 'filename')
							: '',
						fileAction = newFile ? newFile.getAttribute('action') : '';

					gridWidget.store.setValue(rowItem, layoutCell.field, fileName);
					gridWidget.store.setValue(
						rowItem,
						layoutCell.field + 'link',
						"'File'," + fileId + "'"
					);
					gridWidget.store.setValue(
						rowItem,
						layoutCell.field + 'action',
						fileAction
					);

					this.onApplyEdit(
						gridWidget.store.getIdentity(rowItem),
						layoutCell.field,
						newFile
					);
				}
			},

			onClick: function (e) {
				if (this.isInitialized) {
					var srcNode = e.srcElement || e.target,
						actionName;

					while (
						srcNode &&
						(!srcNode.attributes || !srcNode.attributes.widgetaction)
					) {
						srcNode = srcNode.parentNode;
					}
					actionName = srcNode ? srcNode.attributes.widgetaction.value : '';

					this.performAction(e.cell, e.rowIndex, actionName);
				}
			},

			onKeyDown: function (layoutCell, rowIndex, e) {
				if (this.supportedKeys.indexOf(e.keyCode) != -1) {
					var gridWidget = layoutCell.grid,
						item = gridWidget.getItem(rowIndex);

					if (item) {
						var cellValue = gridWidget.store.getValue(item, layoutCell.field),
							widgetAction;

						switch (e.keyCode) {
							case 13:
							case 32:
								widgetAction = cellValue ? 'showfile' : 'selectfile';
								break;
							case 113:
								widgetAction = cellValue ? 'managefile' : 'selectfile';
								break;
						}

						this.performAction(layoutCell, rowIndex, widgetAction);
					}
				}
			},

			getFileAction: function (layoutCell, rowIndex) {
				return this._getLinkOrActionOrNameAttribute(
					layoutCell,
					rowIndex,
					'action'
				);
			},

			getFileLink: function (layoutCell, rowIndex) {
				return this._getLinkOrActionOrNameAttribute(
					layoutCell,
					rowIndex,
					'link'
				);
			},

			getFileName: function (layoutCell, rowIndex) {
				return this._getLinkOrActionOrNameAttribute(
					layoutCell,
					rowIndex,
					'filename'
				);
			},

			_getLinkOrActionOrNameAttribute: function (
				layoutCell,
				rowIndex,
				attributeName
			) {
				var gridWidget = layoutCell.grid,
					item = gridWidget.getItem(rowIndex);

				return item
					? gridWidget.store.getValue(item, layoutCell.field + attributeName)
					: '';
			},

			performAction: function (layoutCell, rowIndex, actionName) {
				var gridWidget = layoutCell.grid,
					fileLink;

				switch (actionName) {
					case 'managefile':
						fileLink = this.getFileLink(layoutCell, rowIndex);
						if (fileLink) {
							var self = this,
								onChangeHandler = function (newValue) {
									self.applyValue(layoutCell, rowIndex, newValue);
								},
								mainWindow = this.aras.getMainWindow(),
								topWnd = this.aras.getMostTopWindowWithAras(window),
								targetWindow = topWnd === mainWindow ? mainWindow.main : topWnd,
								dialogCallbacks = {},
								dialogParams;

							fileLink = fileLink.replace(/'/g, '').split(',');
							fileId = fileLink[1];

							dialogParams = {
								aras: this.aras,
								cleanup: this.isNullableCell(layoutCell, rowIndex),
								onchange: onChangeHandler
							};
							if (this.getFileAction(layoutCell, rowIndex) === 'copyAsNew') {
								var fileSource = this.aras.getItemById('File', fileId, 0),
									fileItem = this.aras.newIOMItem('File', 'copyAsNew');

								fileItem.setID(fileId);
								fileItem.removeAttribute('isTemp');
								fileItem.removeAttribute('isNew');
								fileItem.setProperty(
									'file_size',
									this.aras.getItemProperty(fileSource, 'file_size')
								);
								fileItem.setProperty(
									'file_type',
									this.aras.getItemProperty(fileSource, 'file_type')
								);
								fileItem.setProperty(
									'filename',
									this.getFileName(layoutCell, rowIndex)
								);
								fileItem.setAttribute(
									'source_filename',
									this.aras.getItemProperty(fileSource, 'filename')
								);
								dialogParams.fileNode = fileItem.node;
								dialogParams.editable = true;
							} else {
								dialogParams.fileId = fileId;
								dialogParams.editable = this.isEditableCell(
									layoutCell,
									rowIndex
								);
								if (window.FilesCache && window.FilesCache[fileId]) {
									dialogParams.fileNode = FilesCache[fileId];
								}
							}

							dialogParams.type = 'ManageFileProperty';
							dialogParams.title = 'Manage File';

							targetWindow.ArasModules.Dialog.show(
								'iframe',
								dialogParams
							).promise.then(function () {
								gridWidget.focus.focusGrid();
							});
						}
						break;
					case 'selectfile':
						function processAddingFile(file) {
							var selectedFile = this.aras.newItem('File', file);

							if (selectedFile) {
								this.aras.itemsCache.addItem(selectedFile);
								this.applyValue(layoutCell, rowIndex, selectedFile);
							}
						}
						if (this.isEditableCell(layoutCell, rowIndex)) {
							this.aras.vault.selectFile().then(processAddingFile.bind(this));
						}
						break;
					case 'showfile':
						fileLink = this.getFileLink(layoutCell, rowIndex);

						if (fileLink) {
							fileLink = fileLink.replace(/'/g, '').split(',');
							fileId = fileLink[1];
							fileNode = this.aras.getItemById('File', fileId);

							if (fileNode && !this.aras.isTempEx(fileNode)) {
								this.aras.uiShowItemEx(fileNode, undefined);
							}
						}
						break;
				}
			},

			isEditableCell: function (layoutCell, rowIndex) {
				var gridContainer = layoutCell.grid.parentContainer;

				if (gridContainer.isEditable() && layoutCell.editable) {
					var rowId = gridContainer.getRowId(rowIndex);

					return this.onCellEditableCheck(rowId, layoutCell.field);
				} else {
					return false;
				}
			},

			isNullableCell: function (layoutCell, rowIndex) {
				var gridContainer = layoutCell.grid.parentContainer,
					rowId = gridContainer.getRowId(rowIndex);

				return this.onCellNullableCheck(rowId, layoutCell.field);
			},

			isEnabledCell: function (layoutCell, rowIndex) {
				var gridContainer = layoutCell.grid.parentContainer,
					rowId = gridContainer.getRowId(rowIndex);

				return this.onCellEnabledCheck(rowId, layoutCell.field);
			},

			isRetrictedCell: function (layoutCell, rowIndex) {
				var fileLink = this.getFileLink(layoutCell, rowIndex);

				return (
					!fileLink && propertyValue == this.resourceStrings.restrictedWarning
				);
			},

			onCellEditableCheck: function (rowId, columnName) {
				// Event fired when manager checks cell "editable" state
			},

			onCellNullableCheck: function (rowId, columnName) {
				// Event fired when manager checks, availability of cell cleanup
				return true;
			},

			onCellEnabledCheck: function (rowId, columnName) {
				// Event fired when manager checks, enabled/disabled cell state
				return true;
			},

			onApplyEdit: function (rowId, columnName, newValue) {
				// Event fired when new value, selected throught manager applied to grid cell
			}
		}
	);
});
