@echo off

echo *******************************************************************
echo You are going to install the software required for the build agent
echo *******************************************************************

SET PathToThisBatFileFolder=%~dp0
CALL "%PathToThisBatFileFolder%BatchUtilityScripts\CheckAdminPrivileges.bat
IF errorlevel 1 GOTO END

SET WorkingDirectory=%CD%
CD /D "%PathToThisBatFileFolder%"

powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; & %PathToThisBatFileFolder%PowershellScripts\SetupEnvironment.ps1 -EnvironmentType 'Universal'"

:END
if not errorlevel 1 (
	powershell write-host -foregroundcolor green "SUCCESS!!!"
) else (
	powershell write-host -foregroundcolor red "FAILURE!!!"
)

CD /D "%WorkingDirectory%"
pause
