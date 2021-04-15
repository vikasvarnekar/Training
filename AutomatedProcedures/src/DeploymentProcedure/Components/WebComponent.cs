﻿using DeploymentProcedure.Components.Base;
using DeploymentProcedure.Components.Type;
using DeploymentProcedure.Logging;
using DeploymentProcedure.Packages.Base;
using DeploymentProcedure.Utility;
using DeploymentProcedure.Utility.FileSystem.Base;
using DeploymentProcedure.Utility.WebAdministration;
using DeploymentProcedure.Utility.WebAdministration.Base;
using System;
using Microsoft.Web.Administration;
using System.Globalization;
using System;
using System.IO;
using System.Xml.Serialization;

namespace DeploymentProcedure.Components
{
	[XmlType("web")]
	public class WebComponent : CodeTreeComponent
	{
		private string _url;

		protected IWebAdministration WebAdministration { get; } = new WebAdministrationWrapper();

		public string VirtualDirectoryPath { get; set; }
		public string ApplicationPoolName { get; set; }
		public string ManagedRuntimeVersion { get; set; } = "v4.0";
		public string ManagedPipelineMode { get; set; } = "Integrated";
		public string SiteName { get; set; } = "Default web Site";
		public string Protocol { get; set; } = "http";
		public string ApplicationPoolUser { get; set; }
		public SecretString ApplicationPoolUserPassword { get; set; }
		public string Url
		{
			get { return _url ?? string.Format(CultureInfo.InvariantCulture, "{0}://{1}{2}", Protocol, ServerName, VirtualDirectoryPath); }
			set { _url = value; }
		}

		#region Implementing Setup logic
		public override void Setup()
		{
			base.Setup();

			WebAdministration.SetupApplicationPool(ServerName, ApplicationPoolName, ManagedRuntimeVersion, ManagedPipelineMode, ApplicationPoolUser, ApplicationPoolUserPassword);
			WebAdministration.SetupApplication(ServerName, SiteName, VirtualDirectoryPath, ApplicationPoolName, InstallationPath);
		}
		protected void ConfigureInnovatorIISWebApplication(string locationPath)
		{
			using (ServerManager serverManager = ServerManager.OpenRemote(ServerName))
			{
				Configuration config = serverManager.GetApplicationHostConfiguration();

				ConfigurationSection aspSection = config.GetSection("system.webServer/asp", locationPath);
				aspSection.ChildElements["session"]["timeout"] = TimeSpan.FromMinutes(20); // "00:20:00"
				aspSection.ChildElements["limits"]["scriptTimeout"] = TimeSpan.FromSeconds(90); // "00:01:30"

				ConfigurationSection anonymousAuthenticationSection = config.GetSection("system.webServer/security/authentication/anonymousAuthentication", locationPath);
				anonymousAuthenticationSection["enabled"] = true;

				ConfigurationSection basicAuthenticationSection = config.GetSection("system.webServer/security/authentication/basicAuthentication", locationPath);
				basicAuthenticationSection["enabled"] = false;

				ConfigurationSection windowsAuthenticationSection = config.GetSection("system.webServer/security/authentication/windowsAuthentication", locationPath);
				windowsAuthenticationSection["enabled"] = false;

				ConfigurationSection httpLoggingSection = config.GetSection("system.webServer/httpLogging", locationPath);
				httpLoggingSection["dontLog"] = false;

				serverManager.CommitChanges();
			}
		}

		#endregion

		#region Implementing Cleanup logic
		public override void Remove()
		{
			Logger.Instance.Log(LogLevel.Info, "\nRemoving component ({0}):\n", Id);

			WebAdministration.RemoveApplicationPoolWithApplications(ServerName, ApplicationPoolName);
			WebAdministration.RemoveWinAuth(ServerName, VirtualDirectoryPath);

			base.Remove();
		}
		#endregion

		#region Implementing ApplyPackage
		public override void ApplyPackage(Package package)
		{
			if (package == null)
			{
				throw new ArgumentNullException(nameof(package));
			}

			string pathToAppOfflineHtm = BaseFileSystem.CombinePaths(InstallationPath, "app_offline.htm");
			if (string.IsNullOrEmpty(ManagedRuntimeVersion))
			{
				using (FileStream appOfflineHtm = TargetFileSystem.OpenFile(pathToAppOfflineHtm))
				{
					StreamWriter appOfflineHtmWriter = new StreamWriter(appOfflineHtm);
					appOfflineHtmWriter.WriteLine("This is temporary app_offline.htm generated by a deployment script to stop web application.");
					appOfflineHtmWriter.WriteLine("If you see this - please remove the file");
				}
			}

			package.ApplyToWebComponent(this);

			if (string.IsNullOrEmpty(ManagedRuntimeVersion) && TargetFileSystem.FileExists(pathToAppOfflineHtm))
			{
				TargetFileSystem.DeleteFile(pathToAppOfflineHtm);
			}
		}

		public override void HealthCheck()
		{
			ValidationHelper.CheckHostAvailability(ServerName);
			ValidationHelper.CheckWebApplicationAvailability(this);
		}
		#endregion
	}
}
