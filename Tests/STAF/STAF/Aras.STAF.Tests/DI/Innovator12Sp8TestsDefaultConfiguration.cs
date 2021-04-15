using Aras.STAF.Tests.Tests.CoreSmoke;

namespace Aras.STAF.Tests.DI
{
	/// <summary>
	/// Container stores the default bindings related to Innovator 12SP8 version
	/// </summary>
	public class Innovator12Sp8TestsDefaultConfiguration : Innovator12Sp7TestsDefaultConfiguration
	{
		/// <inheritdoc/>
		public override void Load()
		{
			base.Load();

			Rebind<S_1_005_Lists.S_1_005_Lists_I12>().To<S_1_005_Lists.S_1_005_Lists_I12Sp8>();
		}
	}
}