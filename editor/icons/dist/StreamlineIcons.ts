export type StreamlineIconsId =
  | "activities-group"
  | "align-horizontal"
  | "align-vertical"
  | "aternative"
  | "bug"
  | "call"
  | "caution"
  | "center"
  | "color"
  | "comment"
  | "connector"
  | "custom-icon"
  | "darkmode"
  | "data-models"
  | "database"
  | "delete"
  | "dialogs"
  | "e-mail-icon"
  | "e-mail"
  | "end-page"
  | "end"
  | "error"
  | "events-group"
  | "fit-to-screen"
  | "gateways-group-2"
  | "gateways-group"
  | "generic"
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
  | "pool-swimlanes"
  | "program"
  | "receive"
  | "rest-client"
  | "rule"
  | "script"
  | "send"
  | "service"
  | "signal"
  | "split"
  | "start-program"
  | "start"
  | "sub"
  | "task"
  | "trigger"
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
  | "Aternative"
  | "Bug"
  | "Call"
  | "Caution"
  | "Center"
  | "Color"
  | "Comment"
  | "Connector"
  | "CustomIcon"
  | "Darkmode"
  | "DataModels"
  | "Database"
  | "Delete"
  | "Dialogs"
  | "EMailIcon"
  | "EMail"
  | "EndPage"
  | "End"
  | "Error"
  | "EventsGroup"
  | "FitToScreen"
  | "GatewaysGroup_2"
  | "GatewaysGroup"
  | "Generic"
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
  | "PoolSwimlanes"
  | "Program"
  | "Receive"
  | "RestClient"
  | "Rule"
  | "Script"
  | "Send"
  | "Service"
  | "Signal"
  | "Split"
  | "StartProgram"
  | "Start"
  | "Sub"
  | "Task"
  | "Trigger"
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
  Aternative = "aternative",
  Bug = "bug",
  Call = "call",
  Caution = "caution",
  Center = "center",
  Color = "color",
  Comment = "comment",
  Connector = "connector",
  CustomIcon = "custom-icon",
  Darkmode = "darkmode",
  DataModels = "data-models",
  Database = "database",
  Delete = "delete",
  Dialogs = "dialogs",
  EMailIcon = "e-mail-icon",
  EMail = "e-mail",
  EndPage = "end-page",
  End = "end",
  Error = "error",
  EventsGroup = "events-group",
  FitToScreen = "fit-to-screen",
  GatewaysGroup_2 = "gateways-group-2",
  GatewaysGroup = "gateways-group",
  Generic = "generic",
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
  PoolSwimlanes = "pool-swimlanes",
  Program = "program",
  Receive = "receive",
  RestClient = "rest-client",
  Rule = "rule",
  Script = "script",
  Send = "send",
  Service = "service",
  Signal = "signal",
  Split = "split",
  StartProgram = "start-program",
  Start = "start",
  Sub = "sub",
  Task = "task",
  Trigger = "trigger",
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
  [StreamlineIcons.Aternative]: "61700",
  [StreamlineIcons.Bug]: "61701",
  [StreamlineIcons.Call]: "61702",
  [StreamlineIcons.Caution]: "61703",
  [StreamlineIcons.Center]: "61704",
  [StreamlineIcons.Color]: "61705",
  [StreamlineIcons.Comment]: "61706",
  [StreamlineIcons.Connector]: "61707",
  [StreamlineIcons.CustomIcon]: "61708",
  [StreamlineIcons.Darkmode]: "61709",
  [StreamlineIcons.DataModels]: "61710",
  [StreamlineIcons.Database]: "61711",
  [StreamlineIcons.Delete]: "61712",
  [StreamlineIcons.Dialogs]: "61713",
  [StreamlineIcons.EMailIcon]: "61714",
  [StreamlineIcons.EMail]: "61715",
  [StreamlineIcons.EndPage]: "61716",
  [StreamlineIcons.End]: "61717",
  [StreamlineIcons.Error]: "61718",
  [StreamlineIcons.EventsGroup]: "61719",
  [StreamlineIcons.FitToScreen]: "61720",
  [StreamlineIcons.GatewaysGroup_2]: "61721",
  [StreamlineIcons.GatewaysGroup]: "61722",
  [StreamlineIcons.Generic]: "61723",
  [StreamlineIcons.Grid]: "61724",
  [StreamlineIcons.Helplines]: "61725",
  [StreamlineIcons.Information]: "61726",
  [StreamlineIcons.Join]: "61727",
  [StreamlineIcons.JumpOut]: "61728",
  [StreamlineIcons.Jump]: "61729",
  [StreamlineIcons.Label]: "61730",
  [StreamlineIcons.LaneSwimlanes]: "61731",
  [StreamlineIcons.Manual]: "61732",
  [StreamlineIcons.Market]: "61733",
  [StreamlineIcons.Note]: "61734",
  [StreamlineIcons.OriginScreen]: "61735",
  [StreamlineIcons.PenEdit]: "61736",
  [StreamlineIcons.PoolSwimlanes]: "61737",
  [StreamlineIcons.Program]: "61738",
  [StreamlineIcons.Receive]: "61739",
  [StreamlineIcons.RestClient]: "61740",
  [StreamlineIcons.Rule]: "61741",
  [StreamlineIcons.Script]: "61742",
  [StreamlineIcons.Send]: "61743",
  [StreamlineIcons.Service]: "61744",
  [StreamlineIcons.Signal]: "61745",
  [StreamlineIcons.Split]: "61746",
  [StreamlineIcons.StartProgram]: "61747",
  [StreamlineIcons.Start]: "61748",
  [StreamlineIcons.Sub]: "61749",
  [StreamlineIcons.Task]: "61750",
  [StreamlineIcons.Trigger]: "61751",
  [StreamlineIcons.Unwrap]: "61752",
  [StreamlineIcons.UserDialog]: "61753",
  [StreamlineIcons.UserTask]: "61754",
  [StreamlineIcons.User]: "61755",
  [StreamlineIcons.Wait]: "61756",
  [StreamlineIcons.WebService]: "61757",
  [StreamlineIcons.WrapToSubprocess]: "61758",
};
