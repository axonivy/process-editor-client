import { CollapsableUtil, TableUtil, render, screen } from 'test-utils';
import { TableReadFields } from './TableReadFields';
import { describe, test, expect } from 'vitest';

describe('TableReadFields', () => {
  test('all', async () => {
    render(<TableReadFields />);
    await CollapsableUtil.assertClosed('Fields');
    await CollapsableUtil.toggle('Fields');
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('data', async () => {
    render(<TableReadFields />, {
      wrapperProps: {
        data: { config: { query: { sql: { select: ['test'] } } } },
        meta: {
          columns: [
            { name: 'test', type: 'VarChar(10)', ivyType: 'String' },
            { name: 'hi', type: 'bool', ivyType: 'Boolean' }
          ]
        }
      }
    });
    await CollapsableUtil.assertOpen('Fields');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    TableUtil.assertHeaders(['Column', 'Read']);
    await screen.findByText(': VarChar(10)');
    TableUtil.assertRows(['test : VarChar(10) ✅', 'hi : bool']);
  });
});
