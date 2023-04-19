import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary()
      table.text('name').notNullable()
    })
    .alterTable('meals', (table) => {
      table.dropColumn('session_id')
      table.uuid('user_id').index()
      table.foreign('user_id').references('id').inTable('users')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users').alterTable('meals', (table) => {
    table.dropColumn('user_id')
  })
}
