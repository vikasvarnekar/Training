using Aras.STAF.Customization.Actions.API;
using Aras.STAF.Customization.Actions.API.Extensions;
using Aras.STAF.Customization.Actions.UI;
using Aras.STAF.Customization.Actions.UI.Extensions;
using Ninject.Modules;

namespace Aras.STAF.Customization.Services.DI
{
	/// <summary>
	/// Container for storing the default bindings related to some specific cases
	/// </summary>
	public class SampleIocConfiguration : NinjectModule
	{
		/// <inheritdoc />
		public override void Load()
		{
			Rebind<SampleUiAction>().To<SampleUiActionExtension>();
			Rebind<SampleApiAction>().To<SampleApiActionExtension>();
		}
	}
}
