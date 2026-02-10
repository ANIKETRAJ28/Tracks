import type { Pool } from 'pg';

export type DBClient = Pool;
export * from './util/dbPool.util';
