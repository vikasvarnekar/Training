@echo off
cls
echo.
echo [1mScript:[0m ActivateInstanceSync.bat
echo [1mTarget audience:[0m Development team
echo [1mPurpose:[0m Sync any change from Innovator/Client to all Instances
echo.

SET PathToThisBatFileFolder=%~dp0
SET WorkingDirectory=%CD%

CD /D "%PathToThisBatFileFolder%"

for /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD') do set Commit.Pointer=%%i
for /f "delims=" %%i in ('dir Instances /b ^| findstr .*-%Commit.Pointer%') do set Name.Of.Innovator.Instance=%%i

CD AutomatedProcedures\tools\NodeJS\

if "%Name.Of.Innovator.Instance%"=="" (
	echo "Instance for '%Commit.Pointer%' branch doesn't exist. Use SetupInnovatorHere.bat for initial installation. All instances will be updated"
	CALL npm ci
	CALL npm run watch-for-changes
) else (
	CALL npm ci
	CALL npm run watch-for-changes -- %Name.Of.Innovator.Instance%
)


CD /D "%WorkingDirectory%"