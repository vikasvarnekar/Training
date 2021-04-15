using Aras.STAF.Tests.Tests.CoreSmoke;

namespace Aras.STAF.Tests.DI
{
	/// <summary>
	/// Container stores the default bindings related to Innovator 12SP11 version
	/// </summary>
	public class Innovator12Sp11TestsDefaultConfiguration : Innovator12Sp10TestsDefaultConfiguration
	{

		/// <inheritdoc/>
		public override void Load()
		{
			base.Load();
			Rebind<S_1_002_LoginProcedure.S_1_002_LoginProcedureTest_I12>().To<S_1_002_LoginProcedure.S_1_002_LoginProcedureTest_I12Sp11>();
		}
	}
}