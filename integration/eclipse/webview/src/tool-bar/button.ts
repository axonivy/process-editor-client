import { ToolBarButton, ToolBarButtonProvider, ToolBarButtonLocation } from '@ivyteam/process-editor';
import { OpenInscriptionAction } from '../open-inscription/open-inscription-handler';
import { OpenDataClassAction } from '../open-data-class/open-data-class';
import { injectable } from 'inversify';
import { OpenInsertConnectorAction } from '../open-insert-connector/open-insert-connector';

class InscribeProcessButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-solid fa-pen',
    public readonly title = 'Inscribe Process',
    public readonly sorting = 'D',
    public readonly action = () => OpenInscriptionAction.create(''),
    public readonly location = ToolBarButtonLocation.Right,
    public readonly readonly = true
  ) {}
}

@injectable()
export class InscribeProcessButtonProvider implements ToolBarButtonProvider {
  button(): ToolBarButton {
    return new InscribeProcessButton();
  }
}

class OpenDataClassButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-solid fa-table',
    public readonly title = 'Open Data Class (C)',
    public readonly sorting = 'E',
    public readonly action = () => OpenDataClassAction.create(),
    public readonly location = ToolBarButtonLocation.Right,
    public readonly readonly = true
  ) {}
}

@injectable()
export class OpenDataClassButtonProvider implements ToolBarButtonProvider {
  button(): ToolBarButton {
    return new OpenDataClassButton();
  }
}

export class OpenInsertConnectorButton implements ToolBarButton {
  constructor(
    public readonly icon = 'fa-solid fa-plug',
    public readonly title = 'Connector',
    public readonly sorting = 'F',
    public readonly action = () => OpenInsertConnectorAction.create(),
    public readonly id = 'insertconnectorbutton',
    public readonly location = ToolBarButtonLocation.Middle,
    public readonly switchFocus = true,
    public readonly showTitle = true,
    public readonly isNotMenu = true
  ) {}
}

@injectable()
export class OpenInsertConnectorButtonProvider implements ToolBarButtonProvider {
  button(): ToolBarButton {
    return new OpenInsertConnectorButton();
  }
}
