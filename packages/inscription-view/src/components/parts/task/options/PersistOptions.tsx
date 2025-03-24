import { useTranslation } from 'react-i18next';
import Checkbox from '../../../widgets/checkbox/Checkbox';
import Collapsible from '../../../widgets/collapsible/Collapsible';
import { useTaskPersistData } from './usePersistOptionsData';

const PersistOptions = () => {
  const { t } = useTranslation();
  const { config, updatePersist } = useTaskPersistData();
  const disabled = config.permission.anonymous;
  return (
    <Collapsible label={t('part.task.options')} defaultOpen={config.persistOnStart}>
      <Checkbox
        label={disabled ? t('part.task.persistDisabled') : t('part.task.persist')}
        value={config.persistOnStart}
        onChange={updatePersist}
        disabled={disabled}
      />
    </Collapsible>
  );
};

export default PersistOptions;
