exports.up = function(knex) {
    return knex.schema.createTable('lists', function (table) {
        table.increments('listID');
        table.string('name').notNullable();
        table.string('color');
        table.integer('parentID').notNullable();
        table.foreign('parentID').references('listID').inTable('lists');
    });
};

exports.down = function(knex) {
    knex.schema.dropTable('lists');
};
