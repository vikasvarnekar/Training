using Aras.TAF.ArasInnovator12.Actions.Chains.CloseChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.EditChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.OpenChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.PinChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.SaveChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.ApplyChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.LockChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.SearchChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.SetChains;
using Aras.TAF.ArasInnovatorBase.Domain;
using Aras.TAF.ArasInnovatorBase.Domain.Locale;
using Aras.TAF.ArasInnovatorBase.Locators.FormPage;
using Aras.TAF.ArasInnovatorBase.Models.UserModel;
using Aras.TAF.ArasInnovatorBase.Questions.Contents;
using Aras.TAF.ArasInnovatorBase.Questions.States;
using Aras.TAF.ArasInnovatorBase.Questions.States.Localization;
using Aras.TAF.Core;
using Aras.TAF.Core.DI;
using Aras.TAF.Core.NUnit.Extensions;
using Ninject;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Select = Aras.TAF.ArasInnovatorBase.Actions.Chains.SelectChains.Select;
using Wait = Aras.TAF.ArasInnovatorBase.Actions.Chains.WaitChains.Wait;

namespace Aras.STAF.Tests.Tests.CoreSmoke
{
	public class S_1_011_EditingForm : SingleTestBase
	{
		private const string FileFolder = @"DataContainer\CoreSmoke\S_1_011";
		private readonly string amlSetupPath = Path.Combine(FileFolder, "S_1_011_Setup.xml");
		private readonly string amlCleanupPath = Path.Combine(FileFolder, "S_1_011_Cleanup.xml");

		private readonly Dictionary<string, string> replacementMap = new Dictionary<string, string>();

		private static string formName;
		private static string tabTitle;
		private static string descriptionPropertyName;
		private static string propertyValue;
		private static string formNamePropertyLabel;

		private static Dictionary<string, string> simpleSearchCriteria;
		private static Dictionary<string, string> propertiesInExpectedOrder;

		protected override TestDataProvider InitTestDataProvider()
		{
			return TestDataProviderFactory.GetDataProvider(Path.Combine(FileFolder, "Resources"), Settings.CultureInfo);
		}

		protected override void InitTestData()
		{
			formName = "Perfect Chair";

			tabTitle = Actor.AsksFor(LocaleState.LabelOf.FormEditorTab(LocaleKeys.Innovator.Form.PropertiesTabTitle));

			descriptionPropertyName = "description";

			propertyValue = TestData.Get("Description");

			formNamePropertyLabel = Actor.AsksFor(LocaleState.LabelOf.GridColumn("Form", "name"));

			simpleSearchCriteria = new Dictionary<string, string>
			{
				[formNamePropertyLabel] = formName
			};
		}

		protected override void RunSetUpAmls()
		{
			propertiesInExpectedOrder = TestData.Get<Dictionary<string, string>>("PropertiesInExpectedOrder");

			foreach (var property in propertiesInExpectedOrder)
			{
				replacementMap.Add(FormattableString.Invariant($"{{{property.Key}}}"), property.Value);
			}

			replacementMap.Add("{LocaleLabel}", TestData.Get("LocaleLabel"));

			SystemActor.AttemptsTo(Apply.Aml.FromParameterizedFile(amlSetupPath, replacementMap));
		}

		protected override void RunTearDownAmls()
		{
			SystemActor.AttemptsTo(Apply.Aml.FromFile(amlCleanupPath));
		}

		[Test]
		[Category(TestCategories.Product.Innovator12)]
		[Category(TestCategories.Product.Innovator12Sp1)]
		[Category(TestCategories.Product.Innovator12Sp2)]
		[Category(TestCategories.Product.Innovator12Sp3)]
		[Category(TestCategories.Product.Innovator12Sp4)]
		[Category(TestCategories.Product.Innovator12Sp5)]
		[Category(TestCategories.Product.Innovator12Sp6)]
		[Category(TestCategories.Product.Innovator12Sp7)]
		[Category(TestCategories.Product.Innovator12Sp8)]
		[Category(TestCategories.Product.Innovator12Sp9)]
		[Category(TestCategories.Product.Innovator12Sp10)]
		[Category(TestCategories.Product.Innovator12Sp11)]
		[Category(TestCategories.Product.Innovator12Sp12)]
		[Description(@"
			S-1-011
			Preconditions:
				a.	Log into Innovator as Admin
				b.	Pin Navigation Panel

			Scenario:
				a.	Select Forms in expanded Administration Tree
				b.	Search Forms by 'Search' icon in secondary menu -> Run search and
					open the Chair item in Forms Search Grid by double-click
				c.	Lock the opened item
				d.	Select the Form Properties tab
					i.	Description(説明): Nice wooden chair.(Nice wooden chair_素敵な木製の椅子)
				e.	The input boxes are set in the following order (Top to bottom)
					i.	Type of Wood (Type of Wood_木材の種類)
					ii.	Chair Number (Chair Number_チェアナンバー)
					iii.	Paint Color (Paint Color_塗装色)
					iv.	Date Created (Date Created_作成日)
					v.	Blueprint (Blueprint_青写真)
				f.	Click the button to Save/Unlock & Close the Form
				g.	Search and open created item in Forms Search Grid
					i.	Confirm that the item with all added data saved successfully 
				h.	Close tabs
		")]
		public void S_1_011_EditingFormTest()
		{
			Ioc.Container.Get<S_1_011_EditingFormTest_I12>().Invoke(Actor);
		}

		internal class S_1_011_EditingFormTest_I12
		{
			internal void Invoke(IActorFacade<IUserInfo> actor)
			{
				Guard.ForNull(actor, nameof(actor));

				//Preconditions:
				actor.AttemptsTo(
					Open.NavigationPanel,
					Pin.NavigationPanel
				);

				//Scenario:
				//a
				actor.AttemptsTo(Open.SearchPanel.OfTocItemWithPath("Administration/Form").BySecondaryMenu);

				//b
				actor.AttemptsTo(
					Search.Simple.InMainGrid.With(simpleSearchCriteria),
					Open.Item.InMainGrid.WithValueInCell(formNamePropertyLabel, formName).ByDoubleClick
				);

				//c
				actor.AttemptsTo(Wait.ForFormsPageLoaded);
				EditItem(actor);

				//d
				actor.AttemptsTo(Select.FormPageTab.WithName(tabTitle));

				var itemPageContainer = actor.AsksFor(PagesContent.CurrentPageContainer);
				var itemForm = FormPageTabElements.TabPropertiesForm(itemPageContainer);
				actor.AttemptsTo(Set.NewValue(propertyValue).ForProperty(descriptionPropertyName).OnForm(itemForm));

				var expectedDescriptionLabel = actor.AsksFor(LocaleState.LabelOf.FieldOnForm("Form", "description"));

				actor.ChecksThat(FormPageState.FieldLabelFromTab(descriptionPropertyName),
					Is.EqualTo(expectedDescriptionLabel));

				//e
				CheckFields(actor);

				//f
				SaveAndCloseItem(actor);

				//g
				actor.AttemptsTo(Open.Item.InMainGrid.WithRowNumber(1).ByContextMenu.ForView);

				//g.i
				actor.AttemptsTo(Select.FormPageTab.WithName(tabTitle));
				actor.ChecksThat(FormPageState.TabInputFieldValue(descriptionPropertyName), Is.EqualTo(propertyValue));
				actor.AttemptsTo(Close.ActiveItemPage.ByCloseButton);

				//h
				actor.AttemptsTo(Close.ActiveItemPage.ByCloseButton);
			}

			private void CheckFields(IActorFacade<IUserInfo> actor)
			{
				actor.ChecksThat(FormPageState.LayoutFieldNames,
					a => Assert.AreEqual(a.Take(propertiesInExpectedOrder.Count),
						propertiesInExpectedOrder.Keys));

				foreach (var field in propertiesInExpectedOrder)
				{
					actor.ChecksThat(FormPageState.FieldLabelFromLayout(field.Key), Is.EqualTo(field.Value));
				}
			}

			protected virtual void EditItem(IActorFacade<IUserInfo> actor)
			{
				actor.AttemptsTo(Lock.OpenedItem.ByButton);
			}

			protected virtual void SaveAndCloseItem(IActorFacade<IUserInfo> actor)
			{
				actor.AttemptsTo(Close.ActiveItemPage.BySaveUnlockAndCloseButton);
			}
		}

		internal class S_1_011_EditingFormTest_I12Sp10 : S_1_011_EditingFormTest_I12
		{
			protected override void EditItem(IActorFacade<IUserInfo> actor)
			{
				actor.AttemptsTo(Edit.OpenedItem.ByButton);
			}

			protected override void SaveAndCloseItem(IActorFacade<IUserInfo> actor)
			{
				actor.AttemptsTo(Save.OpenedItem.ByDoneButton(), Close.ActiveItemPage.ByCloseButton);
			}
		}
	}
}
