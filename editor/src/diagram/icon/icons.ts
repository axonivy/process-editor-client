export enum IconStyle {
  FA,
  SVG,
  IMG,
  NO
}

export interface NodeIcon { res: string; style: IconStyle }
export const NoIcon = { res: '', style: IconStyle.NO };

const StandardIcons: { [icon: string]: NodeIcon } = {
  'std:Step': { res: 'fa-cog', style: IconStyle.FA },
  'std:UserDialog': { res: 'fa-desktop', style: IconStyle.FA },
  'std:User': { res: 'fa-user', style: IconStyle.FA },
  'std:WebService': { res: 'fa-globe', style: IconStyle.FA },
  'std:RestClient': { res: 'fa-exchange-alt', style: IconStyle.FA },
  'std:Database': { res: 'fa-database', style: IconStyle.FA },
  'std:Mail': { res: 'fa-envelope', style: IconStyle.FA },
  'std:Page': { res: 'fa-tv', style: IconStyle.FA },
  'std:Trigger': { res: 'fa-share-square', style: IconStyle.FA },
  'std:Program': { res: 'fa-scroll', style: IconStyle.FA },
  'std:Manual': { res: 'fa-hand-point-right', style: IconStyle.FA },
  'std:Receive': { res: 'fa-caret-square-down', style: IconStyle.FA },
  'std:Rule': { res: 'fa-table', style: IconStyle.FA },
  'std:Send': { res: 'fa-caret-square-up', style: IconStyle.FA },
  'std:Service': { res: 'fa-cog', style: IconStyle.FA },
  'std:Script': { res: 'fa-scroll', style: IconStyle.FA },
  'std:CallAndWait': { res: 'fa-scroll', style: IconStyle.FA },
  'std:SubEnd': { res: 'fa-reply', style: IconStyle.FA },
  'std:SubStart': { res: 'fa-share', style: IconStyle.FA },
  'std:Init': { res: 'fa-arrow-right', style: IconStyle.FA },
  'std:Method': { res: 'fa-arrow-circle-right', style: IconStyle.FA },
  'std:Event': { res: 'fa-caret-square-right', style: IconStyle.FA },
  'std:Exit': { res: 'fa-window-close', style: IconStyle.FA },
  'std:Signal': { res: 'M5,0 L10,10 l-10,0 Z', style: IconStyle.SVG },
  'std:Error': { res: 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z', style: IconStyle.SVG },
  'std:Alternative': { res: 'M2,2 L8,8 M2,8 L8,2', style: IconStyle.SVG },
  'std:Join': { res: 'M2,5 L8,5 M5,2 L5,8', style: IconStyle.SVG },
  'std:Split': { res: 'M2,5 L8,5 M5,2 L5,8', style: IconStyle.SVG },
  'std:Tasks': { res: 'M5,5 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M3,5 L7,5 M5,3 L5,7', style: IconStyle.SVG }
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
  return StandardIcons[iconUri] ?? NoIcon;
};
