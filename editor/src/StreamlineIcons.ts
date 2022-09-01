export type StreamlineIconsId =
  | "activities-group"
  | "align-horizontal"
  | "align-vertical"
  | "all-elements"
  | "alternative"
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
  | "delete"
  | "dialogs"
  | "e-mail-icon"
  | "e-mail"
  | "edit"
  | "end-page"
  | "end"
  | "error-event"
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
  | "tasks"
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
  | "Alternative"
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
  | "Delete"
  | "Dialogs"
  | "EMailIcon"
  | "EMail"
  | "Edit"
  | "EndPage"
  | "End"
  | "ErrorEvent"
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
  | "Tasks"
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
  Alternative = "alternative",
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
  Delete = "delete",
  Dialogs = "dialogs",
  EMailIcon = "e-mail-icon",
  EMail = "e-mail",
  Edit = "edit",
  EndPage = "end-page",
  End = "end",
  ErrorEvent = "error-event",
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
  Tasks = "tasks",
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
  [StreamlineIcons.Alternative]: "61701",
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
  [StreamlineIcons.Delete]: "61717",
  [StreamlineIcons.Dialogs]: "61718",
  [StreamlineIcons.EMailIcon]: "61719",
  [StreamlineIcons.EMail]: "61720",
  [StreamlineIcons.Edit]: "61721",
  [StreamlineIcons.EndPage]: "61722",
  [StreamlineIcons.End]: "61723",
  [StreamlineIcons.ErrorEvent]: "61724",
  [StreamlineIcons.Error]: "61725",
  [StreamlineIcons.EventsGroup]: "61726",
  [StreamlineIcons.FitToScreen]: "61727",
  [StreamlineIcons.GatewaysGroup]: "61728",
  [StreamlineIcons.Generic]: "61729",
  [StreamlineIcons.GoToSource]: "61730",
  [StreamlineIcons.Grid]: "61731",
  [StreamlineIcons.Helplines]: "61732",
  [StreamlineIcons.Information]: "61733",
  [StreamlineIcons.Join]: "61734",
  [StreamlineIcons.JumpOut]: "61735",
  [StreamlineIcons.Jump]: "61736",
  [StreamlineIcons.Label]: "61737",
  [StreamlineIcons.LaneSwimlanes]: "61738",
  [StreamlineIcons.Manual]: "61739",
  [StreamlineIcons.Market]: "61740",
  [StreamlineIcons.Note]: "61741",
  [StreamlineIcons.OriginScreen]: "61742",
  [StreamlineIcons.PenEdit]: "61743",
  [StreamlineIcons.Play]: "61744",
  [StreamlineIcons.PoolSwimlanes]: "61745",
  [StreamlineIcons.Program]: "61746",
  [StreamlineIcons.Receive]: "61747",
  [StreamlineIcons.Reconnect]: "61748",
  [StreamlineIcons.Redo]: "61749",
  [StreamlineIcons.RestClient]: "61750",
  [StreamlineIcons.Rule]: "61751",
  [StreamlineIcons.Script]: "61752",
  [StreamlineIcons.Search]: "61753",
  [StreamlineIcons.Send]: "61754",
  [StreamlineIcons.Service]: "61755",
  [StreamlineIcons.Settings]: "61756",
  [StreamlineIcons.Signal]: "61757",
  [StreamlineIcons.Split]: "61758",
  [StreamlineIcons.StartProgram]: "61759",
  [StreamlineIcons.Start]: "61760",
  [StreamlineIcons.Straighten]: "61761",
  [StreamlineIcons.Sub]: "61762",
  [StreamlineIcons.Task]: "61763",
  [StreamlineIcons.Tasks]: "61764",
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
