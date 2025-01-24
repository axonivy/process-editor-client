import type { ConditionData, ConditionGroupData, ConditionMode, LogicOperator, LogicOperators, Operators } from '@axonivy/ui-components';

export const operators: Operators = {
  'equal to': '==',
  'not equal to': '!=',
  'is true': 'isTrue',
  'is false': 'isFalse',
  'is empty': 'isEmpty',
  'is not empty': 'isNotEmpty',
  'less than': '<',
  'greater than': '>',
  'less or equal to': '<=',
  'greater or equal to': '>='
};

export const logicOperators: LogicOperators = {
  and: '&&',
  or: '||'
};

export const generateConditionString = (conditionMode: ConditionMode, conditionGroups: ConditionGroupData[]) => {
  if (conditionMode === 'always-true') {
    return 'true';
  }
  if (conditionMode === 'always-false') {
    return 'false';
  }
  const wrapInQuotesIfNeeded = (arg: string) => {
    const isNumeric = /^\d+$/.test(arg);
    return arg.includes('.') || arg.startsWith('in') || arg.startsWith('out') || isNumeric ? arg : `"${arg}"`;
  };

  const groupStrings = conditionGroups.map((group, index) => {
    if (conditionMode === 'basic-condition' && index > 0) return '';
    const conditions = group.conditions
      .map((con, conditionIndex) => {
        const formattedArg1 = wrapInQuotesIfNeeded(con.argument1);
        const formattedArg2 = wrapInQuotesIfNeeded(con.argument2);
        const logicalOp = getLogicalOperator(conditionIndex, group.conditions.length, con.logicalOperator);
        return formatCondition(con, formattedArg1, formattedArg2, logicalOp);
      })
      .join('');

    const logicGroupOp = index < conditionGroups.length - 1 ? logicOperators[group.logicalOperator].toLowerCase() : '';
    return conditionGroups.length === 1 || conditionMode === 'basic-condition'
      ? conditions
      : `(${conditions})${logicGroupOp ? ` ${logicGroupOp} ` : ''}`;
  });

  return groupStrings.join('');
};

const getLogicalOperator = (index: number, totalConditions: number, logicalOperator: LogicOperator) => {
  return index < totalConditions - 1 ? ` ${logicOperators[logicalOperator].toLowerCase()} ` : '';
};

const formatCondition = (condition: ConditionData, formattedArg1: string, formattedArg2: string, logicalOp: string) => {
  switch (condition.operator) {
    case 'is true':
      return `${formattedArg1}${logicalOp}`;
    case 'is false':
      return `!${formattedArg1}${logicalOp}`;
    case 'is empty':
      return `${formattedArg1}.isEmpty()${logicalOp}`;
    case 'is not empty':
      return `!${formattedArg1}.isEmpty()${logicalOp}`;
    default:
      return `${formattedArg1} ${operators[condition.operator]} ${formattedArg2}${logicalOp}`;
  }
};
