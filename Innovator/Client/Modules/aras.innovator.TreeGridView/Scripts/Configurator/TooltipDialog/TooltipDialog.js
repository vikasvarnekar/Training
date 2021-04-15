﻿define([
	'dojo/_base/declare',
	'dijit/TooltipDialog',
	'dijit/popup',
	'dojo/on',
	'dijit/focus'
], function (declare, DojoTooltipDialog, popup, on, dijitFocus) {
	var iframeId = 'formIframeTooltipDialog';
	var tooltipId = 'tooltipId';
	var heightToMakeMinus = 45; //in px, rough height of bottom status bar and scrol. Magic value, get from CMF ListCellEditor.js.
	var dialogModule;

	return declare(null, {
		aras: null,
		_tooltipElement: null,
		_dojoTooltipDialog: null,
		_listeners: [],
		_onClose: null,
		hideOnBlur: true,
		userEventCallbacks: null,
		_oldCellViewType: null,
		templateHelper: null,

		constructor: function (args) {
			this.aras = args.aras;
			this.topWindow = this.aras.getMostTopWindowWithAras(window);
			this.userEventCallbacks = {};
		},

		acceptAndClose: function (args) {
			this._dojoTooltipDialog.onBlur(args);
		},

		onCellViewTypeChanged: function (newCellViewType) {
			if (this._oldCellViewType === newCellViewType) {
				return;
			}
			if (
				this._isToReopenDialog('Item', newCellViewType) ||
				this._isToReopenDialog('List', newCellViewType) ||
				this._isToReopenDialog('Decimal', newCellViewType) ||
				this._isToReopenDialog('Date', newCellViewType)
			) {
				this.acceptAndClose({ isToReopen: true });
			}
		},

		_isToReopenDialog: function (cellViewTypeValueToCheck, newCellViewType) {
			var isOldCellViewTypeItem =
				this._oldCellViewType === cellViewTypeValueToCheck;
			var isNewCellViewTypeItem = newCellViewType === cellViewTypeValueToCheck;
			if (
				(isOldCellViewTypeItem && !isNewCellViewTypeItem) ||
				(!isOldCellViewTypeItem && isNewCellViewTypeItem)
			) {
				return true;
			}
			return false;
		},

		destroy: function () {
			var dialogWidget = this._dojoTooltipDialog;
			var i;

			this._dojoTooltipDialog = null;

			for (i = 0; i < this._listeners.length; i++) {
				this._listeners[i].remove();
			}

			this._listeners = [];
			this.userEventCallbacks = {};

			if (dialogWidget) {
				// normalizing dijitFocus stack before closing dialog
				dialogWidget.focus();

				// implicitly clenup src in order to force 'unload' event
				dialogWidget.frameElement.src = '';
				dialogWidget.frameElement = null;

				popup.close(dialogWidget);
				dialogWidget.destroyRecursive();
			}

			if (dialogModule) {
				dialogModule.show = dialogModule.originalFuncShow;
			}
		},

		isActive: function () {
			return Boolean(this._dojoTooltipDialog);
		},

		_on: function (domNode, eventName, func) {
			this._listeners.push(on(domNode, eventName, func));
		},

		cancel: function () {
			this.executeUserEventCallback('onCancel');
			this.disableDialogs = true;
			this.destroy();
			this.disableDialogs = false;
		},

		executeUserEventCallback: function (eventName) {
			var eventCallback = this.userEventCallbacks[eventName];

			if (typeof eventCallback === 'function') {
				var eventArguments = Array.prototype.slice.call(arguments, 1);

				return eventCallback.apply(null, eventArguments);
			}
		},

		setDialogStyle: function (dialogWigdet) {
			if (dialogWigdet) {
				var domStyle = dialogWigdet.domNode.style;

				if (this.aras.Browser.isCh()) {
					domStyle.outline = 'none';
				}
			}
		},

		getQbCellTemplateValuesByAlias: function () {
			return this._qbCellTemplateValuesByAlias;
		},

		showDialog: function (
			tootipArguments,
			formUrl,
			userEventCallbacks,
			height,
			width
		) {
			var calcHeight = height && height - heightToMakeMinus;
			var openParameters;
			var iframe;
			var frameWindow;
			var frameDocument;
			var containerStyle;
			var containerActualHeight;
			var dialogWidget;
			var focusEventListenersTopWnd;

			this._oldCellViewType = tootipArguments.cellViewType;
			this._qbCellTemplateValuesByAlias =
				tootipArguments.qbCellTemplateValuesByAlias;
			this._fieldName = tootipArguments.fieldName;
			this.destroy();

			dialogWidget = new DojoTooltipDialog({ id: tooltipId });
			this._dojoTooltipDialog = dialogWidget;
			this.userEventCallbacks = userEventCallbacks || {};

			dialogWidget.set(
				'content',
				'<iframe id="' +
					iframeId +
					'" src="' +
					formUrl +
					'" style="width: 100%; height: 100%;' +
					(calcHeight && calcHeight > 0
						? 'min-height:' + calcHeight + 'px; height: ' + calcHeight + 'px;'
						: '') +
					(width && width > 0 ? ' width: ' + width + 'px;' : '') +
					' display: block;" frameborder="0"></iframe>'
			);

			// open tooltipDialog with popup
			openParameters = {
				popup: dialogWidget,
				x: tootipArguments.x,
				y: tootipArguments.y,
				//2 positions in array, 1st as default, 2nd as option if impossible to show using the first option.
				orient: tootipArguments.isAfterNotBelow
					? ['before-centered', 'after-centered']
					: ['below-centered', 'above-centered']
			};

			if (typeof openParameters.x !== 'number') {
				openParameters.around = tootipArguments.around;
			}

			this.setDialogStyle(dialogWidget);
			popup.open(openParameters);

			// popup should be opened before getElementById call
			//note that the event on here should be removed by dojo in _dojoTooltipDialog.destroy(). No need to remove it manually here.
			iframe = document.getElementById(iframeId);
			frameWindow = iframe.contentWindow;
			frameDocument = iframe.contentDocument;
			frameWindow.tooltipDialog = this;

			// disable contextMenu in iframe
			frameWindow.addEventListener('load', function (menuEvent) {
				var contextMenuHandler = function (menuEvent) {
					menuEvent.preventDefault();
					menuEvent.stopPropagation();
				};
				var focusEventListenersFrameWnd;
				var unloadHandler = function () {
					frameDocument.removeEventListener('contextmenu', contextMenuHandler);
					frameWindow.removeEventListener('beforeunload', unloadHandler);
					focusEventListenersFrameWnd.remove();
					if (focusEventListenersTopWnd) {
						focusEventListenersTopWnd.remove();
						focusEventListenersTopWnd = null;
					}
				};
				frameDocument.addEventListener('contextmenu', contextMenuHandler);
				frameWindow.addEventListener('beforeunload', unloadHandler);
				focusEventListenersFrameWnd = dijitFocus.registerWin(frameWindow);
			});

			dialogWidget.frameElement = iframe;
			dialogWidget.own(
				on(
					dialogWidget.domNode,
					'keydown',
					dialogWidget._onKey.bind(dialogWidget)
				)
			);

			this._listeners.push(
				dialogWidget.on(
					'cancel',
					function () {
						this.cancel();
					}.bind(this)
				)
			);

			var canBlur = true;
			dialogWidget.on(
				'blur',
				function (args) {
					if (!focusEventListenersTopWnd) {
						focusEventListenersTopWnd = dijitFocus.registerWin(this.topWindow);
					}

					var onBlurHandler = function () {
						if (
							!this.hideOnBlur ||
							this.executeUserEventCallback('onClose', args)
						) {
							this._dojoTooltipDialog.focus();
							return;
						}
						this.destroy();
					}.bind(this);
					setTimeout(function () {
						if (canBlur) {
							canBlur = false;

							onBlurHandler();
							setTimeout(function () {
								canBlur = true;
							});
						}
					});
				}.bind(this)
			);

			// logic to manage hideOnBlur: logic to get mostTopWindow was taken from
			// (and should be the same as in) MethodsExUtils.cs of Aras.Web.Client
			dialogModule = (this.topWindow.main || this.topWindow).ArasModules.Dialog;

			if (this.topWindow.originalFuncShow) {
				dialogModule.show = dialogModule.originalFuncShow;
			} else {
				dialogModule.originalFuncShow = dialogModule.show;
			}

			// replace 'show' method of dialogModule to avoid popup closing during AlertErrors
			var originShowDialogMethod = dialogModule.show;

			dialogModule.show = function () {
				if (this.disableDialogs) {
					return;
				}
				this.hideOnBlur = false;
				var dialogResult = originShowDialogMethod.apply(
					dialogModule,
					arguments
				);

				dialogResult.promise.then(
					function () {
						dialogWidget.focus();
						this.hideOnBlur = true;
					}.bind(this)
				);

				return dialogResult;
			}.bind(this);

			// disable context menu in tooltipWidget
			this._on(dialogWidget.domNode, 'contextmenu', function (menuEvent) {
				menuEvent.preventDefault();
				menuEvent.stopPropagation();
			});

			containerStyle = window.getComputedStyle(
				document.querySelector('#' + tooltipId + ' .dijitTooltipContainer')
			);
			containerActualHeight = parseInt(containerStyle.height);

			this._on(
				window,
				'resize',
				function () {
					this._resizeHandler(
						tootipArguments.around,
						containerActualHeight,
						height
					);
				}.bind(this)
			);

			this._resizeHandler(
				tootipArguments.around,
				containerActualHeight,
				height
			);
		},

		_resizeHandler: function (domNode, containerActualHeight, maxHeight) {
			var dialogWidget = this._dojoTooltipDialog;

			if (domNode && dialogWidget) {
				var containerStyle = dialogWidget.containerNode.style;

				maxHeight -= heightToMakeMinus;
				containerStyle.overflowY = 'auto';
				containerStyle.height =
					containerActualHeight < maxHeight ? 'auto' : maxHeight + 'px';
			}
		}
	});
});
