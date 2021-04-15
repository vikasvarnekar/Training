param(
	[Parameter(Position=0, Mandatory=$true)]
	[String]$filePath,
	[Parameter(Position=1, Mandatory=$true)]
	[String]$pattern,
	[Parameter(Position=2, Mandatory=$true)]
	[String]$replacement
)

Write-Output "Replace all matches of $pattern pattern to $replacement replacement in $filePath"

[string]$fileContent = [System.IO.File]::ReadAllText($filePath);

if([System.Text.RegularExpressions.Regex]::Match($fileContent, $pattern).Success){
	$updatedFileContent = [System.Text.RegularExpressions.Regex]::Replace(
		$fileContent,
		$pattern,
		$replacement,
		[System.Text.RegularExpressions.RegexOptions]::Multiline);
    
	Write-Output "All matches of specified pattern were replaced in file"
	Write-Verbose "Updated file content:`n$updatedFileContent" 
	
	[System.IO.File]::WriteAllText($filePath, $updatedFileContent);
}
else {
	Write-Output "There are no matches of specified pattern in file"
}