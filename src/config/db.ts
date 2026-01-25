import { DataSource, type DataSourceOptions } from 'typeorm'
import dotenv from 'dotenv'
import appRootPath from 'app-root-path'
import path from 'path'

dotenv.config()

const rootDir = appRootPath.toString()

const postgresConnectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  entities: [path.join(rootDir, 'src/models/**/*.entity.ts')],
  migrations: [path.join(rootDir, 'src/migrations/**/*.ts')],
  logging: false,
}

const AppDataSource = new DataSource(postgresConnectionOptions)

export default AppDataSource
