rh._.exports({"0":["Using Teams / Roles in Permissions"],"1":["\n  ","\n  ","\n    ","\n    ","Support is provided for team identities/roles to be specified as part of the definition of ","a Permission",".","  ","This provides the ability to restrict access to an item based on the members of the team who are responsible for it.","  ","For example, if a part has an associated team with multiple members, there may be some users who require access to make updates, etc. while others on the team only need to be able to view the item and should not have access to make changes, etc.","  ","Using the team identity enables this type of ‘dynamic’ access control.","\n    ","\n    ","\n    ","\n    ",".","\n    ","\n    ","In the previous example, any member of the ‘Team’ has at a minimum ‘Get’ access. Any member with a role of ‘Team Guest’ also has ‘Get’ Access.","  ","Any member with the role of ‘Team Manager’ has the rights to ‘Get’, ‘Update’, or ‘Delete’. Finally, any member of the team with the role ‘Team Member’ has the rights to both ‘Get’ and ‘Update’ privileges.","\n    ","\n    ","Note that a team item must be set for the ‘","team_id","’ property on each item instance to which the permission applies.  This provides the necessary team information for the system to utilize when applying access rights.","\n    ","\n    ","Steps:","\n    ","\n    ","\n      ","While viewing ","a permission"," in edit mode, click the ","Add Identities"," icon ","on the ","Access"," tab.  The Identities dialog box appears",".","\n    ","\n    ","\n      ","\n      ","\n    ","\n    ","\n      ","Click the search icon "," to filter for identities with ","Is"," ","Alias=‘0’"," and ","Classification=‘Team’",".","  ","This will return the available system team ‘role’ identities which can be used directly in the permission to control access.","\n    ","\n    ","\n    ","\n    ","\n    "," ","\n    ","\n    ","\n    ","\n      "," ","Select one or more identities from the search dialog and click ",".","\n        ","\n        ","\n      ","\n      ","The System populates the selected team identities (roles) in the relationship grid.","  ","These special team identities can be used in combination with other identities in defining the Permission item.","\n        ","\n        ","\n      ","\n      ","Set the remaining Access attributes (Get, Update, Delete, etc.) for each team identity:","\n    ","\n    ","\n    ","\n    ","\n      ","Click "," to save your changes and unclaim the permission.","\n    ","\n    ","\n    "," ","\n    ","\n  ","\n\n","\n  ","\n    "," ","\n    ","©2020 Aras Corporation - All Rights Reserved","\n  ","\n\n"],"2":["Using Teams/Roles in Permissions (Administrators Only)"],"8":["Permission Example:"],"id":"196"})