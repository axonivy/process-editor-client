import { ToolBarButton, ToolBarButtonProvider } from '@ivyteam/process-editor';
import { OpenInscriptionAction } from '../open-inscription/open-inscription-handler';
import { OpenDataClassAction } from '../open-data-class/open-data-class';
import { injectable } from 'inversify';
import { OpenInsertConnectorAction } from '../open-insert-connector/open-insert-connector';

class InscribeProcessButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-solid fa-pen',
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
    public readonly icon = 'fa-solid fa-table',
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

export class OpenInsertConnectorButton implements ToolBarButton {
  static readonly ID = 'insertconnectorbutton';
  constructor(
    public readonly icon = 'fa-solid fa-store',
    public readonly title = 'Insert Connector',
    public readonly sorting = 'E',
    public readonly visible = false,
    public readonly action = () => new OpenInsertConnectorAction(),
    public readonly id = OpenInsertConnectorButton.ID
  ) {}
}

@injectable()
export class OpenInsertConnectorButtonProvider implements ToolBarButtonProvider {
  button(elementIds: () => string[]): ToolBarButton {
    return new OpenInsertConnectorButton();
  }
}
