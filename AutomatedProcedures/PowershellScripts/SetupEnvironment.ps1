Param(
    [ValidateSet('Build', 'Deploy', 'SeleniumClient', 'Universal')]
    [string]$EnvironmentType = 'Universal',

    [string]$GoogleChromeInstallerChecksum64
)

function InstallChocolateyPackages {
    param(
        [string[]]$Packages
    )

    try {
        choco --version | Out-Null
    }
    catch {
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072

        Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1')
    }

    $Packages | Foreach-Object {
        $command = "choco install $_ -y --no-progress"
        if ($_ -eq "googlechrome" -and $GoogleChromeInstallerChecksum64) {
            $command += " --checksum64 $GoogleChromeInstallerChecksum64"
        }

        Write-Host "`nExecuting '$command'..."

        Invoke-Expression -Command $command
        if (-not @(0, 1641, 3010).Contains($lastexitcode)) {
            throw "Command '$command' failed with '$lastexitcode' exit code."
        }
    }
}


Write-Host "Installing software for the $EnvironmentType agent"

$IsBuildEnvironment = $EnvironmentType -eq 'Build' -or $EnvironmentType -eq 'Universal'
$IsDeployEnvironment = $EnvironmentType -eq 'Deploy' -or $EnvironmentType -eq 'Universal'
$IsSeleniumClientEnvironment = $EnvironmentType -eq 'SeleniumClient' -or $EnvironmentType -eq 'Universal'

if ($IsDeployEnvironment) {
    # Enable .Net and IIS Features
    Enable-WindowsOptionalFeature -Online -FeatureName @(
        "IIS-WebServer",
        "IIS-ASP",
        "IIS-ASPNET",
        "IIS-ASPNET45",
        "IIS-NetFxExtensibility",
        "IIS-ISAPIExtensions",
        "IIS-ISAPIFilter",
        "IIS-WindowsAuthentication"
    ) -All

    InstallChocolateyPackages -Packages @(
        "dotnetfx --version 4.7.2.20180712",
        "dotnetcore-runtime --version 2.1.9",
        "dotnetcore-windowshosting --version 2.1.9",
    "dotnetcore-runtime --version 3.1.4",
    "dotnetcore-windowshosting --version 3.1.4",
        "firefoxesr",
        "googlechrome",
        "vcredist2010 --version 10.0.40219.2"
    )
}

if ($IsBuildEnvironment) {
    InstallChocolateyPackages -Packages @(
        "dotnetfx --version 4.7.2.20180712",
        "firefoxesr",
        "git.install",
        "googlechrome",
        "netfx-4.7.2-devpack",
        "nodejs --version 10.15.1",
        "vcredist2010 --version 10.0.40219.2",
        "visualstudio2019buildtools --version 16.4.5.0",
        "visualstudio2019-workload-databuildtools",
        "visualstudio2019-workload-webbuildtools"
    )

    # Disable IE customization windows during first run to allow client unit tests
    New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Internet Explorer\\Main" -Force
    New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Internet Explorer\\Main" -Name "DisableFirstRunCustomize" -Value 1 -Force

    # Increase a path limit for Git to 4096 characters in order to avoid long path issues
    & 'C:\\Program Files\\Git\\bin\\git.exe' config --global core.longpaths true
}

if ($IsSeleniumClientEnvironment) {
    InstallChocolateyPackages -Packages @(
        "dotnetfx --version 4.7.2.20180712",
        "firefoxesr",
        "googlechrome"
    )
}