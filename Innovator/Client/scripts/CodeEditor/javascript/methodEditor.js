/* exported MethodEditor */
/* global dijit */

function MethodEditor(mainWnd) {
	var topWnd = mainWnd;
	var methodLanguages = []; // list of languages
	this.currentLanguage = "JavaScript";
	var tabPane;
	var preservedMenuFrame = null;
	var textChanged = false;

	this.subscribedEvents = {};

	this.setLanguage = function (langName) {
		if (!window.editor) {
			return;
		}
		var editorLang = "";
		switch (langName) {
			case "VB":
				editorLang = "vbscript";
				break;
			case "C#":
				editorLang = "csharp";
				break;
			case "JavaScript":
				editorLang = "javascript";
				break;
		}
		window.editor.getSession().setMode("ace/mode/" + editorLang);
		this.currentLanguage = langName;
	};

	this.switchLanguage = function (newLanguage) {
		this.setLanguage(newLanguage);
		const currentItem = parent.document.item;
		const previousLanguage = topWnd.aras.getItemProperty(currentItem, 'method_type');
		if (previousLanguage !== newLanguage && topWnd.aras.isEditStateEx(currentItem)) {
			topWnd.aras.setItemProperty(currentItem, 'method_type', newLanguage);
		}
	};

	this.fillListOfMethodLanguages = function() {
		var listId = topWnd.aras.getListId("Method Types"),
			values = topWnd.aras.getListFilterValues(listId),
			valueItem,
			len,
			i;
		for (i = 0, len = values.length; i < len; ++i) {
			valueItem = values[i];
			methodLanguages.push({
				id: topWnd.aras.getItemProperty(valueItem, "id"),
				name: topWnd.aras.getItemProperty(valueItem, "value"), side: topWnd.aras.getItemProperty(valueItem, "filter")
			});
		}
	};

	this.getListOfMethodLanguages = function() {
		return methodLanguages;
	};

	this.resizeEditor = function() {
		window.editor.resize();
	};

	this.initTabPane = function() {
		tabPane = dijit.registry.byId("tabPane");
	};

	this.selectTab = function(tabId) {
		if (!tabPane) {
			this.initTabPane();
		}
		tabPane.selectChild(dijit.registry.byId(tabId));
	};

	this.initParentMenu = function() {
		var menuFrame = (topWnd.isTearOff ? topWnd.tearOffMenuController : topWnd.menu);
		preservedMenuFrame = menuFrame;
		topWnd.setTimeout(f, 1);

		function f() {
			menuFrame.setControlEnabled("print", false);
			if (menuFrame["Preserved setControlEnabled"]) {
				return;
			}
			/* jshint ignore:start */
			menuFrame["Preserved setControlEnabled"] = menuFrame.setControlEnabled;
			menuFrame.setControlEnabled = new Function("cntrlNm", "b", "if (cntrlNm == 'print') b = false;this['Preserved setControlEnabled'](cntrlNm, b);");
			menuFrame["Restore setControlEnabled"] = new Function("this.setControlEnabled = this['Preserved setControlEnabled'];this['Preserved setControlEnabled'] = undefined;this['Restore setControlEnabled'] = undefined;");
			/* jshint ignore:end */
		}
	};

	this.restoreParentMenu = function() {
		if (!preservedMenuFrame) {
			return;
		}

		if (typeof (preservedMenuFrame['Restore setControlEnabled']) === 'function') {
			preservedMenuFrame['Restore setControlEnabled']();
		} else {
			const topWnd = aras.getMostTopWindowWithAras(window);
			const menuFrame = (topWnd.isTearOff ? topWnd.tearOffMenuController : topWnd.menu);
			menuFrame.setControlEnabled = menuFrame['Preserved setControlEnabled'];
			menuFrame['Restore setControlEnabled'] = undefined;
		}
	};

	this.saveUserChanges = function() {
		if (parent.handleItemChange) {
			parent.handleItemChange("method_code", window.editor.getValue());
		}
	};

	this.changeEventMethods = function() {
		// function to save method code before basic item events (Save, Unlock, Save and Unlock)
		topWnd.methodEditor_saveUserChangesIfNeed = function () {
			if (window.methodEditorHelper.isTextChanged) {
				window.methodEditorHelper.saveUserChanges();
			}
		};


		topWnd.SetReadOnlyMode = function(isReadOnly) {
			window.isEditMode = !isReadOnly;
			window.editor.setReadOnly(isReadOnly);

			if (!isReadOnly) {
				window.toolbar.enable();
				window.editor.focus();
			} else {
				window.toolbar.disable();
			}
		};

		topWnd.onUnlockItemSuccess = function () {
			var sourceCode = topWnd.aras.getItemProperty(parent.document.item, "method_code") || "";
			var currentCode = window.editor.getValue();
			if (sourceCode !== currentCode) {
				window.editor.setValue(sourceCode);
				window.editor.moveCursorToPosition({ row: 0, column: 0 });
			}
			textChanged = false;
			window.editor.focus();
		};


		var indx, cmd, commandsToOverride = ["onSaveUnlockAndExitCommand", "onSaveCommand", "onUnlockCommand"];
		for (var i = 0; i < commandsToOverride.length; i++) {
			cmd = commandsToOverride[i];
			cmd = topWnd[cmd].toString();
			indx = cmd.indexOf("{"); //first { after function;
			cmd = cmd.substr(0, indx + 1) + " methodEditor_saveUserChangesIfNeed(); " + cmd.substr(indx + 1);
			topWnd.eval(commandsToOverride[i] + "=" + cmd);
		}


		var unlockCommand = topWnd["onUnlockCommand"].toString(); // jshint ignore:line
		var unlockIndex = unlockCommand.indexOf("return true");
		unlockCommand = unlockCommand.substr(0, unlockIndex) + " SetReadOnlyMode(true); onUnlockItemSuccess(); " + unlockCommand.substr(unlockIndex);
		topWnd.eval("onUnlockCommand=" + unlockCommand);


		window.editor.on("change", function () {
			if (!textChanged) {
				window.saveUserChanges();
			}
			textChanged = true;
		});

		window.editor.on('blur', function () {
			window.saveUserChanges();
		});
		//--- handle method code change

		this.registerCommandHandler('before', 'done', function() {
			topWnd.methodEditor_saveUserChangesIfNeed();
		}, 'onBeforeDone');

		this.registerCommandHandler('after', 'done', function() {
			topWnd.SetReadOnlyMode(true);
		}, 'onAfterDone');

		this.registerCommandHandler('after', 'edit', function() {
			topWnd.SetReadOnlyMode(false);
		}, 'onAfterEdit');
	};

	this.ovverideDeleteCommand = function() {
		topWnd.onPurgeDeleteCommandOriginal = topWnd.onPurgeDeleteCommand;
		topWnd.onPurgeDeleteCommand = function onPurgeDeleteMethodCommand(command, silentMode) {
			topWnd.isMethodDeleted = true;
			var baseResult = topWnd.onPurgeDeleteCommandOriginal(command, silentMode);
			topWnd.isMethodDeleted = (baseResult && baseResult.result === "Deleted");
			return baseResult;
		};
	};

	this.isTextChanged = function() {
		return textChanged;
	};

	this.registerCommandHandler = function(eventType, commandName, callback, eventKey) {
		if (topWnd.registerCommandEventHandler) {
			this.subscribedEvents[eventKey] = topWnd.registerCommandEventHandler(window, callback, eventType, commandName);
		}
	};

	this.unregisterCommandHandler = function(eventKey) {
		const key = this.subscribedEvents[eventKey];
		if (key) {
			topWnd.unregisterCommandEventHandler(key);
		}
	};
}