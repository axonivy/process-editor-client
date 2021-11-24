import '../../../css/colors.css';
import 'sprotty-theia/css/theia-sprotty.css';

import { configureDiagramServer, GLSPDiagramConfiguration } from '@eclipse-glsp/theia-integration';
import { BreakpointAction, breakpointModule, createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container, injectable } from '@theia/core/shared/inversify';
import { configureActionHandler } from 'sprotty';

import { IvyProcessLanguage as IvyProcessLanguage } from '../../common/ivy-process-language';
import { BreakpointActionHandler } from '../breakpoint/breakpoint-action-handler';
import { IvyDiagramServer } from './diagram-server';

@injectable()
export class IvyDiagramConfiguration extends GLSPDiagramConfiguration {
  diagramType: string = IvyProcessLanguage.diagramType;

  doCreateContainer(widgetId: string): Container {
    const container = createIvyDiagramContainer(widgetId);
    configureDiagramServer(container, IvyDiagramServer);
    configureActionHandler(container, BreakpointAction.KIND, BreakpointActionHandler);
    container.load(breakpointModule);
    return container;
  }
}
