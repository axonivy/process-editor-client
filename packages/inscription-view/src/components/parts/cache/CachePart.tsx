import type { CacheData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../components/editors/part/usePart';
import { useCacheData } from './useCacheData';
import { PathContext, useValidations } from '../../../context';
import { Collapsible, Radio } from '../../../components/widgets';
import { CacheLifetime } from './CacheLifetime';

export function useCachePart(): PartProps {
  const { config, defaultConfig, initConfig, reset } = useCacheData();
  const compareData = (data: CacheData) => [data.cache];
  const validation = useValidations(['cache']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Cache', state, reset: { dirty, action: () => reset() }, content: <CachePart /> };
}

const CachePart = () => {
  const { config, update, updateGroup, updateEntry } = useCacheData();
  return (
    <PathContext path='cache'>
      <Radio
        value={config.cache.mode}
        onChange={change => update('mode', change)}
        items={[
          { label: 'Do not cache', value: 'DO_NOT_CACHE', description: 'Does not use caching at all.' },
          { label: 'Cache', value: 'CACHE', description: 'Use if you call an operation that only reads data.' },
          { label: 'Invalidate Cache', value: 'INVALIDATE_CACHE', description: 'Use if you call an operation that modifies data' }
        ]}
        style={{ paddingInline: 'var(--size-2)' }}
      />
      {config.cache.mode !== 'DO_NOT_CACHE' && (
        <>
          <Collapsible label='Scope' defaultOpen={true}>
            <Radio
              value={config.cache.scope}
              onChange={change => update('scope', change)}
              items={[
                { label: 'Session', value: 'SESSION', description: 'Use this option to cache user specific data.' },
                { label: 'Application', value: 'APPLICATION', description: 'Use this option to cache global data.' }
              ]}
            />
          </Collapsible>
          <CacheLifetime
            path='group'
            label='Group'
            description='Give the group a name that represents the entity of the result data.'
            config={config.cache.group}
            updater={updateGroup}
            cacheMode={config.cache.mode}
          />
          <CacheLifetime
            path='entry'
            label='Entry'
            description='Give the entry a name that represents the result data set (query).'
            config={config.cache.entry}
            updater={updateEntry}
            cacheMode={config.cache.mode}
          />
        </>
      )}
    </PathContext>
  );
};
