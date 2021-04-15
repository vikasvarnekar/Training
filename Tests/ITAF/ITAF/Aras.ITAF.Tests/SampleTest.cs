using NUnit.Framework;

namespace Aras.ITAF.Tests
{
	[TestFixture]
	public class SampleTest : InnovatorServerBaseTest
	{
		private const string PathToTests = "TestCases\\SampleTests";

		[Test]
		public void Test()
		{
			ExecuteTestCase(CombinePaths(PathToTests, "Test"));
		}
	}
}
