import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> 
{
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.boolean('done').notNullable();
        table.integer('parent');
        table.foreign('parent').references('id').inTable('tasks').onDelete('CASCADE');
    });
}


export async function down(knex: Knex): Promise<void> 
{
    return knex.schema.dropTable('tasks');
}

