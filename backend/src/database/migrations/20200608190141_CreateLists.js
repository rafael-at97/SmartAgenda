exports.up = function(knex) {
    return knex.schema.createTable('lists', function (table) {
        table.increments('listID').primary();
        table.string('title', 32).notNullable();
        table.string('color', 6).notNullable();
        table.integer('parentID').notNullable();
        table.foreign('parentID').references('listID').inTable('lists');
        table.unique(['parentID', 'title']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('lists');
};
