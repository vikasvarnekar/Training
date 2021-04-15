using Aras.TAF.ArasInnovator12.Actions.Chains.CloseChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.CollapseChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.CreateChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.OpenChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.PinChains;
using Aras.TAF.ArasInnovator12.Actions.Chains.SaveChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.AddChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.ApplyChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.FillChains;
using Aras.TAF.ArasInnovatorBase.Actions.Chains.SearchChains;
using Aras.TAF.ArasInnovatorBase.Domain;
using Aras.TAF.ArasInnovatorBase.Domain.Locale;
using Aras.TAF.ArasInnovatorBase.Models.MapModel.Workflow;
using Aras.TAF.ArasInnovatorBase.Models.UserModel;
using Aras.TAF.ArasInnovatorBase.Questions.Contents;
using Aras.TAF.ArasInnovatorBase.Questions.States;
using Aras.TAF.ArasInnovatorBase.Questions.States.Localization;
using Aras.TAF.Core;
using Aras.TAF.Core.DI;
using Aras.TAF.Core.NUnit.Extensions;
using Aras.TAF.Core.Selenium;
using Aras.TAF.Core.Selenium.Actions;
using Aras.TAF.Core.Selenium.Questions;
using Ninject;
using NUnit.Framework;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Move = Aras.TAF.ArasInnovatorBase.Actions.Chains.MoveChains.Move;
using Select = Aras.TAF.ArasInnovatorBase.Actions.Chains.SelectChains.Select;

namespace Aras.STAF.Tests.Tests.CoreSmoke
{
	[TestFixture]
	public class S_1_009_Workflow : SingleTestBase
	{
		#region testData

		private const string FileFolder = @"DataContainer\CoreSmoke\S_1_009";

		private readonly string amlCleanupPath = Path.Combine(FileFolder, "S_1_009_Cleanup.xml");

		private static WorkflowMap workflowMap;

		private WorkflowActivity startActivity;
		private static WorkflowActivity endActivity;
		private static WorkflowActivity planningActivity;
		private static WorkflowActivity confirmingActivity;

		private static WorkflowPath defaultPath;
		private static WorkflowPath intermediatePath;
		private WorkflowPath goPath;
		private static WorkflowPath confirmPath;
		private static WorkflowPath finishPath;

		private static string identityNameLabel;
		private static string votingWeightLabel;
		private string itemName;

		private static Dictionary<string, string> assignmentCriteria;
		private static Dictionary<string, string> workflowSearchCriteria;

		protected override TestDataProvider InitTestDataProvider()
		{
			return TestDataProviderFactory.GetDataProvider(Path.Combine(FileFolder, "Resources"),
				Settings.CultureInfo);
		}

		protected override void InitTestData()
		{
			itemName = TestData.Get("MapName");

			startActivity = new WorkflowActivity(TestData.Get("startActivityName"), 20, 20);
			endActivity = new WorkflowActivity(TestData.Get("endActivityName"), 200, 20);

			planningActivity = new WorkflowActivity(TestData.Get("planningActivityName"), 200, 20)
			{
				EscalateTo = "Innovator Admin",
				Label = TestData.Get("planningActivityLabel"),
				Icon = "AddSearchCriteria.svg"
			};

			confirmingActivity = new WorkflowActivity(TestData.Get("confirmingActivityName"), 400, 20)
			{
				EscalateTo = "Innovator Admin",
				Icon = "AddMilestone.svg"
			};

			defaultPath = new WorkflowPath(startActivity, endActivity);

			intermediatePath = new WorkflowPath(planningActivity, endActivity);

			goPath = new WorkflowPath(startActivity, planningActivity)
			{
				Name = TestData.Get("goPathName")
			};

			confirmPath = new WorkflowPath(planningActivity, confirmingActivity)
			{
				Name = TestData.Get("confirmPathName"),
				Label = TestData.Get("confirmPathLabel")
			};

			finishPath = new WorkflowPath(confirmingActivity, endActivity)
			{
				Name = TestData.Get("finishPathName")
			};

			workflowMap = new WorkflowMap(itemName)
			{
				Label = TestData.Get("MapLabel"),
				ProcessOwner = "Innovator Admin",
				Description = TestData.Get("MapDescription"),
				Activities = new List<WorkflowActivity>
					{startActivity, planningActivity, confirmingActivity, endActivity},
				Paths = new List<WorkflowPath> { goPath, confirmPath, finishPath }
			};

			identityNameLabel = Actor.AsksFor(LocaleState.LabelOf.GridColumn("Identity", "name"));

			votingWeightLabel =
				Actor.AsksFor(LocaleState.LabelOf.GridColumn("Activity Template Assignment", "voting_weight"));

			assignmentCriteria = new Dictionary<string, string>
			{
				[identityNameLabel] = Actor.ActorInfo.LoginName
			};

			var mapNameLabel = Actor.AsksFor(LocaleState.LabelOf.GridColumn("Workflow Map", "name"));

			workflowSearchCriteria = new Dictionary<string, string>
			{
				[mapNameLabel] = workflowMap.Name
			};
		}

		protected override void RunTearDownAmls()
		{
			SystemActor.AttemptsTo(Apply.Aml.FromFile(amlCleanupPath));
		}

		#endregion

		#region testDescription

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
		[Description(@"4.9	Workflow
				Test #	S-1-009
				Purpose:	to create a simple workflow
				Precondition:
					1.	Log into Innovator as Admin
					2.	Open and pin Navigation Panel
				Scenario:
					Create Workflow
						a.	Select Workflow Maps in expanded Administration Tree
						b.	Click the Create New Workflow Map
						c.	Enter:
							•	Name: Chair Workflow
							•	English Label: Chair Workflow Label
							•	Description: The workflow for creating a chair.
							•	Process Owner: Jane Woods (or any other existing user in DB)

						d.	Select the Path between Start > End
							i.	Confirm path has got highlighting in red color
						e.	Right click and choose Insert Activity
						f.	Insert two Activities between Start and End Activity
						g.	Select the 1st added activity
							•	Name: Planning
							•	English Label: Planning Activity Label
							•	Escalate To: -> Joe Carpenter (or any other existing user in DB)
							•	Select an Image: -> Select Innovator tab, Images, double-click any image icon
							•	In the Assignments tab click on 'Select Item' button
							•	Search, select and return item Joe Carpenter (or any other existing user in DB)
								i.	Make sure the voting weight is set to 100%

						h.	Select the 2nd added activity
							•	Name: Confirming
							•	Escalate To: -> Jane Woods (or any other existing user in DB)
							•	Select an Image: -> Select Innovator tab, Images, return selected any image icon

						i.	Select the path between Planning and Confirming
							•	Name: Confirm
							•	English Label: Confirm Path Label

						j.	Select the path between Confirming and End
							•	Name: Finish

						k.	Click the save/unlock and close the workflow
						l.	Search and open created item in Workflow Maps Search Grid 
							i.	Confirm that the item with all added data saved successfully
						m.	Close tabs and return to primary Menu TOC"
		)]

		#endregion

		public void S_1_009_WorkflowTest()
		{
			Ioc.Container.Get<S_1_009_WorkflowTest_I12>().Invoke(Actor);
		}

		internal class S_1_009_WorkflowTest_I12
		{
			public void Invoke(IActorFacade<IUserInfo> actor)
			{
				//Precondition:
				actor.AttemptsTo(
					Open.NavigationPanel,
					Pin.NavigationPanel
				);

				//Scenario:
				//a - b
				actor.AttemptsTo(Create.Item.OfItemType("Administration/Workflow Map").BySecondaryMenu());

				//c
				actor.AttemptsTo(Fill.WorkflowMapProperties.With(workflowMap));

				actor.AttemptsTo(Move.WorkflowActivity(endActivity).Into(600, 20));

				//d - h
				var selectedPath = actor.AttemptsTo(Select.WorkflowPath(defaultPath));
				var selectedPathLine = actor.AsksFor(Children.Of(selectedPath).Located(By.XPath("./*"))).First();
				actor.ChecksThat(HtmlAttribute.Of(selectedPathLine).Named("stroke"), Is.EqualTo("rgb(255, 0, 0)"));

				actor.AttemptsTo(Add.WorkflowActivity(planningActivity).IntoWorkflowPath(defaultPath)
					.AndFillProperties);
				var relationshipsPanel = actor.AsksFor(WorkflowPageContent.RelationshipsPanel);
				actor.AttemptsTo(Create.Relationship.InRelationshipsPanel(relationshipsPanel)
					.ViaSelectItems(assignmentCriteria).ByDoubleClick);
				CheckRelationship(actor);

				actor.AttemptsTo(Add.WorkflowActivity(confirmingActivity).IntoWorkflowPath(intermediatePath)
					.AndFillProperties);

				//i - j
				actor.AttemptsTo(Select.WorkflowPath(confirmPath));
				actor.AttemptsTo(Fill.WorkflowPathProperties.With(confirmPath));

				actor.AttemptsTo(Select.WorkflowPath(finishPath));
				actor.AttemptsTo(Fill.WorkflowPathProperties.With(finishPath));

				CheckLabels(actor, true);

				//k
				SaveUnlockAndCloseItem(actor);

				//l
				actor.AttemptsTo(
					Open.SearchPanel.OfCurrentItemType.BySelectedSecondaryMenu,
					Search.Simple.InMainGrid.With(workflowSearchCriteria),
					Open.Item.InMainGrid.WithRowNumber(1).ByContextMenu.ForView
				);

				//l.i
				var savedData = actor.AsksFor(WorkflowPageState.SavedData);
				actor.ChecksThat(savedData.Label, Is.EqualTo(workflowMap.Label), "Label is equal to expected");
				actor.ChecksThat(savedData.Description, Is.EqualTo(workflowMap.Description),
					"Description is equal to expected");
				actor.ChecksThat(savedData.Name, Is.EqualTo(workflowMap.Name), "Name is equal to expected");
				actor.ChecksThat(savedData.ProcessOwner, Is.EqualTo(workflowMap.ProcessOwner),
					"Process Owner is equal to expected");

				actor.ChecksThat(savedData.Activities, Is.EqualTo(workflowMap.Activities),
					"Activities are equal to expected");
				actor.ChecksThat(savedData.Paths, Is.EqualTo(workflowMap.Paths), "Paths are equal to expected");

				CheckLabels(actor, false);

				actor.AttemptsTo(Select.WorkflowActivity(planningActivity));
				CheckRelationship(actor);

				//m
				actor.AttemptsTo(
					Close.ActiveItemPage.ByCloseButton,
					Collapse.SecondaryMenu
				);
			}

			private void CheckLabels(IActorFacade<IUserInfo> actor, bool isItemLocked)
			{
				var selectedActivity = actor.AttemptsTo(Select.WorkflowActivity(planningActivity));
				var expectedLabel = isItemLocked ? planningActivity.Name : planningActivity.Label;
				CheckLabelOfElement(actor, selectedActivity, expectedLabel);

				var selectedPath = actor.AttemptsTo(Select.WorkflowPath(confirmPath));
				expectedLabel = isItemLocked ? confirmPath.Name : confirmPath.Label;
				CheckLabelOfElement(actor, selectedPath, expectedLabel);
			}

			private void CheckLabelOfElement(IActorFacade<IUserInfo> actor, ITarget element, string expectedLabel)
			{
				var labelContainer = actor.AsksFor(Children.Of(element).Located(By.TagName("text"))).First();
				actor.ChecksThat(TextContent.Of(labelContainer), Is.EqualTo(expectedLabel));
			}

			private void CheckRelationship(IActorFacade<IUserInfo> actor)
			{
				var relationshipsPanel = actor.AsksFor(WorkflowPageContent.RelationshipsPanel);
				var relationship = actor.AsksFor(RelationshipsPanelContent.CurrentRelationship(relationshipsPanel));

				actor.AttemptsTo(Wait
					.UntilQuestionIsAnswered(RelationshipGridState.RowsCount(relationship), x => x != 0)
					.WithTimeout(TimeSpan.FromMinutes(2)).WithSleepInterval(TimeSpan.FromMilliseconds(500)));

				actor.ChecksThat(RelationshipGridState.Unfrozen.CellValue(relationship, 1, identityNameLabel),
					Is.EqualTo(assignmentCriteria[identityNameLabel]));
				actor.ChecksThat(RelationshipGridState.Unfrozen.CellValue(relationship, 1, votingWeightLabel),
					Is.EqualTo("100"));
			}

			protected virtual void SaveUnlockAndCloseItem(IActorFacade<IUserInfo> actor)
			{
				actor.AttemptsTo(Save.OpenedItem.BySaveUnlockAndCloseButton);
			}
		}

		internal class S_1_009_WorkflowTest_I12Sp10 : S_1_009_WorkflowTest_I12
		{
			protected override void SaveUnlockAndCloseItem(IActorFacade<IUserInfo> actor)
			{
				actor.AttemptsTo(Save.OpenedItem.ByDoneButton(), Close.ActiveItemPage.ByCloseButton);
			}
		}
	}
}