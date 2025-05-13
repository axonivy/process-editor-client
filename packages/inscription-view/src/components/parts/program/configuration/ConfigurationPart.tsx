import type { ConfigurationData, Label, Script, Text, Widget } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../editors/part/usePart';
import { useConfigurationData } from './useConfigurationData';
import './Configuration.css';
import { Flex, Message } from '@axonivy/ui-components';
import { useValidations } from '../../../../context/useValidation';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import { Input } from '../../../widgets/input/Input';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { useTranslation } from 'react-i18next';

export function useConfigurationPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, reset } = useConfigurationData();
  const compareData = (data: ConfigurationData) => [data.userConfig];
  const validation = useValidations(['userConfig']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: t('part.program.configuration.title'),
    state,
    reset: { dirty, action: () => reset() },
    content: <ConfigurationPart />
  };
}

const ConfigurationPart = () => {
  const { t } = useTranslation();
  const { config, updateUserConfig } = useConfigurationData();
  const { context } = useEditorContext();
  const editorItems = useMeta('meta/program/editor', { context, type: config.javaClass }, []).data;

  function isLabel(object: Widget): object is Label {
    return object.widgetType === 'LABEL';
  }

  function isScript(object: Widget): object is Script {
    return object.widgetType === 'SCRIPT';
  }

  function isText(object: Widget): object is Text {
    return !isLabel(object) && !isScript(object);
  }

  const renderWidgetComponent = (widget: Widget) => {
    if (isLabel(widget)) {
      const message = widget.text;

      if (widget.multiline) {
        const sentences = message.split('\n');
        return (
          <div className='info-text'>
            {sentences.map((sentence, index) => (
              <p key={index}>{sentence?.length > 0 ? sentence : ' '}</p>
            ))}
          </div>
        );
      } else {
        return <div className='info-text'>{message}</div>;
      }
    }
    if (isScript(widget)) {
      const typeToUse = widget.requiredType || IVY_SCRIPT_TYPES.STRING;

      return (
        <ScriptInput
          type={typeToUse}
          value={config.userConfig[widget.configKey]}
          aria-label={widget.configKey}
          onChange={change => updateUserConfig(widget.configKey, change)}
          browsers={['attr', 'func', 'type', 'cms']}
        />
      );
    }
    if (isText(widget)) {
      return (
        <Input
          value={config.userConfig[widget.configKey]}
          aria-label={widget.configKey}
          onChange={change => updateUserConfig(widget.configKey, change)}
        />
      );
    }
    return null;
  };

  if (editorItems.length === 0) {
    return <Message message='No configuration needed' variant='info' />;
  }

  return (
    <PathCollapsible label={t('part.program.configuration.title')} defaultOpen={true} path={'userConfig'}>
      {editorItems.map((widget, index) => (
        <Flex direction='column' className='configuration-widget' key={index}>
          {renderWidgetComponent(widget)}
        </Flex>
      ))}
    </PathCollapsible>
  );
};
