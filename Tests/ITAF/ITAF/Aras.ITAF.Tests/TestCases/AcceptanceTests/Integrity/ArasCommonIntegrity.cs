using NUnit.Framework;

namespace Aras.ITAF.Tests.AcceptanceTests
{
	/// <summary>
	/// Check library availability and functionality.
	/// </summary>
	[TestFixture]
	[Category("AcceptanceTests")]
	public class ArasCommonIntegrity : InnovatorServerBaseTest
	{
		private const string PathToTests = "TestCases\\AcceptanceTests\\Integrity";

		/// <summary>
		/// Basic Integrity test.
		/// </summary>
		[Test]
		public void ArasCommonIntegrityCheck()
		{
			ExecuteTestCase(CombinePaths(PathToTests, "ArasCommonIntegrity"));
		}
	}
}
