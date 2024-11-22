import type { IvyIcons } from '@axonivy/ui-icons';

export type IvyIconProps = {
  icon: IvyIcons;
  rotate?: 45 | 90 | 180 | 270;
};

const IvyIcon = ({ icon, rotate }: IvyIconProps) => {
  return <i className={`ivy ivy-${icon.toString().toLowerCase()} ${rotate ? `ivy-rotate-${rotate}` : ''}`} />;
};

export default IvyIcon;
