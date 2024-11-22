import type { REST_PARAM_KIND, RestParameter, ScriptMappings } from '@axonivy/process-editor-inscription-protocol';

export type ParameterKind = keyof typeof REST_PARAM_KIND;

export type Parameter = {
  kind: ParameterKind;
  name: string;
  expression: string;
  known: boolean;
  doc?: string;
  type?: string;
};

export namespace Parameter {
  export function of(parameters: RestParameter[], foundParams: string[], configs: ScriptMappings, kind: ParameterKind): Parameter[] {
    const params = parameters.map<Parameter>(param => {
      return {
        kind,
        name: param.name,
        expression: '',
        known: true,
        doc: `${param.required ? '* required\n' : ''}${param.doc}`,
        type: param.type.fullQualifiedName
      };
    });

    for (const found of foundParams) {
      if (params.find(p => p.name === found) === undefined) {
        params.push({ kind, name: found, expression: '', known: true });
      }
    }

    Object.entries(configs).forEach(([key, value]) => {
      for (const p of params) {
        if (p.name === key) {
          p.expression = value;
          return;
        }
      }
      params.push({ kind, name: key, expression: value, known: false });
    });
    return params;
  }

  export function update(params: Parameter[], rowIndex: number, columnId: string, value: string): Parameter[] {
    return params.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          [columnId]: value
        };
      }
      return row;
    });
  }

  export function to(props: Parameter[], kind: ParameterKind): ScriptMappings {
    const mappings: ScriptMappings = {};
    props.filter(p => p.kind === kind).forEach(p => (mappings[p.name] = p.expression));
    return mappings;
  }
}
