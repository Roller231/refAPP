import 'dotenv/config';
import path from 'node:path';
import { DataSource } from 'typeorm';

const isTs = __filename.endsWith('.ts');
const entitiesPath = isTs
  ? path.join(process.cwd(), 'src', 'modules', '**', '*.entity.ts')
  : path.join(process.cwd(), 'dist', 'modules', '**', '*.entity.js');
const migrationsPath = isTs
  ? path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts')
  : path.join(process.cwd(), 'dist', 'database', 'migrations', '*.js');

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'postgres',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
});
