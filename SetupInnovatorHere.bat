@echo off

echo *********************************************************************************************************************************************************************
echo You are going to setup new Innovator instance in local IIS using this repository as a code tree. Adjust configuration files to work with this instance.
echo *********************************************************************************************************************************************************************

SET PathToThisBatFileFolder=%~dp0
SET WorkingDirectory=%CD%
CD /D "%PathToThisBatFileFolder%"

CALL "%PathToThisBatFileFolder%AutomatedProcedures\BatchUtilityScripts\CheckAdminPrivileges.bat 
IF errorlevel 1 GOTO END
CALL "%PathToThisBatFileFolder%AutomatedProcedures\BatchUtilityScripts\GetMachineSpecificIncludes.bat 
IF errorlevel 1 GOTO END
CALL "%PathToThisBatFileFolder%AutomatedProcedures\BatchUtilityScripts\SetupExternalTools.bat
IF errorlevel 1 GOTO END

@REM Remove trailing backslash as it is interpreted as invalid character by NAnt
SET PathToThisBatFileFolder=%PathToThisBatFileFolder:~0,-1%

FOR /f "delims= " %%i in ('wmic computersystem get name') DO FOR /f "delims=" %%t in ("%%i") DO SET Local.Machine.Name=%%t
FOR /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD') DO SET Commit.Pointer=%%i

SET MachineSpecific.Includes.Folder.Path=%MachineSpecificIncludesPath%
SET Is.MachineSpecific.Includes.Mandatory=true
SET NAnt.Build.Output.Path="AutomatedProceduresOutput\TemporaryFilesAndLogs"
SET NAnt.Build.Output.FileName="NAntBuildOutput.txt"

IF NOT EXIST %NAnt.Build.Output.Path% MKDIR %NAnt.Build.Output.Path%

"%PathToNantExe%" ^
	"/f:AutomatedProcedures\NantScript.xml" ^
	Validate.Environment ^
	SetupParameters.For.Developer.Environment ^
	Build.Custom.Solutions ^
	Clean.Up ^
	Setup.Innovator.From.Backups ^
	Prepare.Deployment.Package ^
	Deploy.Package ^
	Adapt.Innovator.For.Developer.Environment ^
	-logfile:%NAnt.Build.Output.Path%\\%NAnt.Build.Output.FileName%

:END
if not errorlevel 1 (
	powershell write-host -foregroundcolor green "SUCCESS!!!"
) else (
	powershell write-host -foregroundcolor red "FAILURE!!!"
	if defined NAnt.Build.Output.Path powershell write-host -foregroundcolor red "Logs can be found here: %NAnt.Build.Output.Path%\\%NAnt.Build.Output.FileName%"
)

CD /D "%WorkingDirectory%"
pause