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
  'std:Signal': { res: 'M5,0 L10,10 l-10,0 Z', style: IconStyle.SVG },
  'std:Error': { res: 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z', style: IconStyle.SVG }
};

export const resolveIcon = (iconUri: string): NodeIcon => {
  if (!iconUri) {
    return NoIcon;
  }
  if (iconUri.includes('webContent')) {
    return { res: iconUri, style: IconStyle.IMG };
  } else if (iconUri.startsWith('ext:')) {
    return { res: 'fa-puzzle-piece', style: IconStyle.FA };
  }
  return StandardIcons[iconUri] ?? NoIcon;
};
