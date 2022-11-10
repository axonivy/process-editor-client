import { configureCommand, ExportSvgCommand, ExportSvgKeyListener, ExportSvgPostprocessor, TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { IvySvgExporter } from './ivy-svg-exporter';

const ivyExportSvgModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(TYPES.KeyListener).to(ExportSvgKeyListener).inSingletonScope();
  bind(TYPES.HiddenVNodePostprocessor).to(ExportSvgPostprocessor).inSingletonScope();
  configureCommand({ bind, isBound }, ExportSvgCommand);
  bind(TYPES.SvgExporter).to(IvySvgExporter).inSingletonScope();
});

export default ivyExportSvgModule;
