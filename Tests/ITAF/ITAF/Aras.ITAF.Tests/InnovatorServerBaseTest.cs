using Aras.Tests.Integration;
using System.Xml;

namespace Aras.ITAF.Tests
{
	public class InnovatorServerBaseTest : InnovatorServerTests
	{
		public static string PathToTestsOutputFolder => ConnectionInfo.TestsOutputDirectory;

		/// <summary>
		/// NOTE: keep in mind that relative path to the 'Setup Test.xml' evaluated based on a type's full name ([namespace].[type_name]; e.g. 'IntegrationTests.SampleTests.SetupTest').
		/// Prerequisites to use the 'Setup Test.xml':
		/// 1) A name of a class, marked with [TestFixture] attribute, should be the same as a name of a folder, that contains 'Setup Test.xml' file
		/// 2) A namespace should reflect relative path from the 'TestsCases' directory to a parent directory from step 1, separated by dots]
		///    Example: IntegrationTests.SampleTests
		///    'IntegrationTests' replaced by 'TestCases', dots replaced by slashes, class name and the 'Setup Test.xml' file name added to end. Result path is:
		///    TestCases\SampleTests\SetupTest\Setup Test.xml
		/// </summary>
		protected internal static readonly string RelativePathToIntegrationTestsDataContainerDirectory = "..\\..\\ITAF\\ITAF\\Aras.ITAF.Tests";

		protected override string RelativePathToIntegrationTestsDirectory => RelativePathToIntegrationTestsDataContainerDirectory;
		protected override string CustomRelativePathToIntegrationTestsTestCasesDirectory => "Aras\\ITAF\\Tests";
		protected override string DefaultRelativePathToIntegrationTestsTestCasesDirectory => "TestCases";

		protected override IBaselineComparer GetBaselineComparer(XmlElement request)
		{
			return new BaselineComparerErrorWrapper(base.GetBaselineComparer(request));
		}
	}
}
