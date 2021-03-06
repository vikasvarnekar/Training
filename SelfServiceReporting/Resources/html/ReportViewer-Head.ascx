<%@ Control AutoEventWireup="true" %>
<%@ Import Namespace="Aras.Izenda.Reporting" %>
<%@ Import Namespace="Izenda.AdHoc" %>

<title>Report viewer</title>

<!-- Styles Resources -->
<link rel="stylesheet" type="text/css" href="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>extres=css.Filters.min.css" />
<link rel="stylesheet" type="text/css" href="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>extres=css.shrinkable-grid.css" />

<!-- Styles Internal -->
<link rel="stylesheet" type="text/css" href="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>css=ModernStyles.jquery-ui" /> 
<link rel="stylesheet" type="text/css" href="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>css=ModalDialogStyle" />
<link rel="stylesheet" type="text/css" href="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>css=jquery-ui-timepicker-addon" />
<link rel="stylesheet" type="text/css" href="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>css=tagit" />

<!-- jQuery Core -->
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=jQuery.jq"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=jQuery.jqui"></script>

<!-- Utils Internal -->
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=ModernScripts.jquery.purl"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=ModernScripts.url-settings"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=Utility"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=AdHocServer"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=NumberFormatter"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=vendor.highcharts.highcharts"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=vendor.highcharts.highcharts-more"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=vendor.highcharts.modules.funnel"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=ReportViewer"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=ServerReportArchive"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=AdHocToolbarNavigation"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=moment"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=HtmlOutputReportResults"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=EditorBaseControl"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=MultilineEditorBaseControl"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=GaugeControl"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=ReportingServices"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=ReportScripting"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=CustomScripts"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=jquery-ui-timepicker-addon"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=datepicker.langpack"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js_nocache=ModernScripts.IzendaLocalization"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>js=tag-it"></script>

<!-- Utils Resources -->
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>extres=js.ReportViewerFilters.js"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>extres=js.FieldProperties.js"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>extres=js.shrinkable-grid.js"></script>
<script type="text/javascript" src="./<%=AdHocSettings.ResourcesProviderUniqueUrlWithDelimiter%>extres=js.ContentRefreshIntervals.js"></script>

<style type="text/css">
  .izenda-toolbar {
    display: none !important;
  }

  table.simpleFilters td.filterColumn {
    background-color: #CCEEFF;
    margin-top: 10px;
    overflow: hidden;
  }

  #dsUlList {
    margin: 5px 0 2px;
  }

  #fieldsCtlTable {
    border-spacing: 0;
    margin-bottom: 1px;
  }

  .Filter div input, select {
    width: 100%;
    margin-left: 0px;
  }

  .Filter div input {
    width: 296px;
    margin-left: 0px;
  }

    .Filter div input[type="checkbox"] {
      margin-left: 5px;
      width: auto;
    }

  .filterValue {
    padding-left: 0px;
  }

  .pivot-selector select {
    padding: 5px;
    min-width: 300px;
    width: auto;
  }

  .pivot-selector div {
    margin: 5px 0px;
  }

  .field-selector-container {
    float: left;
    width: 400px;
    height: 200px;
    overflow-y: scroll;
    border: 1px solid #aaa;
  }

  .f-button {
    margin: 2px;
    display: inline-block;
  }

  .f-button a {
    height: 25px;
    line-height: 25px;
    vertical-align: baseline;
    border: none;
    padding: 7px;
    color: white !important;
    text-decoration: none !important;
    position: relative;
    display: inline-block;
  }

  .f-button .text {
    margin-right: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
  }

  .f-button .blue {
  }

  .f-button .gray {
  }

  .f-button.left {
    float: left;
  }

  .f-button.right {
    float: right;
  }

  .f-button.middle .text {
    display: none;
  }

  .f-button a img {
    margin-right: 12px;
    margin-right: 2px;
    width: 25px;
    height: 25px;
    vertical-align: bottom;
    position: relative;
    top: 1px;
  }

  .f-button a.gray, .f-button a.gray.disabled:hover {
    background-color: #A0A0A0;
  }

  .f-button a.gray:hover {
    background-color: #C0C0C0;
  }

  .f-button a.blue, .f-button a.blue.disabled:hover {
    background-color: #1C4E89;
  }

  .f-button a.blue:hover {
    background-color: #32649e;
  }

  .f-button a.disabled {
    opacity: .5;
    cursor: default;
  }

  .visibility-pivots {
    display: none;
  }

.multi-valued-check-advanced {
    display: inline-block;
    background-color: white;
    line-height: 10px;
    vertical-align: baseline;
    text-align: center;
    border: 1px solid #777;
    height: 11px;
    width: 11px;
    position: relative;
    padding: 0px;
}

.multi-valued-check-advanced label {
    font-family:Courier New, monospace;
    font-size:11px;
    background: none;
    vertical-align: top;
    text-align: center;
    line-height: 11px;
    height: 12px;
    width: 12px;
    cursor: pointer;
    padding-top: 0px;
    border: none;
    left: -1px;
    margin: 0px;
} 
</style>
