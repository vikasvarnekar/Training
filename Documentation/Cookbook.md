CRT cookbook
============

That document contains different useful information on issues you may encounter while using the CRT.

All issues are documented in a standard shape and are listed in the TOC.

Table of Contents
-----------------
* #### [Known issues](#KnownIssues)
    * #### [Unable to start Agent service](#CouldntSetupAgentService)
    * #### [Couldn't connect vault component 'Vault' with database 'Database'](#CouldntConnectVaultToDatabase)
    * #### [Please use the transformation mechanism to update the config files. Refer to TransformationsOfConfigFiles folder in the root of the repository](#TransformationMechanism)
* #### [Tips & tricks](#TipsAndTricks)
    * #### [Local Aras Innovator setup takes too long](#LocalArasInnovatorSetupTakesTooLong)
    * #### [Setting up HTTPS for the customer](#SettingUpHTTPS)
    * #### [Migration from IntegrationTests to ITAF](#MigrationFromIntegrationTestsToITAF)
    * #### [Apply a patch provided by Aras Support](#ApplySupportPatch) 
    * #### [Dealing with FeatureNotFoundException](#FeatureNotFoundException)

--------------------------------------------------------------------------------------------------------------

<a name="KnownIssues"></a>Known issues
--------------------------------------

List of known issues:

<a name="CouldntSetupAgentService"></a>Unable to start Agent service
-------------------------------------------------------------------------------------------------------------

### Where occurred
During setup of innovator either locally or from CI service (Azure, Jenkins, etc.)

### Error message

```
14:22:40       [exec] Configuring component (Database) to work with component(Agent):
14:22:40       [exec] 
14:22:40       [exec]  Setting the 'XYZ-sit-70' value for @DB attribute for cycle element.
14:22:40       [exec]  Setting the 'admin' value for @User attribute for cycle element.
14:22:40       [exec]  Trying to set 'http://10.17.17.17/XYZ-sit-70/Server/InnovatorServer.aspx' value to 'C:\Consulting\XYZ-sit-70\AgentService\appsettings.json' file by '$.['AgentService'].InnovatorServerUrl' JSON path
14:22:40       [exec]  Waiting 'Stopped' service to reach 'Running' state in '60' seconds...
14:22:41       [exec]  Waiting 'Stopped' service to reach 'Running' state in '58' seconds...
14:22:43       [exec]  Waiting 'Stopped' service to reach 'Running' state in '56' seconds...
14:22:46       [exec]  Waiting 'Stopped' service to reach 'Running' state in '54' seconds...
14:22:47       [exec]  Waiting 'Stopped' service to reach 'Running' state in '52' seconds...
14:22:49       [exec]  Waiting 'Stopped' service to reach 'Running' state in '50' seconds...
14:22:51       [exec]  Waiting 'Stopped' service to reach 'Running' state in '48' seconds...
14:22:53       [exec]  Waiting 'Stopped' service to reach 'Running' state in '46' seconds...
14:22:55       [exec]  Waiting 'Stopped' service to reach 'Running' state in '44' seconds...
14:22:57       [exec]  Waiting 'Stopped' service to reach 'Running' state in '42' seconds...
14:22:59       [exec]  Waiting 'Stopped' service to reach 'Running' state in '40' seconds...
14:23:01       [exec]  Waiting 'Stopped' service to reach 'Running' state in '38' seconds...
14:23:03       [exec]  Waiting 'Stopped' service to reach 'Running' state in '36' seconds...
14:23:05       [exec]  Waiting 'Stopped' service to reach 'Running' state in '34' seconds...
14:23:07       [exec]  Waiting 'Stopped' service to reach 'Running' state in '32' seconds...
14:23:09       [exec]  Waiting 'Stopped' service to reach 'Running' state in '30' seconds...
14:23:11       [exec]  Waiting 'Stopped' service to reach 'Running' state in '28' seconds...
14:23:13       [exec]  Waiting 'Stopped' service to reach 'Running' state in '26' seconds...
14:23:16       [exec]  Waiting 'Stopped' service to reach 'Running' state in '24' seconds...
14:23:17       [exec]  Waiting 'Stopped' service to reach 'Running' state in '22' seconds...
14:23:19       [exec]  Waiting 'Stopped' service to reach 'Running' state in '20' seconds...
14:23:21       [exec]  Waiting 'Stopped' service to reach 'Running' state in '18' seconds...
14:23:24       [exec]  Waiting 'Stopped' service to reach 'Running' state in '16' seconds...
14:23:25       [exec]  Waiting 'Stopped' service to reach 'Running' state in '14' seconds...
14:23:28       [exec]  Waiting 'Stopped' service to reach 'Running' state in '12' seconds...
14:23:29       [exec]  Waiting 'Stopped' service to reach 'Running' state in '10' seconds...
14:23:32       [exec]  Waiting 'Stopped' service to reach 'Running' state in '8' seconds...
14:23:33       [exec]  Waiting 'Stopped' service to reach 'Running' state in '6' seconds...
14:23:36       [exec]  Waiting 'Stopped' service to reach 'Running' state in '4' seconds...
14:23:37       [exec]  Waiting 'Stopped' service to reach 'Running' state in '2' seconds...
14:23:39       [exec] System.ApplicationException: Unable to start service
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Utility.WindowsServiceHelper.StartService(IntPtr service) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Utility\WindowsServiceHelper.cs:line 118
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Utility.WindowsServiceHelper.StartService(String serverName, String serviceName) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Utility\WindowsServiceHelper.cs:line 50
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Installers.WindowsServiceInstaller.StartWindowsService() in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Installers\WindowsServiceInstaller.cs:line 118
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Installers.AgentInstaller.ConnectWithDatabaseInImpersonationContext(DatabaseComponent databaseComponent) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Installers\AgentInstaller.cs:line 41
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Installers.CodeTreeComponentInstaller.<>c__DisplayClass19_0`1.<RunConnectImpersonated>b__0() in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Installers\CodeTreeComponentInstaller.cs:line 113
14:23:39       [exec]    at System.Security.Principal.WindowsIdentity.RunImpersonated(SafeAccessTokenHandle safeAccessTokenHandle, Action action)
14:23:39       [exec]    at Aras.Deployment.Tool.Core.Utility.WindowsImpersonation.RunImpersonated(WindowsCredentials credentials, Action action) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.Core\Utility\WindowsImpersonation.cs:line 45
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Installers.CodeTreeComponentInstaller.RunConnectImpersonated[T](Action`1 action, T component) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Installers\CodeTreeComponentInstaller.cs:line 113
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Installers.AgentInstaller.ConnectWithDatabase(DatabaseComponent databaseComponent) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Installers\AgentInstaller.cs:line 25
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Connectors.DatabaseToAgentConnector.Connect(IReadOnlyCollection`1 instanceComponents) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Connectors\DatabaseToAgentConnector.cs:line 42
14:23:39       [exec]    at Aras.Deployment.Tool.Core.Steps.LinkStep.Execute(IReadOnlyCollection`1 instanceComponents) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.Core\Steps\LinkStep.cs:line 33
14:23:39       [exec]    at Aras.Deployment.Tool.StandardPlugin.Command.DeployCommand.Execute(Instance instance) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.StandardPlugin\Command\DeployCommand.cs:line 72
14:23:39       [exec]    at Aras.Deployment.Tool.Core.Runner.RunCommand(ICommand command) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.Core\Runner.cs:line 96
14:23:39       [exec]    at CommandLine.ParserResultExtensions.WithParsed[T](ParserResult`1 result, Action`1 action)
14:23:39       [exec]    at Aras.Deployment.Tool.Core.Runner.Run(String pluginsDir, IEnumerable`1 commandLineArgs) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool.Core\Runner.cs:line 50
14:23:39       [exec]    at Aras.Deployment.Tool.Program.Main(String[] args) in C:\Builds\workspace\vOps_aras.deployment.tool_master\src\Aras.Deployment.Tool\Program.cs:line 18
14:23:39       [exec]
14:23:39       [exec] FAILED.
14:23:39       [exec]
14:23:39       [exec] Unable to start service. See above stack trace for the details.
14:23:41
14:23:41  BUILD FAILED
14:23:41
14:23:41  External Program Failed: C:\Builds\workspace\deploy-sit2eadb82e\AutomatedProcedures\tools\Aras.Deployment.Tool\Aras.Deployment.Tool.exe (return code was 1)
```

### Error interpretation
Agent service couldn't start. It may be caused by different reasons:

- Software is missing.
  - In Innovator 12.0 SP12 Agent Services component was converted to .net core. In order to setup Agent additional software needs to be installed at machine, where build/deploy happens. The simplest to do this is to run PowerShell script [a relative link](..\AutomatedProcedures\PowershellScripts\SetupEnvironment.ps1)
- The code tree for the Agent service is not complete.
- Port specified in the `appsettings.json` is already in use.

See `AgentService\logs` directory for more details.

<a name="CouldntConnectVaultToDatabase"></a>Couldn't connect vault component 'Vault' with database 'Database'
-------------------------------------------------------------------------------------------------------------

### Where occurred

During Aras Innovator setup (in SetupInnovatorHere.bat, ContinuousIntegration.bat or Jenkins deployment).

### Error message

```
...
[exec]
[exec] FAILED.
[exec]
[exec] Couldn't connect vault component 'Vault' with database 'Database'. <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><SOAP-ENV:Fault xmlns:af="http://www.aras.com/InnovatorFault"><faultcode>SOAP-ENV:Server</faultcode><faultstring><![CDATA[The Database is not available:License Key is invalid.]]></faultstring><detail><af:legacy_detail><![CDATA[The Database is not available:License Key is invalid.]]></af:legacy_detail><af:exception message="The Database is not available:License Key is invalid." type="Aras.Server.Core.InnovatorServerException"><af:innerException message="License Key is invalid." type="Aras.Server.Core.ServerConfigException" /></af:exception></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>. See above stack trace for the details.
```

or

```
...
[exec] FAILED.
[exec]
[exec] Couldn't connect vault component 'Vault' with database 'Database'. <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:i18n="http://www.aras.com/I18N"><SOAP-ENV:Body><SOAP-ENV:Fault>
[exec]  <faultcode>999</faultcode>
[exec]  <faultstring>System.Net.WebException: The remote server returned an error: (404) Not Found.</faultstring>
[exec]  <faultactor>HttpServerConnection</faultactor>
[exec]  <detail>unknown error</detail>
[exec] </SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>. See above stack trace for the details.
```

or

```
...
[exec] FAILED.
[exec]
[exec] Couldn't connect vault component 'Vault' with database 'Database'. <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:i18n="http://www.aras.com/I18N"><SOAP-ENV:Body><SOAP-ENV:Fault>
[exec]  <faultcode>invalid_grant</faultcode>
[exec]  <faultstring>System.AggregateException: Cannot get OAuthServer discovery document.</faultstring>
[exec]  <faultactor>OAuthServer</faultactor>
[exec]  <detail>unknown error</detail>
[exec] </SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>. See above stack trace for the details.
```

### Error interpretation

As you see, you got usual Aras Innovator error in XML format. To get the original error, you need to take the value from the <faultstring>...</faultstring>. In our case it's:
* _The Database is not available:License Key is invalid._ - means that framework license that was used during installation doesn't fit some restrictions. Advise to double check that license in your **_Machine.Specific.include_** file, or in the Jenkins credentials if it was encuntered during Jenkins deployment.
* _System.Net.WebException: The remote server returned an error: (404) Not Found._ - means that Aras Innovator web application was not found. Perhaps, IIS is stopped.
* _System.AggregateException: Cannot get OAuthServer discovery document._ - means that OAuth server doesn't work. OAuth server is ASP.NET Core application and requires .NET Core Runtime & Windows Server Hosting bundle of a particular version to be installed. Also make sure that this "Windows Server Hosting bundle" is recognizable by IIS. Open IIS Manager -> Modules and make sure that "AspNetCoreModule" is in the list.

### Additional comments

Strictly speaking, in this step (connecting Vault to Database) we are trying to login to the Aras Innovator first time. It means that any error you face can evidence that installed Innovator doesn't work. For further troubleshooting we recommend:
* Open IIS manager and find out the name of the installed Innovator. Try to access it via any web browser and log in with default admin credentials (admin - innovator). Probably you will get the same error as the console showed but in graphical UI.
* Check all Aras Innovator prereuqsites. You can take them either from the "CD Image.zip" documentation or from "AutomatedProcedures\PowershellScripts\SetupEnvironment.ps1" script installing them.

--------------------------------------------------------------------------------------------------------------

<a name="TransformationMechanism"></a>Please use the transformation mechanism to update the config files. Refer to TransformationsOfConfigFiles folder in the root of the repository
-------------------------------------------------------------------------------------------------------------

### Where occurred

During Aras Innovator setup (in SetupInnovatorHere.bat, ContinuousIntegration.bat or Jenkins deployment).

### Error message

```
...
BUILD FAILED

Please use the transformation mechanism to update the config files. Refer to TransformationsOfConfigFiles folder in the root of the repository
```

### Error interpretation

This is a validation error showing that configuration files templates have been changed since Last.Commit.Before.Current.Release (a point in the git history. Value specified in the **[Default.Settings.include](..\AutomatedProcedures\Default.Settings.include)**) . Open 'AutomatedProceduresOutput\TemporaryFolderWithFilesToDeploy\TemplatesOfSettingFilesModifications.txt' file to see exactly which configuration files have been changed.

### How to solve this problem?

You need to rollback the changes to the config files at the time of Last.Commit.Before.Current.Release and write transformations for them that will bring the config files into the desired state. More information can be found in the corresponding **[Readme.md](..\TransformationsOfConfigFiles\Readme.md)**.

--------------------------------------------------------------------------------------------------------------

<a name="TipsAndTricks"></a>Tips & tricks
-----------------------------------------

<a name="LocalArasInnovatorSetupTakesTooLong"></a>Local Aras Innovator setup takes too long
-------------------------------------------------------------------------------------------

### Where occurred

During local Aras Innovator setup (in SetupInnovatorHere.bat or ContinuousIntegration.bat).

### Description

Local Aras Innovator setup takes too long.
* &gt; 10 mins for SetupInnovatorHere.bat at the same Git point as the **_Baseline_** (i.e. with empty deployment package).
* &gt; 20 mins for ContinousIntegration.bat at the same Git point as the **_Baseline_** (i.e. with empty deployment package).

For information, a brief description of usual developer hardware is:
* Intel Core i7, 12 logical cores
* 16 RAM
* SSD M.2

### What can be done

The right answer will be to review your hardware and software. Probably, you can request more hardware resources to improve performance. Sometimes your computer has a lot of daemon processes that consume resources, or antivirus that scans all files, etc. With this approach, we can correct the situation as a whole. So try this first.

If it didn't work out, then we can try to perform some pinpoint fixes.
* Don't unzip the entire _CodeTree.zip_ each time we run local setup. It sounds reasonable, because _CodeTree.zip_ is rarely changed and we can unzip it one time and use this extracted code tree for local installation. To achieve this, you need to extend **_Machine.Specific.include_** file with an additional property that will point to the directory containing unzipped code tree. It is worth noting that this path must be local. Look:
```
<project name="Default.Settings">
    ...
    <property name="Path.To.Unzipped.Code.Tree" overwrite="true" value="c:\Baselines\CRT\CleanInnovator12SP8\CodeTree" />
    ...
</project>
```

--------------------------------------------------------------------------------------------------------------

<a name="SettingUpHTTPS"></a>Setting up HTTPS for the customer
-------------------------------------------------------------------------------------------

### Where occurred

At customer SIT, UAT and PROD environments.

### Description

We need to set up the deployment to automatically install Aras Innovator on HTTPS (in the case of SIT deployment), or deploy the changes to the already installed and configured via HTTPS Aras Innovator (SIT, UAT, PROD).
How does it work:
* for SIT we install the Aras Innovator and change all its configs so that it works over HTTPS
* for UAT and PROD we modify only parameters for deployment itself. The Aras Innovator instance must already be installed, and the configs are correct (with HTTPS links).

### What can be done

1. Configure IIS for HTTPS (import certificates etc.). To make sure that it works, just try to access the default IIS web page by **https://localhost** link. It should be accessible via any web browser and shows that the certificate is valid (e. g. an uncrossed lock icon in the Google Chrome browser).
2. After that, you need to change all parameters in Jenkins job that you can find here: "AutomatedProcedures/TemplatesOfInnovatorInstances/InstanceTemplate.customer.*.xml" (wherever there is http in the value) from HTTP to HTTPS.
Usually, these are the following parameters:
    * Agent.Load.Balancer.Url
    * Conversion.Load.Balancer.Url
    * Conversion.Web.Protocol
    * Innovator.Load.Balancer.Url
    * Innovator.Web.Protocol
    * OAuth.Load.Balancer.Url
    * OAuth.Web.Protocol
    * Vault.Load.Balancer.Url
    * Vault.Web.Protocol
3. Double-check.

--------------------------------------------------------------------------------------------------------------

<a name="MigrationFromIntegrationTestsToITAF"></a>Migration from IntegrationTests to ITAF
-----------------------------------------------------------------------------------------

### Where occurred

During update to CRT version 1.9.

### Description

ITAF stands for Integration Test Automation Framework. It's a framework developed by Aras and used for Integration Tests writing. It requires 'Aras.TestAutomationFramework' feature license to work. ITAF doesn't introduce many breaking changes, but has some minor changes:
* A new path to integration tests project (Tests\IntegrationTests -> Tests\ITAF\ITAF\Aras.ITAF.Tests)
* A new default namespace for the tests (IntegrationTests -> Aras.ITAF.Tests)
* A new default test case base (CustomIntegrationTestsBaseClass -> InnovatorServerBaseTest)
* A new XSD schema for XML test cases located directly in the project folder.

### What can be done

We have implemented a PowerShell script that should simplify this migration. Keep in mind that it covers only simple known cases and additional manual adjustment may be necessary.

To execute it, please create a PowerShell file (e.g. 'Migrate.ps1') with the following content in the root of the repository and then run it:
```
param (
	$RepositoryRoot = $PSScriptRoot
)

$PathToIntegrationTests = Join-Path -Path $RepositoryRoot -ChildPath "Tests\IntegrationTests"
$PathToITAF = Join-Path -Path $RepositoryRoot -ChildPath "Tests\ITAF\ITAF\Aras.ITAF.Tests"
$pathToIntegrationTestsTestCases = Join-Path -Path $PathToIntegrationTests -ChildPath "TestCases"
$pathToITAFTestCases = Join-Path -Path $PathToITAF -ChildPath "TestCases"

if (-not (Test-Path $pathToIntegrationTestsTestCases)) {
	Write-Error "No test cases are found by the '$pathToIntegrationTestsTestCases' path"

	exit 1
}

# 1. Copy all test cases to a new location
Write-Host "Copying test cases from '$pathToIntegrationTestsTestCases' to '$PathToITAF'...`n"

Copy-Item -Path $pathToIntegrationTestsTestCases -Destination $PathToITAF -Force -Recurse

# 2. Adjust namespaces for C# test cases
Write-Host "Adjusting namespaces for C# test cases...`n"

Get-ChildItem -Path $pathToITAFTestCases -Filter "*.cs" -Recurse | Foreach-Object {
	$csharpTestCasePath = $_.FullName

	try {
		$csharpTestCaseContent = Get-Content -Path $csharpTestCasePath -Encoding UTF8
		$csharpTestCaseContent = $csharpTestCaseContent -replace "^namespace IntegrationTests", "namespace Aras.ITAF.Tests" `
														-replace "^using IntegrationTests", "using Aras.ITAF.Tests" `
														-replace ": CustomIntegrationTestsBaseClass$", ": InnovatorServerBaseTest"

		Set-Content -Path $csharpTestCasePath -Value $csharpTestCaseContent -Encoding UTF8
	} catch {
		Write-Error "Error during '$csharpTestCasePath' C# test case processing..."

		exit 2
	}
}

# 3. Adjust path to XSD schema for XML test cases
Write-Host "Adjusting path to XSD schema for XML test cases...`n"

Get-ChildItem -Path $pathToITAFTestCases -Filter "*.xml" -Recurse | Foreach-Object {
	$xmlTestCasePath = $_.FullName

	try {
		$xmlTestCaseContent = Get-Content -Path $xmlTestCasePath -Encoding UTF8
		$xmlTestCaseContent = $xmlTestCaseContent -replace "../../../../libraries/Aras.IntegrationTests.Framework/TestCase.xsd", "../../../TestCase.xsd"

		Set-Content -Path $xmlTestCasePath -Value $xmlTestCaseContent -Encoding UTF8
	} catch {
		Write-Error "Error during '$xmlTestCasePath' XML test case processing..."

		exit 3
	}
}
```

--------------------------------------------------------------------------------------------------------------

<a name="ApplySupportPatch"></a>Apply a patch provided by Aras Support
----------------------------------------------------------------------

### Where occurred

At customer PROD environment.

### Description

When you have active development process and already have a production instance running there are cases when you encountered an issue at the production instance and requested help form Aras Support. Some issues may be resolved by some minor change in environment or configuration, but sometimes Aras Support will ask you to apply a patch to your instance to fix the issue. When you **do not have a development process** you will just follow installation guide provided with the patch. When you **have a development process** things are different since you need to go through automated deployment process to apply that patch to your production instance and make sure that development teams also use that patch.

### What can be done

There are 2 general ways to achieve state when both the production instance and development team working with provided support patch depicted below:

![Apply Support Patch Flow](images\ApplySupportPatchFlow.png)

Our recommended approach is to put the support patch to a repository so its automation will take responsibility for apply the patch. That will make sure that the patch applied to all environments and that it is applied in the same way. This approach contains the following steps:
* Unzip the Aras Support patch
* Put code tree and AML parts of the patch to this repository.
    ```
    NOTE: In the following example we create a temporary branch with name support-patch.
    You can use any name instead:
    ```
    * Create a branch support-patch from production and checkout to that branch:
    ```
    git checkout -b support-patch production
    ```
    * Copy patch contents (code tree and AML packages) into git. During this action you need to understand Customer Repository Template structure and how to update Aras Innovator described in corresponding sections of the **[Readme.md](Readme.md)**
    * Create commit into the branch support-patch:
    ```
    git add .
    git commit
    ```
    * Create a pull request and make sure that a build passed on that pull request.
    * Merge pull request and make a deploy from the support-patch branch to a test environments and verify result instance.
    * Merge support-patch into production branch:
    ```
    git checkout production
    git merge support-patch
    ```
    * Delete support-patch as it is no longer required:
    ```
    git branch -D support-patch
    ```
    * Deploy the patch from production branch to production instance.
* Read the installation guide
    * Identify if the guide has non-standard steps. Standard steps for installation guide are
        * Copy Code Tree files to production instance
        * Apply AML packages using import tool
    * All other action except mentioned above should be considered as non-standard. Keep in mind that only standard actions are covered by Automated Procedures when the 'Put code tree and AML parts of the patch to this repository' step is complete. Make sure that additional steps from the installation are performed at production. Ideally those steps should be automated by adding scripts or special transformation files to a deployment package.

As alternative it is possible to apply the patch manually to the production instance and then synchronize result instance with production branch, at th same time you will need to update baseline you are working with. We will not describe steps to follow this approach here since they are too complex for this guide and it depends on package content and its installation guide.

--------------------------------------------------------------------------------------------------------------

<a name="FeatureNotFoundException"></a>Dealing with FeatureNotFoundException
----------------------------------------------------------------------

### Where occurred

At SIT, UAT and PROD environments.

### Description

Deployment fails with the following error:
"System.Web.Services.Protocols.SoapException: Server was unable to process request. ---> Aras.Server.Licensing.FeatureNotFoundException ---> The feature you are attempting to consume does not exist in your feature tree."

Reason why the error occured is that a target deployment environment has outdated FeatureTree.xml. This file is located in: Innovator\Server\Data folder at Innovator Web Application server.

### What can be done

Update the FeatureTree.xml by adding updated file to a repository. To do so please follow these steps:

* Get an up to date version form some SPxx installation. You can do this by installing an Innovator instance using SetupInnovatorHere.bat or using *.msi obtained from Aras. It does not matter how you do that, but keep in mind that there are the following requirements:
    * The instnace should be accessible for you to login.
    * The instance should have access to the Internet.
    * You should have physical access to files of the instance in order to get the file.
* Login to the Innovator instance using any login. That will trigger update process for the FeatureTree.xml.
* As soon as login complete go to the Innovator\Server\data\ folder of the Innovator instance located at Innovator Web Application server.
* From the folder copy the FeatureTree.xml and paste it to the same folder inside your repository.
* Create commit with the updated FeatureTree.xml using the following command or equivalent actions in your favorite git tool:
```
git add Innovator/Server/data/FeatureTree.xml
git commit -m "Put the latest FeatureTree.xml"
```
