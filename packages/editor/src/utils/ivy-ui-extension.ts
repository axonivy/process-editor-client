import { AbstractUIExtension } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export abstract class IvyUIExtension extends AbstractUIExtension {
  static UI_EXTENSION_CLASS = 'ui-extension';

  protected get diagramContainerId(): string {
    return this.options.baseDiv;
  }

  protected get parentContainerSelector(): string {
    return '#' + this.diagramContainerId;
  }

  protected get containerSelector(): string {
    return '#' + this.id();
  }

  protected get initialized(): boolean {
    return !!this.containerElement;
  }

  protected initialize(): boolean {
    if (this.initialized) {
      return true;
    }
    try {
      this.containerElement = this.getOrCreateContainer();
      this.initializeContainer(this.containerElement);
      this.initializeContents(this.containerElement);
    } catch (error) {
      const msg = error instanceof Error ? error.message : `Could not retrieve container element for UI extension ${this.id}`;
      this.logger.error(this, msg);
      return false;
    }
    return true;
  }

  protected getOrCreateContainer(): HTMLElement {
    if (this.containerElement) {
      return this.containerElement;
    }
    const existingContainer = this.getContainer();
    if (existingContainer) {
      return existingContainer;
    }
    const parent = this.getParentContainer();
    if (!parent || !parent.isConnected) {
      throw new Error(`Could not obtain attached parent for initializing UI extension ${this.id}`);
    }
    const container = this.createContainer(parent);
    this.insertContainerIntoParent(container, parent);
    return container;
  }

  protected getContainer(): HTMLElement | null {
    return document.querySelector<HTMLElement>(this.containerSelector);
  }

  protected createContainer(parent: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.id = parent.id + '_' + this.id();
    return container;
  }

  protected initializeContainer(container: HTMLElement): void {
    container.classList.add(IvyUIExtension.UI_EXTENSION_CLASS, this.containerClass());
  }

  protected getParentContainer(): HTMLElement {
    return document.querySelector<HTMLElement>(this.parentContainerSelector)!;
  }

  protected insertContainerIntoParent(container: HTMLElement, parent: HTMLElement): void {
    parent.insertBefore(container, parent.firstChild);
  }

  protected setContainerVisible(visible: boolean): void {
    if (visible) {
      this.containerElement?.classList.remove('hidden');
    } else {
      this.containerElement?.classList.add('hidden');
    }
  }

  protected isContainerVisible(): boolean {
    return this.containerElement && !this.containerElement.classList.contains('hidden');
  }

  protected toggleContainerVisible(): void {
    this.setContainerVisible(!this.isContainerVisible());
  }
}
