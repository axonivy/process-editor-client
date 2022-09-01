export type StreamlineIconsId =
  | "activities-group"
  | "align-horizontal"
  | "align-vertical"
  | "all-elements"
  | "aternative"
  | "auto-align"
  | "bend"
  | "bug"
  | "call"
  | "caution"
  | "center"
  | "color"
  | "comment"
  | "connector"
  | "cursor-select"
  | "cursor"
  | "custom-icon"
  | "darkmode"
  | "data-models"
  | "database"
  | "database2"
  | "delete"
  | "dialogs"
  | "e-mail-icon"
  | "e-mail"
  | "edit"
  | "edit2"
  | "end-page"
  | "end"
  | "error"
  | "events-group"
  | "fit-to-screen"
  | "gateways-group"
  | "generic"
  | "go-to-source"
  | "grid"
  | "helplines"
  | "information"
  | "join"
  | "jump-out"
  | "jump"
  | "label"
  | "lane-swimlanes"
  | "manual"
  | "market"
  | "note"
  | "origin-screen"
  | "pen-edit"
  | "play"
  | "pool-swimlanes"
  | "program"
  | "receive"
  | "reconnect"
  | "redo"
  | "rest-client"
  | "rule"
  | "script"
  | "search"
  | "send"
  | "service"
  | "settings"
  | "signal"
  | "split"
  | "start-program"
  | "start"
  | "straighten"
  | "sub"
  | "task"
  | "trigger"
  | "undo"
  | "unwrap"
  | "user-dialog"
  | "user-task"
  | "user"
  | "wait"
  | "web-service"
  | "wrap-to-subprocess";

export type StreamlineIconsKey =
  | "ActivitiesGroup"
  | "AlignHorizontal"
  | "AlignVertical"
  | "AllElements"
  | "Aternative"
  | "AutoAlign"
  | "Bend"
  | "Bug"
  | "Call"
  | "Caution"
  | "Center"
  | "Color"
  | "Comment"
  | "Connector"
  | "CursorSelect"
  | "Cursor"
  | "CustomIcon"
  | "Darkmode"
  | "DataModels"
  | "Database"
  | "Database2"
  | "Delete"
  | "Dialogs"
  | "EMailIcon"
  | "EMail"
  | "Edit"
  | "Edit2"
  | "EndPage"
  | "End"
  | "Error"
  | "EventsGroup"
  | "FitToScreen"
  | "GatewaysGroup"
  | "Generic"
  | "GoToSource"
  | "Grid"
  | "Helplines"
  | "Information"
  | "Join"
  | "JumpOut"
  | "Jump"
  | "Label"
  | "LaneSwimlanes"
  | "Manual"
  | "Market"
  | "Note"
  | "OriginScreen"
  | "PenEdit"
  | "Play"
  | "PoolSwimlanes"
  | "Program"
  | "Receive"
  | "Reconnect"
  | "Redo"
  | "RestClient"
  | "Rule"
  | "Script"
  | "Search"
  | "Send"
  | "Service"
  | "Settings"
  | "Signal"
  | "Split"
  | "StartProgram"
  | "Start"
  | "Straighten"
  | "Sub"
  | "Task"
  | "Trigger"
  | "Undo"
  | "Unwrap"
  | "UserDialog"
  | "UserTask"
  | "User"
  | "Wait"
  | "WebService"
  | "WrapToSubprocess";

export enum StreamlineIcons {
  ActivitiesGroup = "activities-group",
  AlignHorizontal = "align-horizontal",
  AlignVertical = "align-vertical",
  AllElements = "all-elements",
  Aternative = "aternative",
  AutoAlign = "auto-align",
  Bend = "bend",
  Bug = "bug",
  Call = "call",
  Caution = "caution",
  Center = "center",
  Color = "color",
  Comment = "comment",
  Connector = "connector",
  CursorSelect = "cursor-select",
  Cursor = "cursor",
  CustomIcon = "custom-icon",
  Darkmode = "darkmode",
  DataModels = "data-models",
  Database = "database",
  Database2 = "database2",
  Delete = "delete",
  Dialogs = "dialogs",
  EMailIcon = "e-mail-icon",
  EMail = "e-mail",
  Edit = "edit",
  Edit2 = "edit2",
  EndPage = "end-page",
  End = "end",
  Error = "error",
  EventsGroup = "events-group",
  FitToScreen = "fit-to-screen",
  GatewaysGroup = "gateways-group",
  Generic = "generic",
  GoToSource = "go-to-source",
  Grid = "grid",
  Helplines = "helplines",
  Information = "information",
  Join = "join",
  JumpOut = "jump-out",
  Jump = "jump",
  Label = "label",
  LaneSwimlanes = "lane-swimlanes",
  Manual = "manual",
  Market = "market",
  Note = "note",
  OriginScreen = "origin-screen",
  PenEdit = "pen-edit",
  Play = "play",
  PoolSwimlanes = "pool-swimlanes",
  Program = "program",
  Receive = "receive",
  Reconnect = "reconnect",
  Redo = "redo",
  RestClient = "rest-client",
  Rule = "rule",
  Script = "script",
  Search = "search",
  Send = "send",
  Service = "service",
  Settings = "settings",
  Signal = "signal",
  Split = "split",
  StartProgram = "start-program",
  Start = "start",
  Straighten = "straighten",
  Sub = "sub",
  Task = "task",
  Trigger = "trigger",
  Undo = "undo",
  Unwrap = "unwrap",
  UserDialog = "user-dialog",
  UserTask = "user-task",
  User = "user",
  Wait = "wait",
  WebService = "web-service",
  WrapToSubprocess = "wrap-to-subprocess",
}

export const STREAMLINE_ICONS_CODEPOINTS: { [key in StreamlineIcons]: string } = {
  [StreamlineIcons.ActivitiesGroup]: "61697",
  [StreamlineIcons.AlignHorizontal]: "61698",
  [StreamlineIcons.AlignVertical]: "61699",
  [StreamlineIcons.AllElements]: "61700",
  [StreamlineIcons.Aternative]: "61701",
  [StreamlineIcons.AutoAlign]: "61702",
  [StreamlineIcons.Bend]: "61703",
  [StreamlineIcons.Bug]: "61704",
  [StreamlineIcons.Call]: "61705",
  [StreamlineIcons.Caution]: "61706",
  [StreamlineIcons.Center]: "61707",
  [StreamlineIcons.Color]: "61708",
  [StreamlineIcons.Comment]: "61709",
  [StreamlineIcons.Connector]: "61710",
  [StreamlineIcons.CursorSelect]: "61711",
  [StreamlineIcons.Cursor]: "61712",
  [StreamlineIcons.CustomIcon]: "61713",
  [StreamlineIcons.Darkmode]: "61714",
  [StreamlineIcons.DataModels]: "61715",
  [StreamlineIcons.Database]: "61716",
  [StreamlineIcons.Database2]: "61717",
  [StreamlineIcons.Delete]: "61718",
  [StreamlineIcons.Dialogs]: "61719",
  [StreamlineIcons.EMailIcon]: "61720",
  [StreamlineIcons.EMail]: "61721",
  [StreamlineIcons.Edit]: "61722",
  [StreamlineIcons.Edit2]: "61723",
  [StreamlineIcons.EndPage]: "61724",
  [StreamlineIcons.End]: "61725",
  [StreamlineIcons.Error]: "61726",
  [StreamlineIcons.EventsGroup]: "61727",
  [StreamlineIcons.FitToScreen]: "61728",
  [StreamlineIcons.GatewaysGroup]: "61729",
  [StreamlineIcons.Generic]: "61730",
  [StreamlineIcons.GoToSource]: "61731",
  [StreamlineIcons.Grid]: "61732",
  [StreamlineIcons.Helplines]: "61733",
  [StreamlineIcons.Information]: "61734",
  [StreamlineIcons.Join]: "61735",
  [StreamlineIcons.JumpOut]: "61736",
  [StreamlineIcons.Jump]: "61737",
  [StreamlineIcons.Label]: "61738",
  [StreamlineIcons.LaneSwimlanes]: "61739",
  [StreamlineIcons.Manual]: "61740",
  [StreamlineIcons.Market]: "61741",
  [StreamlineIcons.Note]: "61742",
  [StreamlineIcons.OriginScreen]: "61743",
  [StreamlineIcons.PenEdit]: "61744",
  [StreamlineIcons.Play]: "61745",
  [StreamlineIcons.PoolSwimlanes]: "61746",
  [StreamlineIcons.Program]: "61747",
  [StreamlineIcons.Receive]: "61748",
  [StreamlineIcons.Reconnect]: "61749",
  [StreamlineIcons.Redo]: "61750",
  [StreamlineIcons.RestClient]: "61751",
  [StreamlineIcons.Rule]: "61752",
  [StreamlineIcons.Script]: "61753",
  [StreamlineIcons.Search]: "61754",
  [StreamlineIcons.Send]: "61755",
  [StreamlineIcons.Service]: "61756",
  [StreamlineIcons.Settings]: "61757",
  [StreamlineIcons.Signal]: "61758",
  [StreamlineIcons.Split]: "61759",
  [StreamlineIcons.StartProgram]: "61760",
  [StreamlineIcons.Start]: "61761",
  [StreamlineIcons.Straighten]: "61762",
  [StreamlineIcons.Sub]: "61763",
  [StreamlineIcons.Task]: "61764",
  [StreamlineIcons.Trigger]: "61765",
  [StreamlineIcons.Undo]: "61766",
  [StreamlineIcons.Unwrap]: "61767",
  [StreamlineIcons.UserDialog]: "61768",
  [StreamlineIcons.UserTask]: "61769",
  [StreamlineIcons.User]: "61770",
  [StreamlineIcons.Wait]: "61771",
  [StreamlineIcons.WebService]: "61772",
  [StreamlineIcons.WrapToSubprocess]: "61773",
};
