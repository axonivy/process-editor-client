import { IvyIcons } from '@axonivy/ui-icons';

export const badgePropsExpression = [
  {
    regex: /<%=[^%>]+%>/,
    icon: IvyIcons.StartProgram,
    badgeTextGen: (text: string) => text.replaceAll(/(<%=\s*)|(\s*%>)/g, '')
  }
];
