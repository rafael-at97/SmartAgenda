exports.up = function(knex) {
    return knex.schema.createTable('tasks', function (table) {
        table.increments('taskID').primary();
        table.string('title', 64).notNullable();
        table.string('description');
        table.boolean('done').notNullable();
        table.integer('parentID').notNullable();
        table.foreign('parentID').references('listID').inTable('lists');
        table.unique(['parentID', 'title']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks');
};