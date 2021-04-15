rh._.exports({"1":["\n  ","\n  ","\n  ","When a user logs in","\n  ","The Aras Innovator client inspects the client settings and server variables and establishes Session Context  which is used until the session ends. Aras Innovator determines whether the client culture is one of the Locales in the database.","\n  ","Aras Innovator determines whether the CorporateTimeZone is set:","\n  ","\n  ","\n  ","\n  ","\n    ","\n      ","If so it calculates the offset between client TimeZone and adopts the ClientTimeZone","\n    ","\n    ","\n      ","If not the offset to CorporateTimeZone is set to zero and adopts the ClientTimeZone","\n    ","\n    ","\n      ","If the CorporateTime offset is zero, Local time only is shown in the Innovator Client","\n    ","\n    ","\n      ","If CorporateTime offset is NOT zero, Corporate AND Local time are shown in the Innovator Client","\n    ","\n  ","\n  ","When information is requested by the client","\n  ","For each value of type Multilingual String, (most often a Menu, Label or List Value) Innovator checks whether a value is available for the context language.","\n  ","\n    ","\n      ","If so the server returns the value in the context language.","\n    ","\n    ","\n      ","If not the server returns the value for the default language. Note that this value could be blank if it has not been defined. ","\n    ","\n    ","\n      ","For each value of type Date or Time the server adjusts the value for the session CorporateTimeZone, which may be 0","\n    ","\n  ","\n  ","For each value of type Date or Time or Decimal, the standard Innovator client formats it using the client Regional Settings culture (note that alternate clients will need to perform this step to support this feature).","\n  ","\n    ","\n      ","If Yes, the Innovator Locale and its Innovator Language are adopted","\n    ","\n    ","\n    ","\n    ","\n      ","If No, the default Locale and Language are adopted","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n    ","\n  ","\n  ","\n  ","For more information on administering Internationalization, consult the documentation on the release CD.","\n\n","\n  ","\n    "," ","\n    ","©2020 Aras Corporation - All Rights Reserved","\n  ","\n\n"],"2":["Internationalization and Localization Behavior"],"7":["How Internationialization and Localization works in Innovator"],"id":"221"})