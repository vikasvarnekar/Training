param(
	[Parameter(Position=0, Mandatory=$true)]
	[String]$oauthServerPluginsConfigPath
)

Write-Output "Enable OAuthServer plugins for Windows authentication"

[string]$windowsAuthPluginPattern = '("Aras\.OAuth\.Server\.Plugins\.WindowsAuthentication",\s*"Enabled":\s*)false';
[string]$windowsUserMapperPluginPattern = '("Aras\.OAuth\.Server\.Plugins\.WindowsUserByNameClaimMapper",\s*"Enabled":\s*)false';
[string]$replacement = "`$1true";

Write-Output "Enable WindowsAuthentication plugin:"
& "$PSScriptRoot\RegexReplaceInFile.ps1" $oauthServerPluginsConfigPath $windowsAuthPluginPattern $replacement

Write-Output "Enable WindowsUserByNameClaimMapper plugin:"
& "$PSScriptRoot\RegexReplaceInFile.ps1" $oauthServerPluginsConfigPath $windowsUserMapperPluginPattern $replacement