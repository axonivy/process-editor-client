import { memo } from 'react';
import Part from './part/Part';
import { useGeneralPart } from '../parts/name/GeneralPart';

const NameEditor = memo(({ hideTags }: { hideTags?: boolean }) => {
  const name = useGeneralPart({ hideTags });
  return <Part parts={[name]} />;
});

export default NameEditor;
