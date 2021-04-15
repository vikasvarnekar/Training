using Aras.TAF.ArasInnovator12.Services.DI;
using Aras.TAF.ArasInnovatorBase.Domain.Enums;
using Aras.TAF.ArasInnovatorBase.Domain.Interfaces;
using Ninject.Modules;
using System.Collections.Generic;
using System.Linq;

namespace Aras.STAF.Tests.DI
{
	/// <summary>
	/// Allows to configure content of global IoC-container (composition root for IoC-container)
	/// </summary>
	public class Innovator12TestsCompositionRoot : CompositionRoot
	{
		protected Dictionary<InnovatorVersion, INinjectModule> InnovatorVersionForTestsModulesMap { get; set; }
		//protected Dictionary<ComponentEngineeringVersion?, INinjectModule> CeReleaseVersionModulesMap { get; set; }
		//protected Dictionary<TechnicalDocumentationVersion?, INinjectModule> TdReleaseVersionModulesMap { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="Innovator12TestsCompositionRoot"/> class
		/// </summary>
		/// <param name="settings">IoC settings</param>
		public Innovator12TestsCompositionRoot(IIocSettings settings) : base(settings)
		{
			InnovatorVersionForTestsModulesMap =
				new Dictionary<InnovatorVersion, INinjectModule>
				{
					[InnovatorVersion.I12] = new Innovator12TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp1] = new Innovator12Sp1TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp2] = new Innovator12Sp2TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp3] = new Innovator12Sp3TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp4] = new Innovator12Sp4TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp5] = new Innovator12Sp5TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp6] = new Innovator12Sp6TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp7] = new Innovator12Sp7TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp8] = new Innovator12Sp8TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp9] = new Innovator12Sp9TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp10] = new Innovator12Sp10TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp11] = new Innovator12Sp11TestsDefaultConfiguration(),
					[InnovatorVersion.I12Sp12] = new Innovator12Sp12TestsDefaultConfiguration()
				};

			//CeReleaseVersionModulesMap =
			//	new Dictionary<ComponentEngineeringVersion?, INinjectModule>
			//	{
			//		[ComponentEngineeringVersion.I12R1] = new CustomCE12R1DefaultConfiguration(),
			//		[ComponentEngineeringVersion.I12R2] = new CustomCE12R2DefaultConfiguration(),
			//		[ComponentEngineeringVersion.I12R3] = new CustomCE12R3DefaultConfiguration()
			//	};

			//TdReleaseVersionModulesMap =
			//	new Dictionary<TechnicalDocumentationVersion?, INinjectModule>
			//	{
			//		[TechnicalDocumentationVersion.I12R1] = new CustomTd12R1DefaultConfiguration()
			//	};
		}

		/// <inheritdoc />
		public override INinjectModule[] GetModules()
		{
			var defaultModules = base.GetModules().ToList();
			defaultModules.Add(InnovatorVersionForTestsModulesMap[Settings.InnovatorVersion]);

			//if (Settings.ApplicationsSettings?.CE != null)
			//{
			//	defaultModules.Add(CeReleaseVersionModulesMap[Settings.ApplicationsSettings.CE]);
			//}

			//if (Settings.ApplicationsSettings?.TechDoc != null)
			//{
			//	defaultModules.Add(TdReleaseVersionModulesMap[Settings.ApplicationsSettings.TechDoc]);
			//}

			return defaultModules.ToArray();
		}
	}
}