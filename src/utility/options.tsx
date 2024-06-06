export type TuppleOf<
  T,
  N extends number,
  R extends any[] = []
> = R["length"] extends N ? R : TuppleOf<T, N, [...R, T]>;

export type MergeWithOptional<T, U> = {
  [K in keyof T & keyof U]: T[K] | U[K];
} & {
  [K in Exclude<keyof T, keyof U>]?: T[K];
} & {
  [K in Exclude<keyof U, keyof T>]?: U[K];
};

export type MergeWithOptional3<T, U, J> = {
  [K in (keyof T & keyof U & keyof J)]: T[K] | U[K] | J[K];
} & {
  [K in Exclude<keyof T & keyof U, keyof J>]?: T[K] | U[K];
} & {
  [K in Exclude<keyof U & keyof J, keyof T>]?: U[K] | J[K];
} & {
  [K in Exclude<keyof J & keyof T, keyof U>]?: J[K] | T[K];
} & {
  [K in Exclude<keyof T, keyof U | keyof J>]?: T[K];
} & {
  [K in Exclude<keyof U, keyof J | keyof T>]?: U[K];
} & {
  [K in Exclude<keyof J, keyof T | keyof U>]?: J[K];
};

export type StrVec<N extends number> = TuppleOf<string, N>;
export type ERIM_BASEMAP_NUMBER = 3;
export type ERIM_OBJECT_NUMBER = 3;

export const PowerItem: TuppleOf<{ src: string }, ERIM_OBJECT_NUMBER> = [
  { src: "/custom/icon_0.png" },
  { src: "/custom/icon_1.png" },
  { src: "/custom/icon_2.png" },
];

export const basemap: TuppleOf<
  { title: string; image: string },
  ERIM_BASEMAP_NUMBER
> = [
  { title: "streets-vector", image: "/BaseMapImages/streets.jpeg" },
  { title: "topo-vector", image: "/BaseMapImages/top-vector.jpeg" },
  { title: "hybrid", image: "/BaseMapImages/hybrid.jpeg" },
];
