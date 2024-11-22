import { Condition } from '../database/Condition';
import { Limit } from '../database/Limit';
import { TableReadFields } from '../database/TableReadFields';
import { TableSort } from '../database/TableSort';

export const QueryRead = () => (
  <>
    <TableReadFields />
    <Condition />
    <TableSort />
    <Limit />
  </>
);
