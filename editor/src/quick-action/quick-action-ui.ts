/********************************************************************************
 * Copyright (c) 2019-2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
  AbstractUIExtension,
  Action,
  Bounds,
  BoundsAware,
  getAbsoluteClientBounds,
  GLSP_TYPES,
  IActionDispatcherProvider,
  isNotUndefined,
  ORIGIN_POINT,
  Point,
  SetUIExtensionVisibilityAction,
  SModelElement,
  SModelRoot,
  TYPES,
  ViewerOptions
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import { DOMHelper } from 'sprotty/lib/base/views/dom-helper';

import { createIcon } from '../tool-palette/tool-palette';
import { isQuickActionAware } from './model';
import { IVY_TYPES, QuickActionHandleLocation, QuickActionProvider } from './quick-action';

@injectable()
export class QuickActionUI extends AbstractUIExtension implements SelectionListener {
  static readonly ID = 'quickActionsUi';

  @inject(TYPES.IActionDispatcherProvider) public actionDispatcherProvider: IActionDispatcherProvider;
  @inject(TYPES.ViewerOptions) protected viewerOptions: ViewerOptions;
  @inject(TYPES.DOMHelper) protected domHelper: DOMHelper;
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders: QuickActionProvider[];

  public id(): string {
    return QuickActionUI.ID;
  }

  public containerClass(): string {
    return 'quick-actions-container';
  }

  @postConstruct()
  postConstruct(): void {
    this.selectionService.register(this);
  }

  protected initializeContents(containerElement: HTMLElement): void {
    containerElement.style.position = 'absolute';
  }

  selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
    if (selectedElements.length === 1) {
      this.actionDispatcherProvider().then(actionDispatcher =>
        actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(QuickActionUI.ID, true, selectedElements)));
    } else {
      this.actionDispatcherProvider().then(actionDispatcher =>
        actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(QuickActionUI.ID, false)));
    }
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<SModelRoot>, ...contextElementIds: string[]): void {
    containerElement.innerHTML = '';
    const element = getQuickActionsElement(contextElementIds, root)[0];
    const elementBounds = getAbsoluteClientBounds(element, this.domHelper, this.viewerOptions);
    containerElement.style.left = `${elementBounds.x}px`;
    containerElement.style.top = `${elementBounds.y}px`;

    if (isNotUndefined(element)) {
      const quickActions = this.quickActionProviders
        .map(provider => provider.quickActionForElement(element))
        .filter(isNotUndefined);
      Object.values(QuickActionHandleLocation).forEach(loc => {
        quickActions.filter(quick => quick.location === loc)
          .sort((a, b) => a.sorting.localeCompare(b.sorting))
          .forEach((quick, position) => {
            const buttonPos = this.getPosition(elementBounds, quick.location, position);
            containerElement.appendChild(this.createQuickActionBtn(quick.icon, quick.title, buttonPos, quick.action));
          });
      });
    }
  }

  private createQuickActionBtn(icon: string, title: string, position: Point, action: Action): HTMLElement {
    const button = createIcon(['fa', icon, 'fa-xs', 'fa-fw']);
    button.title = title;
    button.onclick = () => this.actionDispatcherProvider().then(dispatcher => dispatcher.dispatch(action));
    button.style.left = `${position.x}px`;
    button.style.top = `${position.y}px`;
    return button;
  }

  protected getPosition(parentBounds: Bounds, location: QuickActionHandleLocation, position: number): Point {
    if (location === QuickActionHandleLocation.TopLeft) {
      return { x: -30 + (position * 32), y: -30 };
    } else if (location === QuickActionHandleLocation.Left) {
      return { x: -30, y: parentBounds.height / 2 - 11 };
    } else if (location === QuickActionHandleLocation.Right) {
      return { x: parentBounds.width + 10, y: -30 + (position * 32) };
    } else if (location === QuickActionHandleLocation.BottomLeft) {
      return { x: -30 + (position * 32), y: parentBounds.height + 10 };
    }
    return ORIGIN_POINT;
  }
}

function getQuickActionsElement(contextElementIds: string[], root: Readonly<SModelRoot>): (SModelElement & BoundsAware)[] {
  return contextElementIds.map(id => root.index.getById(id)).filter(isQuickActionAware);
}
