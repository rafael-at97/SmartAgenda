exports.up = function(knex) {
    return knex.schema.createTable('tasks', function (table) {
        table.increments('taskID');
        table.string('title').notNullable();
        table.string('description');
        table.date('startDate').notNullable();
        table.time('startTime').notNullable();
        table.date('endDate').notNullable();
        table.time('endTime').notNullable();
        table.string('repetitionType');
        table.date('repetitionEnd');
        table.boolean('done').notNullable();
        table.integer('parentID').notNullable();
        table.foreign('parentID').references('listID').inTable('lists');
    });
};

exports.down = function(knex) {
    knex.schema.dropTable('tasks');
};
