import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').notNullable().index()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.timestamp('date').notNullable()
    table.boolean('inside_the_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
