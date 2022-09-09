import {
  GArgument,
  GIssueMarker,
  GLSPActionDispatcher,
  isWithEditableLabel,
  SChildElement,
  SEdge,
  SModelElement,
  TYPES
} from '@eclipse-glsp/client';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action';
import { ShowInfoQuickActionMenuAction } from '../quick-action-menu-ui';
import { injectable, inject } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { IVY_TYPES } from '../../../types';
import { IvyViewerOptions } from '../../../options';
import { LaneNode } from '../../../diagram/model';
import { StreamlineIcons } from '../../../StreamlineIcons';

@injectable()
export class InfoQuickActionProvider extends SingleQuickActionProvider {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(IVY_TYPES.IvyViewerOptions) protected readonly options: IvyViewerOptions;

  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof LaneNode || (this.options.hideSensitiveInfo && element instanceof SEdge)) {
      return undefined;
    }
    return new InfoQuickAction(
      element.id,
      this.markers(element),
      this.name(element),
      GArgument.getString(element, 'desc'),
      GArgument.getString(element, 'outerElement')
    );
  }

  name(element: SModelElement): string | undefined {
    const varName = this.edgeVarName(element);
    let elementName = '';
    if (varName) {
      elementName = varName;
    }
    if (isWithEditableLabel(element) && element.editableLabel) {
      elementName += element.editableLabel?.text;
    }
    return elementName.length > 0 ? elementName : undefined;
  }

  edgeVarName(element: SModelElement): string | undefined {
    const varName = GArgument.getString(element, 'varName');
    if (varName) {
      return `[${varName}] `;
    }
    return undefined;
  }

  markers(element: SModelElement): GIssueMarker[] {
    if (element instanceof SChildElement) {
      return element.children.filter(child => child instanceof GIssueMarker).map(child => child as GIssueMarker);
    }
    return [];
  }
}

class InfoQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly markers: GIssueMarker[],
    public readonly textTitle?: string,
    public readonly text?: string,
    public readonly outerElemet?: string,
    public readonly icon = StreamlineIcons.Information,
    public readonly title = 'Information (I)',
    public readonly location = QuickActionLocation.Left,
    public readonly sorting = 'B',
    public readonly action = ShowInfoQuickActionMenuAction.create({
      elementId: elementId,
      markers: markers,
      title: textTitle,
      text: text,
      outerElement: outerElemet
    }),
    public readonly letQuickActionsOpen = true,
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyI'
  ) {}
}
