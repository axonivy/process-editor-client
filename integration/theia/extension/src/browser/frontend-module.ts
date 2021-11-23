import { ContainerContext, GLSPClientContribution, GLSPTheiaFrontendModule } from '@eclipse-glsp/theia-integration';
import { CommandContribution, MenuContribution } from '@theia/core';
import { KeybindingContribution } from '@theia/core/lib/browser';
import { DiagramConfiguration } from 'sprotty-theia';

import { IvyProcessLanguage } from '../common/ivy-process-language';
import { IvyDiagramConfiguration } from './diagram/diagram-configuration';
import {
  JumpIntoCommandContribution,
  JumpIntoKeybindingContribution,
  JumpIntoMenuContribution
} from './diagram/jump-into-menu';
import { WrapToSubContribution, WrapToSubMenuContribution } from './diagram/wrap-to-sub-menu';
import { IvyGLSPClientContribution } from './glsp-client-contribution';

export class IvyTheiaFrontendModule extends GLSPTheiaFrontendModule {
  protected enableCopyPaste = true;

  bindDiagramConfiguration(context: ContainerContext): void {
    context.bind(DiagramConfiguration).to(IvyDiagramConfiguration);
  }
  readonly diagramLanguage = IvyProcessLanguage;

  configure(context: ContainerContext): void {
    context.bind(CommandContribution).to(JumpIntoCommandContribution);
    context.bind(MenuContribution).to(JumpIntoMenuContribution);
    context.bind(KeybindingContribution).to(JumpIntoKeybindingContribution);

    context.bind(CommandContribution).to(WrapToSubContribution);
    context.bind(MenuContribution).to(WrapToSubMenuContribution);
  }

  bindGLSPClientContribution(context: ContainerContext): void {
    context.bind(GLSPClientContribution).to(IvyGLSPClientContribution);
  }
}

export default new IvyTheiaFrontendModule();
