export type EmptyObject = Record<never, never>;

export interface GqlErrorLocation {
  line: number,
  column: number
};

export interface GqlError {
  message: string,
  locations?: GqlErrorLocation[]
};

export interface GqlRequest<Variables extends void | EmptyObject = void>  {
  operation: string,
  variables?: Variables
};

export interface GqlRequestCompat<Variables extends void | EmptyObject = void> {
  query: string,
  variables?: Variables
};

export interface GqlResponse<Data> {
  data?: Data,
  errors?: GqlError[]
};

export type GqlOperationType = "mutation" | "query" | "subscription";
