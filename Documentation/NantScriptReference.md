<?xml version="1.0" encoding="utf-8"?>
## NAnt script
The entry point for any automated script in CRT is NAnt script. The script is responsible for CI/CD flow and can be treated as main bus for scripts and tool in the repository. There are several files that logically divide the script:

Nant script source file | Target name | Description
--- | --- | ---
NantScript.BuildHelper.xml | Build.Deployment.Tool | Builds the Aras.Deployment.Tool using code in the repository if Do.Build.Deployment.Tool is set.
- | Build.Custom.Solutions | Builds the specified custom solutions using MSBuild.<?xml version="1.0" encoding="utf-8"?>
NantScript.DeploymentHelper.xml | Import.Language.Pack | Imports language packages stored in the 'Language packs' folder using LanguageTool.exe.
- | SetupFeatureLicenses | Imports set of feature licenses specified in Feature.License.Credential.IDs or Feature.License.Strings.List.
- | Import.Feature.License.String | Imports a feature to Aras Innovator instance using its license_data field.<?xml version="1.0" encoding="utf-8"?>
NantScript.DeploymentPackageHelper.xml | Execute.Nuget.Command.Line.Using.Nuget.Source | Executes NuGet commands using the following sequence: set NuGet source, execute passed target and remove NuGet source afterwards.
- | SetupParameters.For.Nuget | Initializes parameters for NuGet tasks.
- | Get.Nuget.Package.Existense | Retrieves information about stored deployment deployment NuGet package versions in specified Nuget.Publishing.Source and saves it in a boolean property.
- | Prepare.Deployment.Package | Checks that deployment NuGet package exists and creates it otherwise.
- | Check.Nuget.Package.Existense | Fails a build if deployment deployment NuGet package doesn't exist in the specified Nuget.Publishing.Source. Used by external CI tools (like Jenkins) to identify if it is required to build a package.
- | Install.Nuget.Package | Installs deployment NuGet package from specified source.
- | Push.Nuget.Package | Pushes deployment NuGet package to specified storage. During next build with the same package version the package will be obtained from the storage so its preparation will be skipped.
- | Create.Nuget.Package | Prepares deployment NuGet package with script, that runs deploy based on files and AMLs, which were modified since the latest release.
- | CreateZipWithDeploymentPackageContent | Prepares zip archive with files and AMLs, which were modified since the latest release.
- | CreateZipWithDeploymentPackageAndScripts | Prepares zip archive with script, that runs deploy based on files and AMLs, which were modified since the latest release.
- | Unzip.Deployment.Package.Content | Performs unzip on a part of a package containing modified code tree and AMLs.
- | GetGitDiffBetweenCurrentHeadStateAndLastRelease | Prepare files to be put to a delta package. The target searches for files that were modified since the latest release and put them to a special location.<?xml version="1.0" encoding="utf-8"?>
NantScript.InnovatorSetupHelper.xml | Prepare.Innovator.Baseline.For.Setup | Ensures that a baseline can be found by given parameters. Extracts code tree from the baseline. Ensures that the code tree from the baseline has correct structure. Action is required setup Aras Innovator instance.
- | Setup.Innovator.From.Backups | Executes Aras.Deployment.Tool with Instance.Setup.Config to setup Aras Innovator instance.
- | Setup.Innovator.For.Deploy.Task | Does the same thing that the Setup.Innovator.From.Backups does, but with extra parameters initialization so it can be used for automated builds.<?xml version="1.0" encoding="utf-8"?>
NantScript.SettingsHelper.xml | Get.Link.To.LicenseKeyService.Based.On.MAC.Address | Prepares a URL where a license for a current environment can be requested. Used to prepare informative error massage.
- | Evaluate.Innovator.License.String | Initializes Innovator.License.String if it is not specified. This property is formed using type, company name, license key and activation key. The 'Innovator.License.String' necessary for Aras Innovator to be functional.
- | SetupParameters.For.Common.Task | A common initialization target used in every use case.
- | SetupParameters.For.Continuous.Task | Initializes values of properties required for CI.
- | SetupParameters.For.Deploy.Task | Initializes values of properties required for deployment.
- | SetupParameters.For.Developer.Environment | Initializes values of properties required for local setup.
- | Setup.Deploy.Tool.Configs | Prepares default Aras.Deployment.Tool configs (Instance configs): one for setup one for package import.
- | Setup.Instance.Config | Expands properties in an Aras.Deployment.Tool configs (Instance configs) with actual values stored in corresponding NAnt properties.<?xml version="1.0" encoding="utf-8"?>
NantScript.TestsHelper.xml | Setup.IntegrationTests | Prepares configuration for integration tests. The configuration contains information required to establish connection with Aras Innovator instance prepared during CI or local deployment.
- | Run.Pre.Build.Validations | Runs validation tasks that should be called before code compilation.
- | Run.Client.Unit.Tests | Executes unit tests for client JavaScript code.
- | RunUnitTests | Runs unit tests for server-side C# methods.
- | RunIntegrationTests | Runs integration tests against Aras Innovator instance prepared during CI or local deployment.
- | RunTests | Runs all unit and integration tests.
- | RunNUnit | Wraps NUnit execution. Required for C# methods unit tests and for integration tests.<?xml version="1.0" encoding="utf-8"?>
NantScript.Utilities.xml | Create.Log.Package.Zip | Creates archive with log files and test results. The logs are used by Jenkins scripts.
- | Clean.Up | Removes Aras Innovator instance. The target chooses an instance to remove based on parameters initialized in NantScript.SettingsHelper.
- | Remove.Used.Substitutions | Removes substed drives. Substed drives are used throughout NAnt scripts to avoid using long paths.
- | Create.New.Baseline | Prepares backup of Aras Innovator instance. The target chooses an instance to backup based on parameters initialized in NantScript.SettingsHelper.
- | Update.CRT.Version.Git.Tag | Sets a tag corresponding to a CRT release in the CRT itself. DO NOT call the target for CRT based repositories (outside CRT).
- | Extract.Deleted.Delta | Prepares AMLs for Items, which were deleted since the latest release or during last "Number" of commits. During deployment these AMLs will remove mentioned Items from an Aras Innovator intance.<?xml version="1.0" encoding="utf-8"?>
NantScript.ValidationHelper.xml | Validate.Encoding.Of.Code.Tree | Validates that files in code tree have the 'UTF-8 with BOM' encoding.
- | Validate.Encoding.Of.Source.Code | Validates that source code files have the 'UTF-8 with BOM' encoding.
- | Validate.Version.Of.Code.Tree.Aras.Binaries | Checks that all Aras binaries have the same version.
- | Run.Java.Script.Validation | Validates that client JavaScript code from 'Innovator\Client' and 'AML-packages' is following Aras coding standards.
- | Validate.License.Fields | Validates that 'Innovator.License.Key' and 'Innovator.Activation.Key' are defined.
- | Check.CodeTree.Zip | Validates that the Path.To.CodeTree.Zip property is defined and points to an archive with Aras Innovator code tree copied from production-like instance. The archive should have proper structure: all innovator components are in the archive's root.
- | Check.DB.Bak | Validates that the The Path.To.DB.Bak property is defined and points to a database backup of production-like Aras Innovator instance.
- | Validate.Feature.Licenses | Validates that all feature licenses are imported to the Aras Innovator instance and they can be consumed.<?xml version="1.0" encoding="utf-8"?>
NantScript.xml | ContinuousIntegration | Runs Code quality checks and unit tests. Prepares a delta deployment package. Installs a local temporary production-like Aras Innovator instance then applies the package on top of it and run integration tests against resulting instance afterwards. These actions make sure that deployment package passes all validations and ready for a release.
- | Deploy.Package | Applies delta deployment package to the already preset Aras Innovator instance using Aras.Deployment.Tool, executes import of feature licenses. The target purpose is to apply delta package to a production-like Innovator instance.<?xml version="1.0" encoding="utf-8"?>

## Include files:
There are several include files. They help to store utility scripts and scripts taken from outer source. Files automatically included by the main script when it starts. There are following include files:

Nant script include file | Description
--- | ---
CSharpScripts.include | The file contains common C# scripts which used by the main NAnt Script. See file contents for more details.<?xml version="1.0" encoding="utf-8"?>
EnvironmentDiagnostics.include | The file contains NAnt targets which purpose is to get information about environment where the script is running. Particularly it is getting versions of installed software and checks if correct version is installed.<?xml version="1.0" encoding="utf-8"?>
MSBuild.include | The file contains NAnt target which handles MSBuild execution. The target makes sure that all NuGet packages are restored before running compilation, that proper configuration used, and logs are written.<?xml version="1.0" encoding="utf-8"?>
NodeJs.include | The file contains NAnt target that installs npm packages using NodeJS. Additionally, the target verifies that proper version of NodeJS is installed.<?xml version="1.0" encoding="utf-8"?>
Nuget.include | The file contains NAnt target that installs NuGet packages required for NAnt script execution. A complete list of required packages is stored in the NuGet.config inside tools folder: .\AutomatedProcedures\tools\.nuget\NuGet.Config.<?xml version="1.0" encoding="utf-8"?>
ValidateEncoding.include | The file contains C# implementation for encoding validation target. The reason why this C# script is not stored in CSharpScripts.include is the fact that this script relies on NuGet packages that must be installed before script initialization.