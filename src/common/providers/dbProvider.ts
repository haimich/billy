import { get } from './settingsProvider'

// let db

// export async function initDb(): Promise<any> {
// 	const knexConfig = await get('knex')
// 	db = await knex(knexConfig)
// }

export async function setupDb() {
  const config = await get('knex')
}