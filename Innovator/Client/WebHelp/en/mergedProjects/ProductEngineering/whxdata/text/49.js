rh._.exports({"0":["The ECN Process"],"1":["\n  ","\n  ","\n  ","The Engineering Change Notice (ECN) process is used to add new parts or documents, to change parts or documents, or to mark them for deletion.  Let's take each one of these actions and go through its process step by step. Keep in mind that only the members of the CM group can initiate the ECN process. It will help to have the ECN form in front of us to refer to it, as we go through the required steps.","\n  ","\n  ","\n  ","\n    ","From the Navigation pane, select  ","Change Management",">","ECNs",". The following menu appears:","\n      ","\n    ","\n    ","\n    ","Click ","Create New ECN",". A blank ECN form appears.","\n    ","\n    ","Enter the appropriate information  in the following fields:\n      ","\n        ","ECN Number"," - read only, server assigned sequence","\n        ","\n        ","Title"," - the title of the ECN","\n        ","\n        ","Status"," - read only, shows the life cycle state of the ECN","\n        ","\n        ","Basis"," - check either the Administrative or Physical Hierarchy\n          ","\n            ","Physical hierarchy"," refers to the part itself and any document associated with it. A bug in a software would be classified in the physical hierarchy.","\n            ","\n            ","Administrative hierarchy"," ","refers to anything that is connected with the process of running the business. An error in the expense report procedure would be classified in the administrative hierarchy.","\n            ","\n            ","Priority"," - the priority of this change, the lower the number the higher the priority.","\n            ","\n            ","Assigned Creator"," - the engineer in charge of all technical aspects of this change notice, also referred to as the Owner.","\n            ","\n            ","Effectivity Date"," - the date on which this change notice goes into effect in production.","\n            ","\n            ","Customer Approval Required"," - check if the change requires customer approval.","\n            ","\n            ","Description"," - the description of the change.","\n            ","\n            ","Special Instructions"," - any special instructions that accompany this change.","\n          ","\n        ","\n        ","\n        ","On the ","ECRs"," tab, add any ECRs that are combined or included in this ECN.","\n        ","\n        ","On the ","Files"," tab, specify the files that carry required information for this ECN.","\n      ","\n    ","\n  ","\n  ","\n  ","\n    ","Click the ","Create Item"," icon "," on the Affected Items tab to add an Item.","\n       \n      ","\n    ","\n    ","Enter the following information:\n      ","\n        ","Type"," - select Part or Document from the drop down box.","\n        ","Old Number"," - for adding a new part, leave this blank.","\n        ","Old Revision"," - read only field, the revision of the part.","\n        ","Action"," - since we are adding a new part, select Add.","\n        ","Interchangeable"," - leave it blank.","\n        ","New Number"," - press F2, find and select the Part or Document that is being added.","\n        ","New Revision"," - leave blank.","\n        ","In Build","- leave blank.","\n        ","In Service"," - leave blank.","\n      ","\n    ","\n    ","\n    ","Click "," to save and unclaim"," the ECN.","\n  ","\n  ","\n  ","\n    ","Click the ","Create Item"," icon on the Affected Items tab to add an item.","\n    ","\n    ","Enter the following information:\n      ","\n        ","Action ","- select ","Change ","from the dropdown box.","\n        ","\n        ","Old Number"," - right-click in the cell and click ","Open",". Select the Part or Document that is being changed.","\n        ","\n        ","Old Revision"," - automatically filled in.","\n        ","\n        ","Interchangeable"," - a change is defined as interchangeable, if the new part can be replaced or modified without causing any change in functionality to the surrounding parts. If the interchangeable flag is checked, the same part number will be retained.  Otherwise, a new part number will need to be assigned.","\n        ","\n        ","New Number"," - when the interchangeable flag is set, the superseding number is automatically filled in.  Otherwise, the CSI should enter the new part number.","\n        ","\n        ","New Revision"," - leave blank; the revisions will be entered automatically by Aras Innovator according to the Interchangeability rules.","\n        ","\n        ","In Build"," - select the action to take on the parts that are currently being built; the choices are: Use Existing, Rework, or Scrap","\n        ","\n        ","In Service"," - select the action to take on the parts that are currently in service; the choices are: Use Existing, Rework, or Scrap.","\n      ","\n    ","\n    ","\n    ","Click "," to save and unclaim"," the ECN.","\n  ","\n  "," ","\n  ","An icon appears automatically in the Type column when you save the ECN.","\n  ","\n  ","\n    ","Click the ","Create Item"," icon on the Affected Items tab to add a line to the grid.","\n    ","\n    ","Enter the following information:\n      ","\n        ","Type"," - select Part of Document from the drop down box.","\n        ","\n        ","Old Number"," - right-click in the cell and select ","Open",". and select the Part or Document that is being deleted","\n        ","\n        ","Old Revision ","- filled in automatically with the Affected Number","\n        ","\n        ","Action"," - select ","Delete"," from the drop down box","\n        ","\n        ","Interchangeable"," - leave blank","\n        ","\n        ","New Number"," - leave blank","\n        ","\n        ","New Revision"," - leave blank","\n        ","\n        ","In Build"," - select the action to take on the parts that are currently being built; the choices are: Use Existing, Rework, or Scrap","\n        ","\n        ","In Service"," - select the action to take on the parts that are currently in service; the choices are: Use Existing, Rework, or Scrap","\n      ","\n    ","\n    ","\n    ","Click "," to save and unclaim"," the ECN.","\n  ","\n  ","This process does not actually delete the part or document from the BOM of its parent part. Delete serves as a tag, to indicate to the CSI that the BOM needs to be modified.  ","\n  ","Once the ECN is saved, the creator needs to submit it.","\n  ","\n  ","\n    ","From the Navigation pane, select, ","My"," ","Innovator",">","My In Basket",", and select the Submit ECN activity.","\n    ","Update the activity for this ECN, and vote to ","Submit",".","\n  ","\n  ","Once you submit the ECN, it goes to the CSII for the ","ECN Planning"," activity. During this activity the CSII may provide the following information: the new part numbers for the parts that are not interchangeable and that are being changed; affected items that may be up the parent tree from the actual part being changed; affected documents of the parent assemblies (such as BOMs), etc. Since each company will have their own rules regarding new part numbers or new revision generation, the CSII is responsible for entering this information manually. The only automatic update that Aras Innovator will do, is if the part is being changed, and it is interchangeable, it will be advanced to a new revision. This automatic update will take place once the ECN is released.","\n  ","Once the ECN Planning activity is done, the ECN follows the workflow process laid out in ","The ECN",".","\n\n","\n  ","\n    "," ","\n    ","©2020 Aras Corporation - All Rights Reserved","\n  ","\n\n"],"2":["The ECN Process"],"3":["Taking an ECN action","Adding a new Part or Document","Changing an Existing Part or Document","Deleting an existing Part or Document","Submitting the ECN"],"id":"49"})