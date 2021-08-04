const StandardIcons: { [icon: string]: string } = {
  'std:Step': 'fa-cog',
  'std:UserDialog': 'fa-desktop',
  'std:User': 'fa-user',
  'std:WebService': 'fa-globe',
  'std:RestClient': 'fa-exchange-alt',
  'std:Database': 'fa-database',
  'std:Mail': 'fa-envelope',
  'std:Page': 'fa-tv',
  'std:Trigger': 'fa-share-square',
  'std:Program': 'fa-scroll',
  'std:Manual': 'fa-hand-point-right',
  'std:Receive': 'fa-caret-square-down',
  'std:Rule': 'fa-table',
  'std:Send': 'fa-caret-square-up',
  'std:Service': 'fa-cog',
  'std:Script': 'fa-scroll'
};

const resolveIcon = (iconUri: string): string | undefined => {
  if (iconUri.includes('webContent')) {
    return iconUri;
  } else if (iconUri.startsWith('ext:')) {
    return 'fa-puzzle-piece';
  }
  return StandardIcons[iconUri];
};

export default resolveIcon;
