﻿function ToggleReportGrid(table, columnsToHide) {
	var innerTables = new Array();

	// Show all columns in case there is hidden columns already
	jq$(table).find('tr > td').show();
	// Remove previously created inner tables
	jq$(table).find('.inner-field-value-table').closest('tr').remove();
	// Remove show/hide control
	jq$(table).find('.inner-grid-toggle-control').remove();

	if (columnsToHide <= 0)
		return;

	// Extract header
	var headerValues = new Array();
	var headerRow$ = jq$(table).find('tr.ReportHeader');
	if (headerRow$.length > 0) {
		var cells = headerRow$[0].cells;
		var cCnt = cells.length - columnsToHide;
		while (cCnt < cells.length) {
			headerValues.push(jq$(cells[cCnt]).text());
			cCnt++;
		}
	}
	
	// Generate inner tables for each row
	jq$(table).find('tr:not(.ReportHeader)').each(function () {
		var innerTable$ = jq$(document.createElement('table'));
		innerTable$.attr('class', 'inner-field-value-table');

		var cCnt = this.cells.length - columnsToHide;
		while (cCnt < this.cells.length) {
			var innerRow$ = jq$(document.createElement('tr'));
			ReportingServices.tipOn(innerRow$[0], this.cells[cCnt].getAttribute("subtotal-title"), { orientation: "bottom" });

			var headerCell$ = jq$(document.createElement('td'));
			headerCell$.attr('class', 'field');
			headerCell$.text(headerValues[cCnt - (this.cells.length - columnsToHide)]);

			var valueCell$ = jq$(document.createElement('td'));
			valueCell$.attr('class', 'value');
			valueCell$.html(jq$(this.cells[cCnt]).html());

			innerRow$.append(headerCell$);
			innerRow$.append(valueCell$);
			innerTable$.append(innerRow$);

			cCnt++;
		}

		innerTables.push(innerTable$);
	});

	// Modify Report Grid
	jq$(table).find('tr').each(function (i) {

		var row$ = jq$(this);

		// Insert hiddable row with inner grid
		if (!row$.hasClass("ReportHeader")) {
			var newRow$ = jq$(document.createElement('tr'));
			newRow$.attr('class', row$.attr('class') + ' hiddable');
			var newCell$ = jq$(document.createElement('td'));
			newCell$.attr('colspan', row$.find('td').length);
			newCell$.append(innerTables[i - 1]);

			newRow$.append(newCell$);
			newRow$.hide();
			row$.after(newRow$);

			// Add show/hide control to the target row
			row$.find('td:first').prepend('<img class="inner-grid-toggle-control" onclick="ToggleInnerGrid(this)" src="###RS###image=plus.gif"/>');
		}
	});
}

function ToggleReportGrids() {
	var reportTables$ = jq$('.ReportTable.SimpleGrid');
	reportTables$.each(function () {
		var this$ = jq$(this);
		if (this$.parents('[id$=_ReportsDiv]').length < 1)
			return;

		if (this$.find('tr.ReportItem:not(.hiddable), tr.AlternatingItem:not(.hiddable)').length > 5001)
			return;
		var columnsToHide = 0;
		var headers = this$.find('.ReportHeader td');
		for (var i = 1; i < headers.length; i++) {
			if (NeedHideColumn(headers[i]))
				columnsToHide++;
		}
	
		var oldColumnsToHide = this$.data('columns-to-hide');
		if (oldColumnsToHide == null || oldColumnsToHide != columnsToHide)
			ToggleReportGrid(this$, columnsToHide);
		this$.data('columns-to-hide', columnsToHide);
	});
}

function ToggleInnerGrid(element) {
	jq$(element).closest('tr').next('.hiddable').toggle(500);
	ToggleControlIcon(element);
}

function ToggleControlIcon(element) {
	var baseUrl = '###RS###image=';
	var src = jq$(element).attr('src').toString();
	if (src.indexOf('plus.gif', src.length - 'plus.gif'.length) !== -1)
		jq$(element).attr('src', baseUrl + 'minus.gif');
	else
		jq$(element).attr('src', baseUrl + 'plus.gif');
}

function NeedHideColumn(header) {
	var header$ = jq$(header),
		report$ = header$.parents('[id$=_ReportsDiv]');
	var rightHeaderBorder = header$.offset().left + header$.width(),
		rightReportBorder = report$.offset().left + report$.width();
	if (header$.data('right-border'))
		rightHeaderBorder = header$.data('right-border');
	if (rightHeaderBorder > rightReportBorder) {
		header$.data('right-border', rightHeaderBorder);
		return true;
	}
	return false;
}

jq$(window).resize(function () {
	ToggleReportGrids();
});

jq$(document).ready(function () {
	if (typeof (izenda.report) != 'undefined' && izenda.report.postRenderHandlers != undefined)
		izenda.report.postRenderHandlers.push(function () { ToggleReportGrids(); });
});