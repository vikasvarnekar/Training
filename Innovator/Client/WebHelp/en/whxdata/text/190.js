rh._.exports({"0":["Setting Required for Text"],"1":["\n  ","\n","\n","When dealing with a property of data type Text, changing the value of Required is currently not available from Innovator. This is a known issue which is targeted to be fixed in the next release of Innovator. However, there is a work-around process available that will allow the value of Required to be reset. Below is the process described in detailed steps. There are two starting points for this process. ","The first start"," meets all of these conditions:","\n","An ItemType has a property with a data type Text","The Required attribute of this property has been set to False.","The Required attribute of this property needs to be set to True.","There may be instances of this ItemType already in Innovator.","\n\n\n\n\n\n\n\n\n","The second start"," meets the following conditions:","\n","An ItemType has a property with a data type Text","The Required attribute of this property has been set to True.","The Required attribute of this property needs to be set to False.","There may be instances of this ItemType already in Innovator.","\n\n\n\n\n\n\n\n\n","\n","This is the first starting point described above, where we have an ItemType with a Text property which we want to make Required.","\n","To change Required to True:","\n","Notify users that they must log out of Innovator by certain time when you (the Innovator ","Admin) will be making this change. The change requires a modification to the database, and no one can be logged in at that time. If users ignore the notification, they will be disconnected from the database while it is being modified, and will lose their work.","Determine the Item Type ID and Property Name.","\nIn this step we will find the necessary data about the ItemType and the Property in order to change the Property to “Required”.","Open a text file to temporarily hold required information","Log into Innovator as an administrator.","From TOC select ","ItemTypes",".","Search for the ItemType you wish to modify. In this example, we will use the ItemType ","TextPropertyTest.","Right click on the Item Type and select Properties. You will see a dialog that displays the items ID at the bottom.","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","\n\n"," ","\n","Click on the Copy button on the dialog.","Paste this value into the text file created above.","Open the ItemType and search for the property to be modified. In our case, we will use the property test_property.","\n\n\n\n\n\n\n","\n\n"," ","\n","Copy the name (not the label!) of the property to the text file created above. Your temporary text file should look similar to:","\n\n\n","\n\n"," ","\n","Disable the Database connection","\nIn this step we will disconnect the database, so that no changes could be made to the table while this change is being performed.","\n\n","If any users are still logged into Innovator, they will be disconnected and will lose their work.","\n\n","Open the InnovatorServerConfig.xml file","Find the line for the database you wish to update. It should look similar to:","\n<DB-Connection id=\"SolutionsS71\" database=\"SolutionsS71\" server=\"localhost\" uid=\"innovator\" pwd=\"innovator\" dbType=\"SQL Server\" />","Change the line by adding an x in front of the DB-Connection, like this:","\n<xDB-Connection id=\"SolutionsS71\" database=\"SolutionsS71\" server=\"localhost\" uid=\"innovator\" pwd=\"innovator\" dbType=\"SQL Server\" />  "," Save the file and close","Determine the Table name of the ItemType being updated.","\nUsually the table name would be the name of the ItemType. However, it is not always the case, so it’s safer to go through this step and retrieve the table name through a query.","Open Enterprise Manager","Find the Database for the Innovator to be updated. Please be certain that this is the same database that you disconnected earlier from the InnovatorServerConfig.xml file.","Find the table called ItemType","Highlight the table and select from the main menu: Tools, SQL Query Analyzer","Input the following query:  ","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","SELECT INSTANCE_DATA","\nFROM innovator.ITEMTYPE","\nWHERE ID = 'YOUR ITEM ID'","\n","Where Your Item ID should be replaced with the number you copied into the text file from Step 1. Make sure that you do not delete the single quotes around that number.  Here is what it should look like:","\n\n\n","\n\n"," ","\n","Run the query by hitting the green arrow icon ",".","The result of the query will appear in the lower pane of the SQL Query Analyzer.","\n\n\n\n\n","\n\n"," ","\n\n","It will show a table name of the ItemType. Copy this value and paste it into the text file we have been using to store temporary data. Your text file should look similar to:","\n","\n\n"," ","\n","Do not close the SQL Query Analyzer.  It will be used in the next step.","Make all null vales non-null.","\nWhen switching from a not-required to a required property, null values of this property are no longer accepted. Therefore, if instances of this ItemType exist, where the value of this property is null, these values must be changed.","From the SQL Query Analyzer, input the following query:","\n","\nUPDATE innovator.TABLE-NAME","\nSET Property-Name = 'Please Update This Field Value'","\nWHERE Property-Name is NULL","Where:","innovator refers to the owner of the table","TABLE-NAME should be replaced by the name of the table copied in Step 4","Property-Name should be replace by the name of the Property to be made Required and copied in Step 1.","\n","\nWhen entered, your query should look similar to:","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","\n\n"," ","\n","Run the query by hitting the green arrow icon ",".","Do not close the SQL Query Analyzer window, we will need it again.","Change the Property’s attribute in the database","\nIn the database table, each property has an attribute called Allows Nulls. Since we are changing the property to be Required, it no longer allows null values, and therefore its attribute needs to change as well.","Open Enterprise Manager, or go to it if already open.","Find the Database for the Innovator to be updated. Please be certain that this is the same database that you disconnected earlier from the InnovatorServerConfig.xml file.","Find the table retrieved in Step 3; the name of the table should be in your temporary text file.","Right click on the table and select Design Table.","Uncheck the Allows Nulls field for the Property you have changed (see your text file for the name of this property).","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","\n\n"," ","\n","Click on the Save icon and close the window.","Set Required = True for the Property of the ItemType."," ","\nIn the definition of your ItemType, for this particular property you had the property attribute Required set to False. Now, we can set it to true.","\n\n\n\n\n","\n\n"," ","\n","From the SQL Query Analyzer, run following query","\n","\nUPDATE innovator.PROPERTY","\nSET    IS_REQUIRED = '1'","\nWHERE (SOURCE_ID = 'ItemType ID') AND (NAME = 'Property-Name')","\n\n\n","Where:","\n","ItemType ID"," should be replace by the ItemType ID from your text file","\n","Property-Name"," should be replaced by the name of the property, also from your text file","\n","\n\n"," ","\n","Close the Query Analyzer window.","Enable Database connection","Open the InnovatorServerConfig.xml file","Find the line for the database updated in Step 3","\nIt should look similar to:","\n<xDB-Connection id=\"SolutionsS71\" database=\"SolutionsS71\" server=\"localhost\" uid=\"innovator\" pwd=\"innovator\" dbType=\"SQL Server\" />","Change the line by removing the x in front of the DB-Connection","\nIt should now look similar to:","\n<DB-Connection id=\"SolutionsS71\" database=\"SolutionsS71\" server=\"localhost\" uid=\"innovator\" pwd=\"innovator\" dbType=\"SQL Server\" />","Save the file and close","Step 8 – Restart IIS","From the Windows Start Menu","Select Start, Settings, Control Panel","Open Administrative Tools","Open Services","Find the World Wide Web Publishing service","Right click on World Wide Web Publishing service","Select Restart","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","\n","To change Required to False:","\n","Notify users that they must log out of Innovator by certain time when you (the Innovator Admin) will be making this change. The change requires a modification to the database, and no one can be logged in at that time. If users ignore the notification, they will be disconnected from the database while it is being modified, and will lose their work.","Determine the Item Type ID and Property Name.","\nIn this step we will find the necessary data about the ItemType and the Property in order to change the Property to “Required”.","Open a text file to temporarily hold required information","Log into Innovator as an administrator.","From TOC select ","ItemTypes",".","Search for the ItemType you wish to modify. In this example, we will use the ItemType TextPropertyTest.","Right click on the Item Type and select Properties. You will see a dialog that displays the items ID at the bottom.","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","\n\n"," ","\n","Click on the Copy button on the dialog.","Paste this value into the text file created above.","Open the ItemType and search for the property to be modified. In our case, we will use the property test_property.","\n\n\n\n\n\n\n","\n\n"," ","\n","Copy the name (not the label!) of the property to the text file created above. Your temporary text file should look similar to:","\n\n\n","\n\n"," ","\n","Disable the Database connection","\nIn this step we will disconnect the database, so that no changes could be made to the table while this change is being performed.","\n\n\n","If any users are still logged into Innovator, they will be disconnected and will lose their work.","\n","Open the InnovatorServerConfig.xml file","Find the line for the database you wish to update. It should look similar to:","\n<DB-Connection id=\"SolutionsS71\" database=\"SolutionsS71\" server=\"localhost\" uid=\"innovator\" pwd=\"innovator\" dbType=\"SQL Server\" />","Change the line by adding an x in front of the DB-Connection, like this:","\n<xDB-Connection id=\"SolutionsS71\" database=\"SolutionsS71\" server=\"localhost\" uid=\"innovator\" pwd=\"innovator\" dbType=\"SQL Server\" />  "," Save the file and close","Determine the Table name of the ItemType being updated.","\nUsually the table name would be the name of the ItemType. However, it is not always the case, so it’s safer to go through this step and retrieve the table name through a query.","Open Enterprise Manager","Find the Database for the Innovator to be updated. Please be certain that this is the same database that you disconnected earlier from the InnovatorServerConfig.xml file.","Find the table called ItemType","Highlight the table and select from the main menu: Tools, SQL Query Analyzer","Input the following query:  ","\n","\nSELECT INSTANCE_DATA","\nFROM innovator.ITEMTYPE","\nWHERE ID = 'YOUR ITEM ID'","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","where,","\n","Your Item ID should be replaced with the number you copied into the text file from Step 1. Make sure that you do not delete the single quotes around that number.  Here is what it should look like:","\n","\n\n"," ","\n","Run the query by hitting the green arrow icon ",".","The result of the query will appear in the lower pane of the SQL Query Analyzer.","\n\n\n\n\n","\n\n"," ","\n\n","It will show a table name of the ItemType.","\n","Copy this value and paste it into the text file we have been using to store temporary data. Your text file should look similar to:","\n","\n\n"," ","\n","Do not close the SQL Query Analyzer.  It will be used in the next step.","Change the Property’s attribute in the database","\nIn the database table, each property has an attribute called Allows Nulls. Since we are changing the property to be Not Required, it can allow null values, and therefore its attribute needs to change as well.","Open Enterprise Manager, or go to it if already open.","Find the Database for the Innovator to be updated. Please be certain that this is the same database that you disconnected earlier from the InnovatorServerConfig.xml file.","Find the table retrieved in Step 3; the name of the table should be in your temporary text file.","Right click on the table and select Design Table.","Check the Allows Nulls field for the Property you have changed (see your text file for the name of this property).","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","\n\n"," ","\n","Click on the Save icon and close the window.","Set Required = False for the Property of the ItemType.","\nIn the definition of your ItemType, for this particular property you had the property attribute Required set to True. Now, we can set it to False.","\n\n\n\n\n","\n\n"," ","\n","From the SQL Query Analyzer, run following query","\n","\nUPDATE innovator.PROPERTY","\nSET    IS_REQUIRED = '0'","\nWHERE (SOURCE_ID = 'ItemType ID') AND (NAME = 'Property-Name')","\n\n\n","Where:","\n","ItemType ID"," should be replace by the ItemType ID from your text file","\n","Property-Name"," should be replaced by the name of the property, also from your text file","\n","\n\n"," ","\n","Close the Query Analyzer window.","Enable Database connection","Open the InnovatorServerConfig.xml file","Find the line for the database updated in Step 3","\nIt should look similar to:","\n<xDB-Connection id=\"SolutionsS71\" database=\"SolutionsS71\" server=\"localhost\" uid=\"innovator\" pwd=\"innovator\" dbType=\"SQL Server\" />","Change the line by removing the x in front of the DB-Connection","\nIt should now look similar to:","\n<DB-Connection id=\"SolutionsS71\" database=\"SolutionsS71\" server=\"localhost\" uid=\"innovator\" pwd=\"innovator\" dbType=\"SQL Server\" />","Save the file and close","Restart IIS","From the Windows Start Menu","Select Start, Settings, Control Panel","Open Administrative Tools","Open Services","Find the World Wide Web Publishing service","Right click on World Wide Web Publishing service","Select Restart","\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","\n  ","\n    "," ","\n    ","©2020 Aras Corporation - All Rights Reserved","\n  ","\n\n"],"2":["Setting Required for Text"],"3":["Making a Text Property Required"," ","Making a Text Property Not Required"],"id":"190"})