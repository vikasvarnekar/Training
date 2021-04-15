rh._.exports({"0":["the eco process"],"1":["\n  ","\n  ","\n    ","\n    ","The ECO process is used as a simplified change management process to add new parts or documents, to change parts or documents, or to mark them for deletion.  Let's take each one of these actions and go through its process step by step. Keep in mind that only the Change Analyst can execute the ECO process, but different users will be responsible for entering data and adding files. To get a good overview of the ECO process, please see ","The ECO",". Here, the steps will be described in more detail.","\n    ","It will help to have the ECO form in front of us to refer to as we go through the required steps.","\n    "," ","\n    ","\n    ","\n      ","From the ","TOC",", select ,","Change Management>","ECOs>Create New ECO",". A blank ECO form appears.","\n      ","\n      ","Fill out the information for the following properties:","Under the ","Attachments ","tab, specify the files that carry required information for this ECO.","\n        ","\n          ","ECO Number"," - read only, server assigned sequence.","\n          ","Status ","- read only, shows the life cycle state of the ECO.","\n          ","Change Category"," – leave as server default, Phase In.","\n          ","Originator ","– default value, the creator of this ECO.","\n          ","Change Analyst"," – default value, person or group assigned to act as ","Change Specialist I"," (CSI) in ECO workflow process.","\n          ","Date Originated"," - default value, the date on which this engineering change notice was saved.","\n          ","Release Date"," – automatic, the date on which this ECO is released.","\n          ","Reason for Change"," – enter the description describing the change purpose of this ECO.","\n          ","Change Description"," – enter the description of the change.","\n        ","\n      ","\n    ","\n    ","\n    ","Now, depending on which action you would like to take - to add a new part or document, to change a part or document, or to delete a part or document - the following steps will be different.","\n    ","\n    ","\n      ","Under the ","Affected Items"," tab do the following:\n        ","\n          ","Click on the ","New Relationship"," ","icon"," to create a new line in the tab.","\n          ","\n          ","Type"," ","- leave blank, automatically populates with new type icon when ECO is saved.","\n          ","\n          ","Action"," ","- select ","Add"," from the drop down box.","\n          ","\n          "," ","Old Number […]"," - for adding a new part, leave this blank."," ","Old Revision"," - for adding a new part, leave this blank.","\n          ","\n          ","Interchangeable"," ","- for adding a new part, leave this blank.","\n          ","\n          ","New Number […]"," - hit F2, find and select the Part or Document that is being added.","\n          ","\n          ","New Revision"," - read"," only field, the revision of the part.","\n          ","\n          ","In Build"," - for adding a new part, leave this blank.","\n          ","\n          ","In Service"," - for adding a new part, leave this blank.","\n        ","\n      ","\n      ","\n      ","Save, Unlock, and Close"," the ECO.","\n    ","\n    ","\n    ","\n      ","Under the ","Affected Items"," tab do the following:\n        ","\n          ","Click on the ","New Relationship"," icon"," to create a new line in the tab.","\n          ","\n          ","Type"," ","- leave blank, automatically populates with new type icon when ECO is saved.","\n          ","\n          ","Action"," ","- select ","Change"," from the drop down box.","\n          ","\n          ","Old Number […]"," - hit F2, find and select the Part or Document that is being changed.","\n          ","\n          ","Old Revision"," - read"," only field, the revision of the part.","\n          ","\n          ","Interchangeable"," ","- a change is defined as interchangeable, if the new part version can be replaced or modified without causing any change in functionality to the surrounding parts. If the interchangeable flag is checked, the same part number will be retained.  Otherwise, a new part number will need to be assigned.","\n          ","\n          ","New Number […]"," – enter new number for part.","\n          ","\n          ","New Revision"," - read only"," field, the revision of the part.","\n          ","\n          ","In Build"," – select ","Rework"," from the drop down box.","\n          ","\n          ","In Service"," - select ","Use Existing"," from the drop down box.","\n        ","\n      ","\n      ","\n      ","Save, Unlock, and Close"," the ECO","\n    ","\n    ","\n    ","\n      ","Under the ","Affected Items"," tab do the following:\n        ","\n          ","Click on the ","New Relationship"," icon ","to create a new line in the tab.","\n          ","\n          ","Type"," ","- leave blank, automatically populates with new type icon when ECO is saved.","\n          ","\n          ","Action"," ","- select ","Delete"," from the drop down box.","\n          ","\n          ","Old Number […]"," - hit F2, find and select the Part or Document that is being changed.","\n          ","\n          ","Old Revision"," - read only"," field, the revision of the part.","\n          ","\n          ","Interchangeable"," ","- leave this blank.","\n          ","\n          ","New Number […]"," - leave this blank.","\n          ","\n          ","In Build"," – select ","Use Existing"," from the drop down box.","\n          ","\n          ","In Service"," ","- select ","Use Existing"," from the drop down box.","\n        ","\n      ","\n      ","\n      ","Save, Unlock, and Close"," the ECO.","\n      ","\n      ","This process does not actually delete the part or document from the BOM of its parent part. Delete serves as a tag, to indicate to the Change Analyst the BOM needs to be modified.","\n      ","\n      ","Once the ECO is saved, the CSI needs to finish the task list and delete it. ","\n    ","\n    ","\n    ","\n      ","From TOC, go to ","My Innovator",", ","My InBasket",", and select this ECO, click the ","Update Activity"," ","icon.","\n      ","\n      ","Perform all tasks for this ECOs Prepare activity and vote to ","Submit",".","\n    ","\n    ","Once the ECO is submitted, each affected item goes to its Assigned Creator for the ","Draft Changes"," activity. The Assigned Creator is a property in a Part and Document item. This individual or group provide the following information: the new part numbers for the parts that are not interchangeable and that are being changed; affected items that may be up the parent tree from the actual part being changed; affected documents of the parent assemblies (such as BOMs), etc. Since each company will have their own rules regarding new part numbers or new revision generation, the Assigned Creator is responsible for entering this information manually. The only automatic update that Innovator performs is if the part is being changed and it is interchangeable, it will be advanced to a new revision. This automatic update will take place once the ECO is released.","\n  ","\n\n","\n  ","\n    "," ","\n    ","©2020 Aras Corporation - All Rights Reserved","\n  ","\n\n"],"2":["Creating an ECO"],"3":["Taking any ECO action","Adding a new Part or Document","Changing an existing Part or Document","Deleting an existing Part or Document","Submitting the ECO"],"id":"88"})