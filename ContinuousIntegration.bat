@echo off

echo ContinuousIntegration.bat:
echo Target audience: Build engeneer
echo Purpose: Run analog of ContinuousIntegration build locally

SET PathToThisBatFileFolder=%~dp0
CALL "%PathToThisBatFileFolder%AutomatedProcedures\BatchUtilityScripts\CheckAdminPrivileges.bat 
IF errorlevel 1 GOTO END
CALL "%PathToThisBatFileFolder%AutomatedProcedures\BatchUtilityScripts\GetMachineSpecificIncludes.bat
IF errorlevel 1 GOTO END
CALL "%PathToThisBatFileFolder%AutomatedProcedures\BatchUtilityScripts\SetupExternalTools.bat
IF errorlevel 1 GOTO END

SET WorkingDirectory=%CD%
CD /D "%PathToThisBatFileFolder%"

FOR /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD') DO SET Commit.Pointer=%%i

SET MachineSpecific.Includes.Folder.Path=%MachineSpecificIncludesPath%
SET Is.MachineSpecific.Includes.Mandatory=true
SET NAnt.Build.Output.Path="AutomatedProceduresOutput\TemporaryFilesAndLogs"
SET NAnt.Build.Output.FileName="NAntBuildOutput.txt"

IF NOT EXIST %NAnt.Build.Output.Path% MKDIR %NAnt.Build.Output.Path%

"%PathToNantExe%" ^
	"/f:%PathToThisBatFileFolder%AutomatedProcedures\NantScript.xml" ^
	ContinuousIntegration ^
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