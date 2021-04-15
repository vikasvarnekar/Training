#Requires -RunAsAdministrator

function SafeExecution {
	param (
		[Parameter(Mandatory = $true)][String]$Command
	)

	try {
		if ($Command[0] -eq '"') {
			$result = Invoke-Expression "& $Command"
		}
		else {
			$result = Invoke-Expression $Command
		}

		return $result
	}
	catch {
		Write-Host "An error occurred while executing the command: $Command"
		Write-Host $_.Exception.Message
		return $null
	}
}

function CheckDotNetFrameworkAvailability {
	param (
		[Parameter(Mandatory = $true)][String]$VDirectory
	)

	if (Test-Path $VDirectory) {
		return Get-ItemProperty $VDirectory -name Version | Select-Object -expand Version
	}

	return $null
}

function GetXmlValue {
	param (
		[Parameter(Mandatory = $true)][String]$FilePath,
		[Parameter(Mandatory = $true)][String]$XPath,
		[Parameter(Mandatory = $true)][String]$Attribute
	)

	try {
		[xml]$xml = Get-Content $FilePath
		return $xml.SelectNodes($XPath) | Select-Object -ExpandProperty $Attribute
	}
	catch {
		Write-Host "Failed to read '$XPath' from '$FilePath'"
		Write-Host $_.Exception.Message
		return $null
	}
}


$systemInfo = SafeExecution -Command "Get-ComputerInfo | Select-Object -Property WindowsProductName, OsBuildNumber, OsArchitecture, OsLocalDateTime, TimeZone"
$nodeVersion = SafeExecution -Command "node --version"
$gitVersion = SafeExecution -Command "git --version"
$iisModules = SafeExecution -Command "Get-WebManagedModule"
$chocoList = SafeExecution -Command "choco list --localonly"
$dotnetCoreSdks = SafeExecution -Command "dotnet --list-sdks"
$MSBuildsList = SafeExecution -Command '"${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe" -products * -requires Microsoft.Component.MSBuild -find MSBuild\**\Bin\MSBuild.exe'

if ($null -ne $gitVersion) {
	$gitRepositories = SafeExecution -Command "git remote -v"
	$gitLastCommitInfo = SafeExecution -Command "git show -s -1"
	$gitStatusInfo = SafeExecution -Command "git status"
}

$innovatorVersion = GetXmlValue -FilePath "$PSScriptRoot\..\Default.Settings.include" -XPath 'project/property[@name = "Version.Of.Installed.Innovator"]' -Attribute "Value"
$crtVersion = GetXmlValue -FilePath "$PSScriptRoot\..\Default.Settings.include" -XPath 'project/property[@name = "Original.CRT.Version"]' -Attribute "Value"
$adtVersion = GetXmlValue -FilePath "$PSScriptRoot\..\tools\packages.config" -XPath 'packages/package[@id = "Aras.Deployment.Tool"]' -Attribute "Version"

$resultFile = "$PSScriptRoot\..\..\AutomatedProceduresOutput\TemporaryFilesAndLogs\EnvironmentInfo.txt"
$resultFileDirectory = Split-Path -parent $resultFile
if (!(Test-Path $resultFileDirectory)) {
	New-Item -ItemType Directory -Force -Path $resultFileDirectory
}

$environmentInfo = $systemInfo
$environmentInfo | Add-Member "NodeVersion" $nodeVersion
$environmentInfo | Add-Member "GitVersion" $gitVersion
$environmentInfo | Add-Member "MSBuilds" ($MSBuildsList | Out-String)

$crtInfo = New-Object -Type PSCustomObject -Property @{
	"InnovatorVersion" = $innovatorVersion;
	"CrtVersion"       = $crtVersion;
	"AdtVersion"       = $adtVersion;
}

$repositoryInfo = New-Object -Type PSCustomObject -Property @{
	"Remotes"    = $gitRepositories | Out-String;
	"CommitInfo" = $gitLastCommitInfo | Out-String;
	"Modified"   = $gitStatusInfo | Out-String;
}

$dotNetFrameworkList = @()
$ndpDirectory = 'hklm:\SOFTWARE\Microsoft\NET Framework Setup\NDP\'
@("$ndpDirectory\v2.0.50727", "$ndpDirectory\v3.0", "$ndpDirectory\v3.5", "$ndpDirectory\v4\Full") | ForEach-Object {
	$version = CheckDotNetFrameworkAvailability -VDirectory $PSItem
	if ($null -ne $version) {
		$dotNetFrameworkList += $version
	}
}

"Environment Info:$($environmentInfo | Out-String)".TrimEnd() +
"`n`n`nCRT Info:$($crtInfo | Format-List | Out-String)".TrimEnd() +
"`n`n`nIIS Modules:$($iisModules | Format-List | Out-String)".TrimEnd() +
"`n`n`nChoco Packages:`n`n$($chocoList | Format-List | Out-String)".TrimEnd() +
"`n`n`nRepository Info:$($repositoryInfo | Format-List | Out-String)".TrimEnd() +
"`n`n`nList of the latest available .Net Frameworks: $($dotNetFrameworkList -join ', ')".TrimEnd() +
"`n`n`nList of available .Net Core sdks:`n`n$($dotnetCoreSdks | Out-String)".TrimEnd() | Out-File $resultFile

Write-Host "The results of the environment validation are saved to a file: $resultFile"
