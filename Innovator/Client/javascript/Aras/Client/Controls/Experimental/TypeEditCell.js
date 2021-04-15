﻿define([
	'dojo/_base/declare',
	'dojo/store/Memory',
	'dijit/form/FilteringSelect',
	'dijit/form/ComboBox',
	'dijit/form/ValidationTextBox',
	'dijit/form/SimpleTextarea',
	'./_grid/CheckedMultiSelect',
	'dojo/data/ItemFileReadStore',
	'dijit/form/CheckBox',
	'dojox/grid/cells/dijit',
	'dojo/dom',
	'dojo/dom-class',
	'dijit/popup',
	'dojo/_base/sniff',
	'dojo/_base/lang'
], function (
	declare,
	Memory,
	FilteringSelect,
	ComboBox,
	TextBox,
	SimpleTextarea,
	CheckedMultiSelect,
	ItemFileReadStore,
	CheckBox,
	dijitWidget,
	dom,
	domClass,
	popup,
	has,
	lang
) {
	var textBoxValidate = declare(TextBox, {
		_partialre: '$' // needed for validation during typing, because the default regExp ".*" allows to validate only when cell lose focus
	});

	function applyProps(container, props) {
		this.domNode = container;
		this.dataSourceName = props.dataSourceName;
		this.keyDownHandler = props.onKeyDown || null;
		this.buttonHandler = props.loadDropDown || null;
		var value = props.displayedValue || props.value;
		this.component.state.value = value || '';
	}

	var defaultPrototype = {
		set: function (type, val) {
			if (type === 'value') {
				this.component.state.value = val;
				this.component.render();
			}
		},
		get: function (type) {
			if (type === 'value') {
				return this.component.state.value;
			}
		},
		focus: function () {
			this.component.state.focus = true;
			this.component.setFocus();
		},
		startup: function () {},
		destroyRecursive: function () {
			this.component = null;
			this.domNode.removeChild(this.domNode.children[0]);
		},
		isValid: function () {
			return this.component.state.validation === true
				? this.component.validate()
				: true;
		}
	};

	var ItemPropertyComponent = function (props, container) {
		this.component = document.createElement('aras-item-property');
		this.component.setState({
			itemType: props.dataSourceName
		});
		applyProps.call(this, container, props);
		var self = this;

		this.component.format = function (template) {
			var input = template.children[0];
			var button = template.children[2];
			var nativeHandler = input.events.onkeydown.bind(this);
			input.events.onkeydown = function (evt) {
				nativeHandler(evt);
				self.keyDownHandler(evt);
				if (evt.key !== 'Enter') {
					evt.stopPropagation();
				}
			}.bind(self);

			button.events = {
				onclick: self.buttonHandler
			};

			template.className += ' aras-filter-list_without-border';

			return template;
		};

		this.component.state.validation =
			props.validation !== undefined ? !!props.validation : true;

		container.appendChild(this.component);
	};

	ItemPropertyComponent.prototype = lang.mixin({}, defaultPrototype);

	var ClassificationComponent = function (props, container) {
		this.component = document.createElement('aras-classification-property');
		this.component.setState({
			list: props.dataSource
		});
		applyProps.call(this, container, props);
		var self = this;

		this.component.format = function (template) {
			var input = template.children[0];
			var button = template.children[2];
			var nativeHandler = input.events.onkeydown.bind(this);
			input.events.onkeydown = function (evt) {
				nativeHandler(evt);
				self.keyDownHandler(evt);
				if (evt.key !== 'Enter') {
					evt.stopPropagation();
				}
			}.bind(self);

			button.events = {
				onclick: self.buttonHandler
			};

			template.className += ' aras-filter-list_without-border';

			return template;
		};

		this.component.state.validation = true;

		container.appendChild(this.component);
	};

	ClassificationComponent.prototype = lang.mixin({}, defaultPrototype, {
		get: function (type) {
			if (type === 'value') {
				var value = this.component.state.value;
				if (this.isValid()) {
					return value;
				}
				this.set('value', '');
				return '';
			}
		}
	});

	return declare(
		'Aras.Client.Controls.Experimental.TypeEditCell',
		dojox.grid.cells._Widget,
		{
			formatNode: function (inNode, inDatum, inRowIndex) {
				var widgetProperties,
					forceRebuildWidget = false,
					item = this.grid.getItem(inRowIndex),
					methodArguments = arguments,
					cellInfo =
						inRowIndex === undefined
							? undefined
							: this.grid.store.getValue(
									this.grid.getItem(inRowIndex),
									this.field + '$cellInfo'
							  ),
					editableType =
						(cellInfo && cellInfo.editableType) || this.editableType;

				this.itemId = this.grid.store.getIdentity(item);
				// code validation rules doesn't allow explicitly set values to arguments array
				methodArguments[1] = this.convertFromNeutral(inDatum);
				switch (editableType) {
					case 'FilterComboBox':
					case 'FilterComboBoxHelper':
						this.widgetClass = FilteringSelect;
						if (this.widget) {
							widgetProperties = this.getWidgetProps(undefined, inRowIndex);
							this.widget.set('store', widgetProperties.store);
						}
						break;
					case 'UnboundSelect':
						this.widgetClass = ComboBox;
						if (this.widget) {
							widgetProperties = this.getWidgetProps(undefined, inRowIndex);
							this.widget.set('store', widgetProperties.store);
						}
						break;
					case 'CheckedMultiSelect':
						this.widgetClass = CheckedMultiSelect;
						// this widget rebuilded each time, because it initialized unproperly on reusing
						forceRebuildWidget = true;
						break;
					case 'InputHelper':
						this.widgetClass = ItemPropertyComponent;
						this.widget = null;
						break;
					case 'ClassificationHelper':
						this.widgetClass = ClassificationComponent;
						this.widget = null;
						break;
					case 'Textarea':
						this.widgetClass = SimpleTextarea;
						break;
					default:
						if ('boolean' == typeof inDatum) {
							this.widgetClass = CheckBox;
						} else if (this.sort === 'DATE' && this.inputformat) {
							if (cellInfo && cellInfo.editableType) {
								editableType = cellInfo.editableType = 'DateHelper';
							} else {
								editableType = this.editableType = 'DateHelper';
							}

							this.widgetClass = ComboBox;
							this.setInputHelperStyle('date');
						} else {
							this.widgetClass = textBoxValidate;
						}
				}

				forceRebuildWidget =
					this.widget &&
					(forceRebuildWidget ||
						this.widgetClass.prototype.declaredClass !==
							this.widget.declaredClass);
				if (forceRebuildWidget) {
					if (this.widget.dropDownMenu) {
						popup.close(this.widget.dropDownMenu);
						this.widget.dropDownMenu.destroyRecursive(false);
					}

					this.widget.destroyRecursive(false);
					this.widget = null;
				}

				var result = this.inherited(methodArguments);
				this._underConstruction = false;

				switch (editableType) {
					case 'Textarea':
						this.widget.domNode.style.height = '1px';
						this.widget.domNode.style.overflowY = 'hidden';

						this.widget.domNode.style.height =
							this.widget.domNode.scrollHeight + 1 + 'px';
						this.widget.domNode.style.overflowY = 'auto';
						this.grid.views.renormalizeRow(inRowIndex);
						this.grid.scroller.rowHeightChanged(inRowIndex, true);
						break;
					case 'InputHelper':
						if (this._inputHelperStyle) {
							domClass.add(this.widget.domNode, this._inputHelperStyle);
						}
						if (inNode.parentNode) {
							inNode.parentNode.style.overflow = 'visible';
						}
						break;
					case 'ClassificationHelper':
						inNode.parentNode.style.overflow = 'visible';
						break;
					case 'DateHelper':
						if (this._inputHelperStyle) {
							domClass.add(this.widget.domNode, this._inputHelperStyle);
						}
						break;
				}

				// The 'textBox' widget fully fills cell in IE, thus icons 'treeGrid' are hided. We have to shrink the widget width till needed size.
				if (
					document.all !== 'undefined' &&
					inNode.querySelector('.dojoxGridExpandoNode') &&
					this.widget.baseClass === 'dijitTextBox dijitValidationTextBox'
				) {
					var nodeWidth = inNode.clientWidth,
						paddingRight = inNode.firstChild.style.paddingRight.replace(
							'px',
							''
						),
						marginLeft = inNode.firstChild.style.marginLeft.replace('px', ''),
						widgetWidth =
							nodeWidth -
							inNode.firstChild.clientWidth -
							paddingRight -
							marginLeft;
					this.widget.domNode.style.width = widgetWidth + 'px';
				}
				this.focusWidget();
				return result;
			},

			convertFromNeutral: function (neutralValue) {
				var converter = dojoConfig.arasContext.converter;
				var convertedValue = neutralValue;
				if (neutralValue) {
					if (this.sort === 'NUMERIC') {
						var numberType = this.inputformat ? 'decimal' : 'float';
						convertedValue = converter.convertFromNeutral(
							neutralValue,
							numberType,
							this.inputformat
						);
					} else if (this.sort === 'DATE' && this.inputformat) {
						convertedValue = converter.convertFromNeutral(
							neutralValue,
							'date',
							this.inputformat
						);
					}
				}
				return convertedValue;
			},

			convertToNeutral: function (localValue) {
				var converter = dojoConfig.arasContext.converter;
				var convertedValue = localValue;
				if (localValue) {
					if (this.sort === 'NUMERIC') {
						var numberType = this.inputformat ? 'decimal' : 'float';
						convertedValue = converter.convertToNeutral(
							localValue,
							numberType,
							this.inputformat
						);
					} else if (this.sort === 'DATE') {
						convertedValue = converter.convertToNeutral(
							localValue,
							'date',
							this.inputformat
						);
					}
				}
				return convertedValue;
			},

			parseValue: function (neutralString) {
				var convertedValue = neutralString;
				if (neutralString) {
					if (this.sort === 'NUMERIC') {
						convertedValue = parseFloat(neutralString);
					} else if (this.sort === 'DATE') {
						convertedValue = Date.parse(neutralString);
					} else {
						convertedValue = isNaN(Number(neutralString))
							? neutralString
							: Number(neutralString);
					}
				}
				return convertedValue;
			},

			getWidgetProps: function (inDatum, inRowIndex) {
				inDatum = this._unescapeHTML(inDatum);
				var items,
					lables,
					i,
					options,
					list,
					cellInfo =
						inRowIndex === undefined
							? undefined
							: this.grid.store.getValue(
									this.grid.getItem(inRowIndex),
									this.field + '$cellInfo'
							  ),
					editableType =
						(cellInfo && cellInfo.editableType) || this.editableType,
					listId = cellInfo && cellInfo.listId;
				//listId can be 0 and it's truly value, so don't use "if (listId)..."
				if (listId !== undefined && listId !== '') {
					list = this.cellLayoutLists[listId];
				}
				switch (editableType) {
					case 'UnboundSelect':
					case 'FilterComboBox':
						lables = list ? list.labels : this.optionsLables || this.options;
						options = list ? list.values : this.options;
						items = [];
						for (i = 0; i < options.length; i++) {
							items.push({ name: lables[i], id: options[i] });
						}
						return {
							value: inDatum,
							searchAttr: 'name',
							store: new Memory({ data: items }),
							required: false
						};
					case 'FilterComboBoxHelper':
						lables = list ? list.labels : this.optionsLables || this.options;
						options = list ? list.values : this.options;
						items = [];
						for (i = 0; i < options.length; i++) {
							items.push({ name: lables[i], id: options[i] });
						}
						return {
							value: inDatum,
							searchAttr: 'name',
							store: new Memory({ data: items }),
							required: false,
							_onDropDownMouseDown: this.showInputHelper(),
							onKeyDown: this.keyPress()
						};
					case 'CheckedMultiSelect':
						lables = list ? list.labels : this.optionsLables || this.options;
						options = list ? list.values : this.options;
						items = [];
						for (i = 0; i < options.length; i++) {
							items.push({ label: lables[i] || '&nbsp;', value: options[i] });
						}
						return {
							store: new ItemFileReadStore({
								data: { identifier: 'value', label: 'label', items: items }
							})
						};
					case 'InputHelper':
						return {
							validation: this.itemPropertyValidation,
							dataSourceName: this.dataSourceName,
							displayedValue: inDatum,
							onKeyDown: this.keyPress(),
							loadDropDown: this.showInputHelper(),
							validator: this.validator(),
							_onInput: function () {}
						};
					case 'ClassificationHelper':
						return {
							dataSource: this.classificationName,
							displayedValue: inDatum,
							onKeyDown: this.keyPress(),
							loadDropDown: this.showInputHelper(),
							_onInput: function () {}
						};
					case 'DateHelper':
						return {
							dataSourceName: this.dataSourceName,
							displayedValue: inDatum,
							onKeyDown: this.keyPress(),
							loadDropDown: this.showInputHelper(),
							validator: this.validator(),
							_onInput: function () {}
						};
					case 'Textarea':
						return {
							value: inDatum,
							onKeyDown: this.keyPressTextArea(),
							validator: this.validator()
						};
					case 'InputHelperTextBox':
						return {
							value: inDatum,
							validator: this.validator(),
							onKeyDown: this.keyPress(),
							_onInput: function () {}
						};
				}
				if ('boolean' == typeof inDatum) {
					return { checked: inDatum };
				} else {
					return { value: inDatum, validator: this.validator() };
				}
			},

			getEditNode: function (inRowIndex) {
				return (this.getNode(inRowIndex) || 0).lastChild || 0;
			},

			createWidget: function (inNode, inDatum, inRowIndex) {
				var self = this,
					cellInfo =
						inRowIndex === undefined
							? undefined
							: this.grid.store.getValue(
									this.grid.getItem(inRowIndex),
									this.field + '$cellInfo'
							  ),
					editableType =
						(cellInfo && cellInfo.editableType) || this.editableType;

				function createSpecificWidget(data, needAppend) {
					var widget = new self.widgetClass(
						self.getWidgetProps(inDatum, inRowIndex),
						document.createElement('div')
					);
					widget.set('value', data);
					widget.startup();

					if (needAppend) {
						inNode.appendChild(widget.domNode);
					}
					return widget;
				}

				if ('CheckedMultiSelect' === editableType) {
					return createSpecificWidget(inDatum.split(','), true);
				} else {
					return this.isCollapsable
						? createSpecificWidget(inDatum, true)
						: new this.widgetClass(
								this.getWidgetProps(inDatum, inRowIndex),
								inNode
						  );
				}
			},

			needFormatNode: function (inDatum, inRowIndex) {
				this._underConstruction = true;
				this._constructionValue = inDatum;
				this._stopConstruction = false;
				this.inherited(arguments);
			},

			_formatNode: function (inDatum, inRowIndex) {
				// internal method: copied from cells/_base.js
				// added editNode exists check
				if (this._formatPending) {
					var editNode = this.getEditNode(inRowIndex);
					var editCellInfo = this.grid.edit.info;

					if (
						editCellInfo &&
						(!editCellInfo.cell || this.id !== editCellInfo.cell.id)
					) {
						return;
					}
					this._formatPending = false;
					if (editNode) {
						// make cell selectable
						if (!has('ie')) {
							dom.setSelectable(this.grid.domNode, true);
						}
						this.formatNode(editNode, inDatum, inRowIndex);
					} else {
						this.cancelEdit(inRowIndex);
					}
				}
			},

			getValue: function (inRowIndex) {
				if (this._underConstruction) {
					return this._constructionValue;
				} else {
					var cellInfo =
							inRowIndex === undefined
								? undefined
								: this.grid.store.getValue(
										this.grid.getItem(inRowIndex),
										this.field + '$cellInfo'
								  ),
						editableType =
							(cellInfo && cellInfo.editableType) || this.editableType;
					if ('CheckedMultiSelect' === editableType) {
						return this.widget.get('value').join(',');
					} else if (
						'dijit.form.CheckBox' === this.widgetClass.prototype.declaredClass
					) {
						return this.widget.checked;
					} else {
						var isValidValue =
							this.widget && this.widget.isValid ? this.widget.isValid() : true;
						if (this.widget && isValidValue) {
							var widgetValue = this.widget.get('value');
							if (this.sort === 'NUMERIC' || this.sort === 'DATE') {
								return this.convertToNeutral(widgetValue);
							} else {
								return widgetValue;
							}
						} else {
							return this._constructionValue;
						}
					}
				}
			},

			setValue: function (inRowIndex, inValue) {
				var cellInfo =
						inRowIndex === undefined
							? undefined
							: this.grid.store.getValue(
									this.grid.getItem(inRowIndex),
									this.field + '$cellInfo'
							  ),
					editableType =
						(cellInfo && cellInfo.editableType) || this.editableType;

				if (
					'dijit.form.CheckBox' === this.widgetClass.prototype.declaredClass
				) {
					if (this.widget && this.widget.attributeMap.checked) {
						this.widget.set('checked', inValue);
					}
				} else if ('CheckedMultiSelect' === editableType) {
					if (!inValue) {
						//apply workaround for dojo bug as pointed in https://bugs.dojotoolkit.org/ticket/16606
						this.widget.reset();
						this.widget._updateSelection();
						this.widget._getChildren().forEach(function (item) {
							domClass.remove(
								item.iconNode,
								'dijitCheckBoxChecked dijitChecked'
							);
						});
					}
					inValue = inValue.split(',');
				} else if ('InputHelper' === editableType && this.widget.component) {
					this.widget.component.state.itemType = this.dataSourceName;
				}
				this.inherited(arguments);
			},

			setInputHelperStyle: function (styleName) {
				if (styleName) {
					styleName = styleName.toString();
					this._inputHelperStyle =
						'InputHelper' +
						styleName.substr(0, 1).toUpperCase() +
						(styleName.length > 1 ? styleName.substr(1).toLowerCase() : '');
				} else {
					this._inputHelperStyle = '';
				}
			},

			_finish: function (inRowIndex) {
				if (!this._underConstruction) {
					this.inherited(arguments);

					// Fix for dojo bug in grid as solution of Innovator regression REG-002406
					//
					// Details:
					// Dojo checking has("css-user-select") was changed in versions later than 1.9.1
					// Now for IE 11 the method "setSelectable" of "dom" module toggles attribute "unselectable"
					// instead of css property "userSelect" to fix some bug of dijit Editor buttons
					// But for created grid cells it makes them not editable
					if (has('trident')) {
						dom.setSelectable(this.widget.domNode, true);
					}
				}
			},

			focus: function (inRowIndex, inNode) {
				//Do nothing, because we can change widget
			},

			focusWidget: function (inRowIndex, inNode) {
				setTimeout(
					function () {
						if (this.widget) {
							this.widget.focus();
						}
					}.bind(this),
					0
				);
			},

			keyPress: function () {
				var self = this;
				var F2 = 113;
				return function (keyEvent) {
					if (F2 === keyEvent.keyCode) {
						self.grid.edit.cancel();
						self.grid.onInputHelperShow(
							self.itemId,
							self.grid.order[self.layoutIndex]
						);
						keyEvent.stopPropagation();
					}
				};
			},

			keyPressTextArea: function () {
				var self = this;
				return function (keyEvent) {
					var isMacOS = /mac/i.test(navigator.platform),
						isCtrlPressed = isMacOS ? keyEvent.metaKey : keyEvent.ctrlKey;

					switch (keyEvent.keyCode) {
						case 13:
							if (isCtrlPressed && keyEvent.altKey) {
								var textArea = self.widget,
									newLinePosition = textArea.domNode.selectionEnd,
									currentText = textArea.getValue();

								textArea.setValue(
									currentText.substring(0, newLinePosition) +
										'\n' +
										currentText.substr(newLinePosition)
								);
								textArea.domNode.selectionStart = textArea.domNode.selectionEnd =
									newLinePosition + 1;
								keyEvent.stopPropagation();
							}
							break;
						case 113:
							self.grid.edit.cancel();
							self.grid.onInputHelperShow(
								self.itemId,
								self.grid.order[self.layoutIndex]
							);
							keyEvent.stopPropagation();
							break;
					}
				};
			},

			showInputHelper: function () {
				var self = this;
				return function () {
					self.grid.edit.cancel();
					self.grid.onInputHelperShow(
						self.itemId,
						self.grid.order[self.layoutIndex]
					);
				};
			},

			validator: function () {
				var self = this;
				return function (value) {
					return self.grid.validateCell(self.itemId, self.field, value);
				};
			}
		}
	);
});
