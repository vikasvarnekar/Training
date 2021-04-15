using NUnit.Framework;

namespace Aras.ITAF.Tests.SampleTests
{
	/// <summary>
	/// This class contains sample tests that demonstrate how to write integration tests for Workflows.
	/// </summary>
	[TestFixture]
	[Category("SampleTests")]
	public class Workflow : InnovatorServerBaseTest
	{
		private const string PathToTests = "TestCases\\SampleTests\\Workflow";

		/// <summary>
		/// Basic Workflow Map test.
		/// </summary>
		[Test]
		public void WorkflowMap()
		{
			ExecuteTestCase(CombinePaths(PathToTests, "WorkflowMap"));
		}
	}
}