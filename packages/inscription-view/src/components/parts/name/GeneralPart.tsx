import { IvyIcons } from '@axonivy/ui-icons';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import Collapsible from '../../widgets/collapsible/Collapsible';
import Fieldset from '../../widgets/fieldset/Fieldset';
import Textarea from '../../widgets/input/Textarea';
import Tags from '../../widgets/tag/Tags';
import DocumentTable from './document/DocumentTable';
import { useGeneralData } from './useGeneralData';

export function useGeneralPart(options?: { hideTags?: boolean; disableName?: boolean }): PartProps {
  const { data, initData, resetData } = useGeneralData();
  const currentData = [data.name, data.description, data.docs, data.tags];
  const state = usePartState(['', '', [], []], currentData, []);
  const dirty = usePartDirty([initData.name, initData.description, initData.docs, initData.tags], currentData);
  return {
    name: 'General',
    state,
    reset: { dirty, action: () => resetData() },
    content: <GeneralPart hideTags={options?.hideTags} disableName={options?.disableName} />,
    icon: IvyIcons.ChangeType
  };
}

const GeneralPart = ({ hideTags, disableName }: { hideTags?: boolean; disableName?: boolean }) => {
  const { data, update } = useGeneralData();
  return (
    <>
      <Collapsible label='Name / Description' defaultOpen={data.name !== '' || data.description !== ''}>
        <Fieldset label='Display name'>
          <Textarea maxRows={3} disabled={!!disableName} value={data.name} onChange={change => update('name', change)} />
        </Fieldset>
        <Fieldset label='Description'>
          <Textarea maxRows={10} value={data.description} onChange={change => update('description', change)} />
        </Fieldset>
      </Collapsible>

      <DocumentTable data={data.docs} onChange={change => update('docs', change)} />

      {!hideTags && (
        <Collapsible label='Tags' defaultOpen={data.tags !== undefined && data.tags.length > 0}>
          <Tags tags={data.tags ?? []} onChange={change => update('tags', change)} />
        </Collapsible>
      )}
    </>
  );
};
