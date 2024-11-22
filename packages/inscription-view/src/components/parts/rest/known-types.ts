import type { InputType, RestPayload } from '@axonivy/process-editor-inscription-protocol';

const BYTE_TYPE = '[B' as const;
const BINARY_INPUTS = ['java.io.File', 'java.io.InputStream', BYTE_TYPE] as const;
export type BinaryType = (typeof BINARY_INPUTS)[number];

export const evalInputType = (payload: RestPayload, currentType: string, defaultType: BinaryType) => {
  if (BINARY_INPUTS.includes(payload.type.type.fullQualifiedName as BinaryType)) {
    if (BINARY_INPUTS.includes(currentType as BinaryType)) {
      // keep users choice!
      return currentType;
    }
    return defaultType;
  }
  return payload.type.type.fullQualifiedName;
};

export const typesSupportBinary = (types: string[]) => {
  return types.includes(BYTE_TYPE);
};

const FORM_TYPES: readonly string[] = ['multipart/form-data', 'application/x-www-form-urlencoded'] as const;

export const evalBodyType = (mediaType: string): InputType => {
  return isFormMedia(mediaType) ? 'FORM' : 'ENTITY';
};

export const isFormMedia = (mediaType?: string) => {
  if (mediaType) {
    return FORM_TYPES.includes(mediaType);
  }
  return false;
};
