import type { ScriptMappings } from '@axonivy/process-editor-inscription-protocol';

export type Property = {
  name: string;
  expression: string;
};

export namespace Property {
  export function of(props: ScriptMappings): Property[] {
    return Object.entries(props).map(p => {
      return { name: p[0], expression: p[1] };
    });
  }

  export function update(props: Property[], rowIndex: number, columnId: string, value: string): Property[] {
    return props.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          [columnId]: value
        };
      }
      return row;
    });
  }

  export function to(props: Property[]): ScriptMappings {
    const mappings: ScriptMappings = {};
    props.forEach(p => (mappings[p.name] = p.expression));
    return mappings;
  }
}
