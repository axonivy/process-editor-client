export type DeepPartial<T> = T extends Array<infer U> ? Array<DeepPartial<U>> : { [A in keyof T]?: DeepPartial<T[A]> };
