import { ToolBarButton, ToolBarButtonProvider } from '@ivyteam/process-editor';
import { OpenInscriptionAction } from '../open-inscription/open-inscription-handler';
import { OpenDataClassAction } from '../open-data-class/open-data-class';
import { injectable } from 'inversify';

class InscribeProcessButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-pen',
    public readonly title = 'Inscribe Process (I)',
    public readonly sorting = 'D',
    public readonly visible = true,
    public readonly action = () => new OpenInscriptionAction('')
  ) {}
}

@injectable()
export class InscribeProcessButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new InscribeProcessButton();
  }
}

class OpenDataClassButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-table',
    public readonly title = 'Open Data Class (C)',
    public readonly sorting = 'E',
    public readonly visible = true,
    public readonly action = () => new OpenDataClassAction()
  ) {}
}

@injectable()
export class OpenDataClassButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new OpenDataClassButton();
  }
}
