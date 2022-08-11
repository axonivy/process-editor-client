export enum IconStyle {
  FA,
  SI,
  SVG,
  IMG,
  UNKNOWN,
  NO
}

export interface NodeIcon {
  res: string;
  style: IconStyle;
}
export const NoIcon = { res: '', style: IconStyle.NO };

const StandardIcons: { [icon: string]: NodeIcon } = {
  // No icon
  'std:NoDecorator': NoIcon,
  'std:End': NoIcon,
  // Standard icons
  'std:Step': { res: 'si si-script', style: IconStyle.SI },
  'std:UserDialog': { res: 'si si-user-dialog', style: IconStyle.SI },
  'std:User': { res: 'si si-user', style: IconStyle.SI },
  'std:WebService': { res: 'si si-web-service', style: IconStyle.SI },
  'std:RestClient': { res: 'si si-rest-client', style: IconStyle.SI },
  'std:Database': { res: 'si si-database', style: IconStyle.SI },
  'std:Mail': { res: 'si si-e-mail', style: IconStyle.SI },
  'std:Page': { res: 'si si-end-page', style: IconStyle.SI },
  'std:Trigger': { res: 'si si-trigger', style: IconStyle.SI },
  'std:Program': { res: 'si si-program', style: IconStyle.SI },
  'std:Manual': { res: 'si si-manual', style: IconStyle.SI },
  'std:Receive': { res: 'si si-receive', style: IconStyle.SI },
  'std:Rule': { res: 'si si-rule', style: IconStyle.SI },
  'std:Send': { res: 'si si-send', style: IconStyle.SI },
  'std:Service': { res: 'si si-service', style: IconStyle.SI },
  'std:Script': { res: 'si si-script', style: IconStyle.SI },

  'std:CallAndWait': { res: 'si si-wait', style: IconStyle.SI },
  'std:SubEnd': { res: 'fa-solid fa-reply', style: IconStyle.FA },
  'std:SubStart': { res: 'fa-solid fa-share', style: IconStyle.FA },
  'std:Init': { res: 'fa-solid fa-arrow-right', style: IconStyle.FA },
  'std:Method': { res: 'fa-solid fa-arrow-circle-right', style: IconStyle.FA },
  'std:Event': { res: 'fa-solid fa-caret-square-right', style: IconStyle.FA },
  'std:Exit': { res: 'fa-solid fa-window-close', style: IconStyle.FA },

  'std:Signal': { res: 'si si-signal', style: IconStyle.SI },
  'std:Error': { res: 'si si-error', style: IconStyle.SI },
  'std:Alternative': { res: 'si si-aternative', style: IconStyle.SI },
  'std:Join': { res: 'si si-join', style: IconStyle.SI },
  'std:Split': { res: 'si si-split', style: IconStyle.SI },

  'std:Tasks': { res: 'M5,5 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M3,5 L7,5 M5,3 L5,7', style: IconStyle.SVG },

  // Error/Signal icons
  'std:Message': { res: 'fa-regular fa-envelope', style: IconStyle.FA },
  'std:Timer': { res: 'fa-regular fa-clock', style: IconStyle.FA },
  'std:Conditional': { res: 'fa-solid fa-align-justify', style: IconStyle.FA },
  'std:Escalation': { res: 'fa-solid fa-angles-up', style: IconStyle.FA },
  'std:Compensation': { res: 'fa-solid fa-angles-left', style: IconStyle.FA },
  'std:Cancel': { res: 'fa-solid fa-xmark', style: IconStyle.FA }
};

const PaletteIcons: { [icon: string]: NodeIcon } = {
  'std:Pool': { res: 'si si-pool-swimlanes', style: IconStyle.SI },
  'std:Lane': { res: 'si si-lane-swimlanes', style: IconStyle.SI },
  'std:Start': { res: 'si si-start', style: IconStyle.SI },
  'std:TaskEnd': { res: 'si si-end', style: IconStyle.SI },
  'std:ErrorStart': StandardIcons['std:Error'],
  'std:ErrorEnd': StandardIcons['std:Error'],
  'std:EmbeddedProcess': { res: 'si si-call', style: IconStyle.SI },
  'std:SubProcessCall': { res: 'si si-sub', style: IconStyle.SI },
  'std:Annotation': { res: 'si si-note', style: IconStyle.SI },
  'std:BpmnGeneric': { res: 'si si-generic', style: IconStyle.SI },
  'std:BpmnUser': StandardIcons['std:User'],
  'std:BpmnManual': StandardIcons['std:Manual'],
  'std:BpmnScript': StandardIcons['std:Script'],
  'std:BpmnReceive': StandardIcons['std:Receive'],
  'std:BpmnRule': StandardIcons['std:Rule'],
  'std:BpmnSend': StandardIcons['std:Send'],
  'std:BpmnService': StandardIcons['std:Service']
};

export const resolveIcon = (iconUri: string): NodeIcon => {
  if (!iconUri) {
    return NoIcon;
  }
  if (iconUri.includes('/faces/javax.faces.resource')) {
    return { res: iconUri, style: IconStyle.IMG };
  } else if (iconUri.startsWith('ext:')) {
    return { res: 'fa-puzzle-piece', style: IconStyle.FA };
  }
  return StandardIcons[iconUri] ?? { res: iconUri, style: IconStyle.UNKNOWN };
};

export const resolvePaletteIcon = (iconUri: string): NodeIcon => PaletteIcons[iconUri] ?? resolveIcon(iconUri);
