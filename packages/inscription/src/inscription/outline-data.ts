import { ActivityNode, EventNode, GatewayNode } from '@axonivy/process-editor';
import { type OutlineNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { GModelRoot, GChildElement, isWithEditableLabel } from '@eclipse-glsp/client';

const iconForElement = (element: GChildElement) => {
  if (element instanceof EventNode) {
    return IvyIcons.Start;
  }
  if (element instanceof GatewayNode) {
    return IvyIcons.GatewaysGroup;
  }
  if (element instanceof ActivityNode) {
    return IvyIcons.ActivitiesGroup;
  }
  return undefined;
};

const labelForElement = (element: GChildElement) => {
  if (isWithEditableLabel(element)) {
    const label = element.editableLabel?.text;
    if (label !== undefined && label.length > 0) {
      return label.length > 30 ? label.slice(0, 30) + '...' : label;
    }
  }
  return element.id;
};

const infoForElement = (element: GChildElement) => {
  const fullType = element.type;
  const type = fullType.substring(fullType.lastIndexOf(':') + 1);
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const toOutlineNodes = (elements: Readonly<Array<GChildElement>>): Array<OutlineNode> =>
  elements
    .filter(e => e instanceof EventNode || e instanceof GatewayNode || e instanceof ActivityNode)
    .map<OutlineNode>(element => {
      const children = toOutlineNodes(element.children);
      return {
        id: element.id,
        title: labelForElement(element),
        icon: iconForElement(element),
        info: infoForElement(element),
        children
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

export const outlineNodes = (root: GModelRoot): Array<OutlineNode> => {
  const children = toOutlineNodes(root.children);
  return [
    {
      id: root.id,
      title: root.id,
      icon: IvyIcons.Process,
      info: 'Process',
      children
    }
  ];
};
