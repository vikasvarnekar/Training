using Aras.STAF.Tests.Tests.CoreSmoke;

namespace Aras.STAF.Tests.DI
{
	/// <summary>
	/// Container stores the default bindings related to Innovator 12SP7 version
	/// </summary>
	public class Innovator12Sp7TestsDefaultConfiguration : Innovator12Sp6TestsDefaultConfiguration
	{
		/// <inheritdoc/>
		public override void Load()
		{
			base.Load();

			Rebind<S_1_015_DeletingObjects.S_1_015_DeletingObjects_I12>().
				To<S_1_015_DeletingObjects.S_1_015_DeletingObjects_I12Sp7>();
		}
	}
}