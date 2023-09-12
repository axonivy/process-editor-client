import {
  GArgument,
  GIssueMarker,
  GLSPActionDispatcher,
  hasArguments,
  isWithEditableLabel,
  JsonAny,
  SChildElement,
  SEdge,
  SModelElement,
  TYPES
} from '@eclipse-glsp/client';
import { QuickAction, SingleQuickActionProvider } from '../quick-action';
import { ShowInfoQuickActionMenuAction } from '../quick-action-menu-ui';
import { injectable, inject } from 'inversify';
import { IVY_TYPES } from '../../../types';
import { IvyViewerOptions } from '../../../options';
import { LaneNode } from '../../../diagram/model';
import { IvyIcons } from '@axonivy/editor-icons/lib';

@injectable()
export class InfoQuickActionProvider extends SingleQuickActionProvider {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(IVY_TYPES.IvyViewerOptions) protected readonly options: IvyViewerOptions;

  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof LaneNode || (this.options.hideSensitiveInfo && element instanceof SEdge)) {
      return undefined;
    }
    return {
      icon: IvyIcons.Information,
      title: 'Information (I)',
      location: 'Left',
      sorting: 'B',
      action: ShowInfoQuickActionMenuAction.create({
        elementId: element.id,
        markers: this.markers(element),
        title: this.name(element),
        text: GArgument.getString(element, 'desc'),
        info: this.info(element)
      }),
      letQuickActionsOpen: true,
      readonlySupport: true,
      shortcut: 'KeyI'
    };
  }

  private info(element: SModelElement): JsonAny | undefined {
    return hasArguments(element) ? element.args['info'] : undefined;
  }

  private name(element: SModelElement): string | undefined {
    let elementName = '';
    if (isWithEditableLabel(element) && element.editableLabel) {
      elementName = element.editableLabel?.text;
    }
    const varName = this.nameAddition(element);
    if (varName) {
      elementName += varName;
    }
    return elementName.length > 0 ? elementName.trim() : undefined;
  }

  private nameAddition(element: SModelElement): string | undefined {
    const varName = GArgument.getString(element, 'varName');
    if (varName) {
      return ` [${varName}]`;
    }
    const outerElement = GArgument.getString(element, 'outerElement');
    if (outerElement) {
      return ` [${outerElement}]`;
    }
    return undefined;
  }

  private markers(element: SModelElement): GIssueMarker[] {
    if (element instanceof SChildElement) {
      return element.children.filter(child => child instanceof GIssueMarker).map(child => child as GIssueMarker);
    }
    return [];
  }
}
