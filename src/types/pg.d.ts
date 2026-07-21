declare module 'pg' {
  export interface QueryConfig {
    text: string;
    values?: unknown[];
  }

  export interface QueryResult<T = Record<string, unknown>> {
    rows: T[];
  }

  export interface PoolClient {
    query<T = Record<string, unknown>>(queryTextOrConfig: string | QueryConfig): Promise<QueryResult<T>>;
    release(): void;
  }

  export class Pool {
    constructor(config?: Record<string, unknown>);
    connect(): Promise<PoolClient>;
    query<T = Record<string, unknown>>(queryTextOrConfig: string | QueryConfig): Promise<QueryResult<T>>;
    end(): Promise<void>;
  }

  export class Client {
    constructor(config?: Record<string, unknown>);
    connect(): Promise<void>;
    query<T = Record<string, unknown>>(queryTextOrConfig: string | QueryConfig): Promise<QueryResult<T>>;
    end(): Promise<void>;
  }
}
