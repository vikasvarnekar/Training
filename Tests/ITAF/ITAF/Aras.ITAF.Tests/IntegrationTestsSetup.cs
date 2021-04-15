using Aras.Tests.Integration;
using NUnit.Framework;

namespace Aras.ITAF.Tests
{
	[SetUpFixture]
	public class IntegrationTestsSetUp : IntegrationTestsSetup
	{
		[OneTimeTearDown]
		public override void RunAfterAnyTests()
		{
			base.RunAfterAnyTests();
		}

		[OneTimeSetUp]
		public override void RunBeforeAnyTests()
		{
			base.RunBeforeAnyTests();
		}
	}
}