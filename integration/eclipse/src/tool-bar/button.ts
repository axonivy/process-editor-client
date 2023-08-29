import { ToolBarButton, ToolBarButtonProvider, ToolBarButtonLocation, StreamlineIcons } from '@axonivy/process-editor';
import { OpenDataClassAction, OpenInscriptionAction, OpenInsertExtensionAction } from '@axonivy/process-editor-protocol';
import { injectable } from 'inversify';

class InscribeProcessButton implements ToolBarButton {
  constructor(
    public readonly icon = StreamlineIcons.PenEdit,
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
    public readonly icon = StreamlineIcons.DataModels,
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

export class OpenInsertExtensionButton implements ToolBarButton {
  constructor(
    public readonly icon = StreamlineIcons.Extensions,
    public readonly title = 'Extensions',
    public readonly sorting = 'F',
    public readonly action = () => OpenInsertExtensionAction.create(),
    public readonly id = 'insertextensionbutton',
    public readonly location = ToolBarButtonLocation.Middle,
    public readonly switchFocus = true,
    public readonly showTitle = true,
    public readonly isNotMenu = true
  ) {}
}

@injectable()
export class OpenInsertExtensionButtonProvider implements ToolBarButtonProvider {
  button(): ToolBarButton {
    return new OpenInsertExtensionButton();
  }
}
