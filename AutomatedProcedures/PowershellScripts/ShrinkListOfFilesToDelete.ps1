param(
	[string] $PathToInputFile,
	[string] $PathToOutputFile
)

Set-StrictMode -Version Latest

function CalculateTopmostPathToDelete {
	param(
		[string] $path
	)

	$pathParts = $path -split '/'
	$dirPath = [string]::Empty
	for ($i = 0; $i -lt $pathParts.Length; $i++) {
		if ($i -eq $pathParts.Length - 1) {
			return $path
		}

		$dirPath += $pathParts[$i] + '/'
		if (-not $(git ls-files $dirPath)) {
			return $dirPath
		}
	}
}


$pathsToDelete = @()
foreach ($file in Get-Content $PathToInputFile | Sort-Object { [System.IO.Path]::GetDirectoryName($_) }) {
	$isParentDirToDelete = $pathsToDelete -and $file.StartsWith($pathsToDelete[-1])
	if (-not $isParentDirToDelete) {
		$pathsToDelete += CalculateTopmostPathToDelete($file)
	}
}

$pathsToDelete | Out-File $PathToOutputFile -Encoding utf8
