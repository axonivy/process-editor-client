import '../../../css/diagram.css';
import 'sprotty-theia/css/theia-sprotty.css';

import {
    GLSPTheiaDiagramConfiguration
} from '@eclipse-glsp/theia-integration/lib/browser/diagram/glsp-theia-diagram-configuration';
import { createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container, injectable } from 'inversify';

import { IvyProcessLanguage as IvyProcessLanguage } from '../../common/ivy-process-language';
import { IvyDiagramServer } from './diagram-server';

@injectable()
export class IvyDiagramConfiguration extends GLSPTheiaDiagramConfiguration {

    diagramType: string = IvyProcessLanguage.DiagramType;

    doCreateContainer(widgetId: string): Container {
        const container = createIvyDiagramContainer(widgetId);
        this.configureDiagramServer(container, IvyDiagramServer);
        return container;
    }
}
