import type { CategoryPathMeta, EventCodeMeta } from '@axonivy/process-editor-inscription-protocol';

export const classifiedItemInfo = (code: EventCodeMeta | CategoryPathMeta) => {
  if (code.usage > 0) {
    if (code.process && code.process !== '<INVALID>') {
      return `${code.project} > ${code.process} (${code.usage})`;
    }
    return `${code.project} (${code.usage})`;
  }
  return undefined;
};
