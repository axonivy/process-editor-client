export type ValuesAsUnion<T> = {
  [V in keyof T]: T[V];
}[keyof T];

export type ValuesAsUnionDeep<T> = {
  [V in keyof T]: T[V] extends object ? ValuesAsUnionDeep<T[V]> : T[V];
}[keyof T];

declare const brand: unique symbol;

export type Brand<T, TBrand> = T & { [brand]: TBrand };

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
