export type MapKey<T> = T extends Map<infer K, unknown> ? K : never;
