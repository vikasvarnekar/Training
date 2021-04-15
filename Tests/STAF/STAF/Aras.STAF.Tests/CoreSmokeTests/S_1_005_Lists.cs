using Aras.TAF.ArasInnovator12.Actions.Chains.CollapseChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.CreateChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.OpenChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.PinChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.SaveChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.ApplyChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.CloseChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.SearchChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.SelectChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.SetChains;
using Aras.TAF.ArasInnovatorBase.Domain;
using Aras.TAF.ArasInnovatorBase.Domain.Locale;
using Aras.TAF.ArasInnovatorBase.Models.RelationshipsPanelModel;
using Aras.TAF.ArasInnovatorBase.Models.UserModel;
using Aras.TAF.ArasInnovatorBase.Questions.Contents;
using Aras.TAF.ArasInnovatorBase.Questions.States;
using Aras.TAF.ArasInnovatorBase.Questions.States.Localization;
using Aras.TAF.Core;
using Aras.TAF.Core.DI;
using Aras.TAF.Core.NUnit.Extensions;
using Aras.TAF.Core.Selenium;
using Ninject;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;

namespace Aras.STAF.Tests.Tests.CoreSmoke
{
	public class S_1_005_Lists : SingleTestBase
	{
		private const string TestDataFolder = @"DataContainer\CoreSmoke\S_1_005";
		private const string PropertyName = "name";
		private const string PropertyDescription = "description";
		private const string SourceItemTypeForColumns = "Value";
		private static string listName, listDescription, tabValueName, columnLabelName, columnValueName, columnSortOrderName, columnInactiveName, columnName;

		protected override TestDataProvider InitTestDataProvider()
		{
			return TestDataProviderFactory.GetDataProvider(Path.Combine(TestDataFolder, "Resources"), Settings.CultureInfo);
		}

		protected override void InitTestData()
		{
			tabValueName = Actor.AsksFor(LocaleState.LabelOf.RelationshipTab("Value"));
			columnLabelName = Actor.AsksFor(LocaleState.LabelOf.GridColumn(SourceItemTypeForColumns, "label"));
			columnValueName = Actor.AsksFor(LocaleState.LabelOf.GridColumn(SourceItemTypeForColumns, "value"));
			columnSortOrderName = Actor.AsksFor(LocaleState.LabelOf.GridColumn(SourceItemTypeForColumns, "sort_order"));
			columnName = Actor.AsksFor(LocaleState.LabelOf.GridColumn("List", "name"));

			listName = TestData.Get("listName");
			listDescription = TestData.Get("listDescription");
		}

		protected override void RunTearDownAmls()
		{
			SystemActor.AttemptsTo(Apply.Aml.WithPermissions(Actor.ActorInfo).
										FromFile(Path.Combine(TestDataFolder, "S_1_005_Cleanup.xml")));
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

		#region Description

		[Description(@"
			S-1-005
			Precondition:
				a.	Log into Innovator as Admin.
				b.	Open and pin Navigation Panel

			1. Create a List:
				a.	Select Lists in expanded Administration Tree
				b.	Click the Create New List

				----------------------------------------
				Skipped for Selenium (with QA approval):
				----------------------------------------
				c.	Enter:
					• Name: Type of Wood (Type of Wood_木材の種類)
					• Description: Wood used in construction (Wood used in construction_建築用木材)
				d.	Select the Value tab and click on   button 3 times
				e.	Enter the following
					• Label: Oak (Oak_オーク), Value: Oak (Oak_オーク)
					• Label: Birch (Birch_樺), Value: Birch (Birch_樺)
					• Label: Maple (Maple_紅葉), Value: Maple (Maple_紅葉)
				f.	Save
					i.	Confirm Sort order set automatically in Value Tab
				g.	Click 'Done' and close tab
				h.	Click the Create New List
				----------------------------------------

				i.	Enter:
					• Name: Paint Color (Paint Color_塗装色)
					• Description: Paint color for chairs (Paint color for chairs_椅子の塗装色).
				j.	Select the Value tab and click on '+' button 3 times.
				k.	Enter the following
					• Label: Red (Red_あか), Value: #EF0808
					• Label: Blue (Blue_あお), Value: #1908EF
					• Label: Green (Green_みどり), Value: #1A8804
				l.	Save
					i. Confirm Sort order set automatically in Value Tab
					ii.  Click 'Done' and close tab
				m.	Search and open Paint Color (Paint Color_塗装色) in Lists Search Grid
					i.	Confirm that the item with all added data saved successfully
				n.	Close tabs and return to primary Menu TOC
		")]

		#endregion

		public void S_1_005_ListsTest()
		{
			Ioc.Container.Get<S_1_005_Lists_I12>().Invoke(Actor, TestData);
		}

		internal class S_1_005_Lists_I12
		{
			protected List<Dictionary<string, string>> GridValues;

			protected virtual void InitGridValues(TestDataProvider testData, IActorFacade<IUserInfo> actor)
			{
				GridValues = new List<Dictionary<string, string>>();

				for (var rowIndex = 0; rowIndex < 3; rowIndex++)
				{
					GridValues.Add(new Dictionary<string, string>
					{
						[columnLabelName] = testData.Get(FormattableString.Invariant($"row{rowIndex + 1}_ColumnLabel")),
						[columnValueName] = testData.Get(FormattableString.Invariant($"row{rowIndex + 1}_ColumnValue")),
						[columnSortOrderName] = testData.Get(FormattableString.Invariant($"row{rowIndex + 1}_ColumnOrder"))
					});
				}
			}

			internal void Invoke(IActorFacade<IUserInfo> actor, TestDataProvider testData)
			{
				InitGridValues(testData, actor);

				//Precondition:
				actor.AttemptsTo(Open.NavigationPanel);
				actor.AttemptsTo(Pin.NavigationPanel);

				//1
				//a, b
				actor.AttemptsTo(Create.Item.OfItemType("Administration/List").BySecondaryMenu());

				//i
				var form = actor.AsksFor(ItemPageContent.Form);

				actor.AttemptsTo(
					Set.NewValue(listName).ForProperty(PropertyName).OnForm(form),
					Set.NewValue(listDescription).ForProperty(PropertyDescription).OnForm(form)
				);

				//j
				var relationshipsPanel = actor.AsksFor(ItemPageContent.RelationshipsPanel);

				actor.AttemptsTo(Select.RelationshipTab.WithName(tabValueName).
										InRelationshipsPanel(relationshipsPanel));

				var relationship = actor.AsksFor(ItemPageContent.CurrentRelationship);

				for (var i = 0; i < GridValues.Count; i++)
				{
					actor.AttemptsTo(Create.Relationship.InRelationshipsPanel(relationshipsPanel).ViaAddRow());
				}

				//k
				for (var i = 0; i < GridValues.Count; i++)
				{
					SetGridRowValues(i, actor, relationship, relationshipsPanel);
				}

				//l
				actor.AttemptsTo(Save.OpenedItem.BySaveButton);

				for (var i = 0; i < GridValues.Count; i++)
				{
					actor.ChecksThat(RelationshipGridState.Unfrozen.CellValue(relationship, i + 1, columnSortOrderName),
						Is.EqualTo(GridValues[i][columnSortOrderName]));
				}

				actor.ChecksThat(RelationshipGridState.GridData(relationship), Is.EquivalentTo(GridValues));

				actor.AttemptsTo(
					Save.OpenedItem.ByDoneButton(),
					Close.ActiveItemPage.ByCloseButton
				);

				//m
				actor.AttemptsTo(
					Open.SearchPanel.OfCurrentItemType.BySelectedSecondaryMenu,
					Search.Simple.InMainGrid.With(new Dictionary<string, string> { [columnName] = listName }),
					Open.Item.InMainGrid.WithRowNumber(1).ByDoubleClick
				);

				actor.ChecksThat(ItemPageState.FieldValue(PropertyName), Is.EqualTo(listName));
				actor.ChecksThat(ItemPageState.FieldValue(PropertyDescription), Is.EqualTo(listDescription));
				actor.ChecksThat(RelationshipGridState.GridData(relationship), Is.EquivalentTo(GridValues));

				//n
				actor.AttemptsTo(
					Close.ActiveItemPage.ByCloseButton,
					Collapse.SecondaryMenu
				);
			}

			protected virtual void SetGridRowValues(int rowIndex, IActorFacade<IUserInfo> actor, ITarget relationship,
				RelationshipsPanel relationshipsPanel)
			{
				actor.AttemptsTo(Select.Item.InRelationshipGrid(relationship).WithRowNumber(rowIndex + 1));

				actor.AttemptsTo(Set.NewValue(GridValues[rowIndex][columnLabelName]).
					ForStringPropertyInCell(rowIndex + 1, columnLabelName).
					OfRelationshipGrid(relationshipsPanel));

				actor.AttemptsTo(Set.NewValue(GridValues[rowIndex][columnValueName]).
					ForStringPropertyInCell(rowIndex + 1, columnValueName).
					OfRelationshipGrid(relationshipsPanel));
			}
		}

		internal class S_1_005_Lists_I12Sp8 : S_1_005_Lists_I12
		{
			protected override void InitGridValues(TestDataProvider testData, IActorFacade<IUserInfo> actor)
			{
				base.InitGridValues(testData, actor);

				columnInactiveName = actor.AsksFor(LocaleState.LabelOf.GridColumn(SourceItemTypeForColumns, "inactive"));

				for (var rowIndex = 0; rowIndex < 3; rowIndex++)
				{
					GridValues[rowIndex].Add(columnInactiveName, testData.Get(FormattableString.Invariant($"row{rowIndex + 1}_ColumnInactive")));
				}
			}

			protected override void SetGridRowValues(int rowIndex, IActorFacade<IUserInfo> actor, ITarget relationship,
				RelationshipsPanel relationshipsPanel)
			{
				base.SetGridRowValues(rowIndex, actor, relationship, relationshipsPanel);

				actor.AttemptsTo(
					Set.NewValue(bool.Parse(GridValues[rowIndex][columnInactiveName])).
						ForCheckboxInCell(rowIndex + 1, columnInactiveName).
						OfRelationshipGrid(relationshipsPanel));
			}
		}
	}
}
