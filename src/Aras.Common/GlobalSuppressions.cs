// This file is used by Code Analysis to maintain SuppressMessage 
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given 
// a specific target and scoped to a namespace, type, member, etc.
//
// To add a suppression to this file, right-click the message in the 
// Code Analysis results, point to "Suppress Message", and click 
// "In Suppression File".
// You do not need to add suppressions to this file manually.
using System.Diagnostics.CodeAnalysis;

[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1040:AvoidEmptyInterfaces", Scope = "type", Target = "Aras.Common.IDataAccessLayer")]
[assembly: SuppressMessage("Design", "CA1062:Validate arguments of public methods", Justification = "<Pending>", Scope = "member", Target = "~M:Aras.Common.BaseDataAccessLayer.ApplyItemWithGrantIdentity(Aras.IOM.Item,System.String)~Aras.IOM.Item")]
[assembly: SuppressMessage("Design", "CA1062:Validate arguments of public methods", Justification = "<Pending>", Scope = "member", Target = "~M:Aras.Common.BaseDataAccessLayer.ApplyItem(Aras.IOM.Item)~Aras.IOM.Item")]
[assembly: SuppressMessage("Design", "CA1062:Validate arguments of public methods", Justification = "<Pending>", Scope = "member", Target = "~M:Aras.Common.ItemExtensions.Enumerate(Aras.IOM.Item)~System.Collections.Generic.IEnumerable{Aras.IOM.Item}")]
[assembly: SuppressMessage("Design", "CA1054:Uri parameters should not be strings", Justification = "<Pending>", Scope = "member", Target = "~M:Aras.Common.ServerConnectionProvider.Get(System.String,System.String,System.String,System.String)~Aras.IOM.IServerConnection")]
