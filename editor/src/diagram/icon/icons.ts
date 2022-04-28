export enum IconStyle {
  FA,
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
  'std:NoDecorator': NoIcon,
  'std:Step': { res: 'fa-solid fa-cog', style: IconStyle.FA },
  'std:UserDialog': { res: 'fa-solid fa-display', style: IconStyle.FA },
  'std:User': { res: 'fa-solid fa-user', style: IconStyle.FA },
  'std:WebService': { res: 'fa-solid fa-globe', style: IconStyle.FA },
  'std:RestClient': { res: 'fa-solid fa-rss', style: IconStyle.FA },
  'std:Database': { res: 'fa-solid fa-database', style: IconStyle.FA },
  'std:Mail': { res: 'fa-regular fa-envelope', style: IconStyle.FA },
  'std:Page': { res: 'fa-solid fa-tv', style: IconStyle.FA },
  'std:Trigger': { res: 'fa-regular fa-share-square', style: IconStyle.FA },
  'std:Program': { res: 'fa-solid fa-scroll', style: IconStyle.FA },
  'std:Manual': { res: 'fa-solid fa-hand-point-right', style: IconStyle.FA },
  'std:Receive': { res: 'fa-solid fa-caret-square-down', style: IconStyle.FA },
  'std:Rule': { res: 'fa-solid fa-table', style: IconStyle.FA },
  'std:Send': { res: 'fa-solid fa-caret-square-up', style: IconStyle.FA },
  'std:Service': { res: 'fa-solid fa-cog', style: IconStyle.FA },
  'std:Script': { res: 'fa-solid fa-scroll', style: IconStyle.FA },
  'std:CallAndWait': { res: 'fa-solid fa-scroll', style: IconStyle.FA },
  'std:SubEnd': { res: 'fa-solid fa-reply', style: IconStyle.FA },
  'std:SubStart': { res: 'fa-solid fa-share', style: IconStyle.FA },
  'std:Init': { res: 'fa-solid fa-arrow-right', style: IconStyle.FA },
  'std:Method': { res: 'fa-solid fa-arrow-circle-right', style: IconStyle.FA },
  'std:Event': { res: 'fa-solid fa-caret-square-right', style: IconStyle.FA },
  'std:Exit': { res: 'fa-solid fa-window-close', style: IconStyle.FA },
  'std:End': NoIcon,
  'std:Signal': { res: 'M5,0 L10,10 l-10,0 Z', style: IconStyle.SVG },
  'std:Error': { res: 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z', style: IconStyle.SVG },
  'std:Alternative': { res: 'M2,2 L8,8 M2,8 L8,2', style: IconStyle.SVG },
  'std:Join': { res: 'M2,5 L8,5 M5,2 L5,8', style: IconStyle.SVG },
  'std:Split': { res: 'M2,5 L8,5 M5,2 L5,8', style: IconStyle.SVG },
  'std:Tasks': { res: 'M5,5 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M3,5 L7,5 M5,3 L5,7', style: IconStyle.SVG }
};

const PaletteIcons: { [icon: string]: NodeIcon } = {
  'event-group': { res: 'fa-regular fa-circle', style: IconStyle.FA },
  'gateway-group': { res: 'fa-regular fa-square fa-rotate-45', style: IconStyle.FA },
  'activity-group': { res: 'fa-regular fa-square', style: IconStyle.FA },
  'swimlane-group': { res: 'fa-solid fa-columns fa-rotate-270', style: IconStyle.FA },
  'std:Pool': { res: 'fa-solid fa-columns fa-rotate-270', style: IconStyle.FA },
  'std:Lane': { res: 'fa-solid fa-columns fa-rotate-270', style: IconStyle.FA },
  'std:Start': { res: 'fa-regular fa-circle', style: IconStyle.FA },
  'std:TaskEnd': { res: 'fa-regular fa-circle', style: IconStyle.FA },
  'std:ErrorStart': { res: 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z', style: IconStyle.SVG },
  'std:ErrorEnd': { res: 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z', style: IconStyle.SVG },
  'std:EmbeddedProcess': { res: 'fa-solid fa-diagram-next', style: IconStyle.FA },
  'std:SubProcessCall': { res: 'fa-solid fa-diagram-next', style: IconStyle.FA },
  'std:Annotation': { res: 'fa-regular fa-message', style: IconStyle.FA }
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
