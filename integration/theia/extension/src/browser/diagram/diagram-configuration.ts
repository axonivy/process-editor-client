import '../../../css/colors.css';
import 'sprotty-theia/css/theia-sprotty.css';

import {
  GLSPTheiaDiagramConfiguration
} from '@eclipse-glsp/theia-integration/lib/browser/diagram/glsp-theia-diagram-configuration';
import { BreakpointAction, breakpointModule, createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container, injectable } from 'inversify';
import { configureActionHandler } from 'sprotty';

import { IvyProcessLanguage as IvyProcessLanguage } from '../../common/ivy-process-language';
import { BreakpointActionHandler } from '../breakpoint/breakpoint-action-handler';
import { IvyDiagramServer } from './diagram-server';

@injectable()
export class IvyDiagramConfiguration extends GLSPTheiaDiagramConfiguration {

  diagramType: string = IvyProcessLanguage.DiagramType;

  doCreateContainer(widgetId: string): Container {
    const container = createIvyDiagramContainer(widgetId);
    this.configureDiagramServer(container, IvyDiagramServer);
    configureActionHandler(container, BreakpointAction.KIND, BreakpointActionHandler);
    container.load(breakpointModule);
    return container;
  }
}
