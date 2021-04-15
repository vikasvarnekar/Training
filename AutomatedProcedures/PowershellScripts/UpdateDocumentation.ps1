function RunXsltTransformForFiles {
	param (
		$PathToXsl,
		$XmlFilesToProcess,
		$OutputStream
	)
	for ($i = 0; $i -lt $xmlFilesToProcess.Length; $i++)
	{
		$xmlFileName = [System.IO.Path]::GetFileName($XmlFilesToProcess[$i])

		$xsltArgumentList = New-Object System.Xml.Xsl.XsltArgumentList
		$xsltArgumentList.AddParam("fileName", "", $xmlFileName)
		$xsltArgumentList.AddParam("fileCount", "", $i + 1)

		$xsltTransformer = New-Object System.Xml.Xsl.XslCompiledTransform
		$xsltTransformer.Load($PathToXsl)

		$xsltTransformer.Transform($XmlFilesToProcess[$i], $xsltArgumentList, $OutputStream)
	}
}

$pathToRepository = [System.IO.Path]::Combine($PSScriptRoot, "../../")
$pathToScripts = [System.IO.Path]::Combine($pathToRepository, "AutomatedProcedures")

$pathToDocumentation = [System.IO.Path]::Combine($pathToRepository, "Documentation/NantScriptReference.md")
$documentationOutputStream = [System.IO.File]::Create($pathToDocumentation)

try {
	$pathToXsl = [System.IO.Path]::Combine($pathToRepository, "AutomatedProcedures/xslt/NantScript.xsl")
	$xmlFilesToProcess = [System.IO.Directory]::GetFiles($pathToScripts, "NantScript*.xml")
	RunXsltTransformForFiles $pathToXsl $xmlFilesToProcess $documentationOutputStream

	$pathToXsl = [System.IO.Path]::Combine($pathToRepository, "AutomatedProcedures/xslt/NantScript.Includes.xsl")
	$xmlFilesToProcess = [System.IO.Directory]::GetFiles($pathToScripts, "Includes/*.include")
	RunXsltTransformForFiles $pathToXsl $xmlFilesToProcess $documentationOutputStream
}
finally{
	$documentationOutputStream.Close()
}