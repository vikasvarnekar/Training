using Aras.STAF.Tests.Tests.CoreSmoke;

namespace Aras.STAF.Tests.DI
{
	/// <summary>
	/// Container stores the default bindings related to Innovator 12SP10 version
	/// </summary>
	public class Innovator12Sp10TestsDefaultConfiguration : Innovator12Sp9TestsDefaultConfiguration
	{
		/// <inheritdoc/>
		public override void Load()
		{
			base.Load();
			Rebind<S_1_011_EditingForm.S_1_011_EditingFormTest_I12>().To<S_1_011_EditingForm.S_1_011_EditingFormTest_I12Sp10>();
			Rebind<S_1_009_Workflow.S_1_009_WorkflowTest_I12>().To<S_1_009_Workflow.S_1_009_WorkflowTest_I12Sp10>();
			Rebind<S_1_007_Lifecycle.S_1_007_LifecycleTest_I12>().To<S_1_007_Lifecycle.S_1_007_LifecycleTest_I12Sp10>();
		}
	}
}