import { get } from './settingsProvider'
import * as knex from 'knex'

export async function setupDb(): Promise<any> {
  const config = await get('knex')
  const db = knex(config)
  await db.migrate.latest()
  await db.seed.run()
}

export async function initDb(knexConfig: knex.Config): Promise<any> {
  return await knex(knexConfig)
}