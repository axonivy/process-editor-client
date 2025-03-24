import { useTranslation } from 'react-i18next';
import { deepEqual } from '../../../../utils/equals';
import Checkbox from '../../../widgets/checkbox/Checkbox';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { useTaskData } from '../useTaskData';
import TemplateSelect from './TemplateSelect';

const NotificationPart = () => {
  const { t } = useTranslation();
  const { task, defaultTask, updateNotification } = useTaskData();
  return (
    <PathCollapsible
      label={t('part.task.notification')}
      path='notification'
      defaultOpen={!deepEqual(task.notification, defaultTask.notification)}
    >
      <Checkbox
        label={t('part.task.suppress')}
        value={task.notification.suppress}
        onChange={change => updateNotification('suppress', change)}
      />
      <TemplateSelect notification={task.notification} onChange={item => updateNotification('template', item.value)} />
    </PathCollapsible>
  );
};

export default NotificationPart;
