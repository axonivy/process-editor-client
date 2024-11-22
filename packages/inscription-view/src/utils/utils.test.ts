import { generateId, splitMacroExpressions, splitNewLine } from './utils';
import { test, expect } from 'vitest';

test('generateId', () => {
  expect(generateId()).toEqual('0');
  expect(generateId()).toEqual('1');
  expect(generateId()).toEqual('2');
});

test('splitNewLine', () => {
  expect(splitNewLine('')).toEqual(['']);
  expect(splitNewLine('abc')).toEqual(['abc']);
  expect(splitNewLine('abc\ndef')).toEqual(['abc', 'def']);
  expect(splitNewLine('abc\rdef')).toEqual(['abc', 'def']);
  expect(splitNewLine('abc\r\ndef')).toEqual(['abc', 'def']);
});

test('splitMacroExpressions', () => {
  expect(splitMacroExpressions('')).toEqual([]);
  expect(splitMacroExpressions('abc')).toEqual(['abc']);
  expect(splitMacroExpressions('abc <%= ivy.cms.co("hi") %>')).toEqual(['abc ', '<%= ivy.cms.co("hi") %>']);
  expect(splitMacroExpressions('abc <%= ivy.cms.co("hi") %>, hi')).toEqual(['abc ', '<%= ivy.cms.co("hi") %>', ', hi']);
  expect(splitMacroExpressions('abc <%= ivy.cms.co("hi") %>, hi <%=in.accept%>')).toEqual([
    'abc ',
    '<%= ivy.cms.co("hi") %>',
    ', hi ',
    '<%=in.accept%>'
  ]);
  expect(splitMacroExpressions('<%= ivy.cms.co("hi") %><%=in.accept%>')).toEqual(['<%= ivy.cms.co("hi") %>', '<%=in.accept%>']);
});

test('splitMacroExpressions not supported', () => {
  //The following test should result in ['abc ', '<%= ivy.cms.co("hi %>") %>']
  expect(splitMacroExpressions('abc <%= ivy.cms.co("hi %>") %>')).toEqual(['abc ', '<%= ivy.cms.co("hi %>', '") %>']);
});
