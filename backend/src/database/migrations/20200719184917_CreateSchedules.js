exports.up = function(knex) {
    return knex.schema.createTable('schedules', function (table) {
        table.increments('scheduleID').primary();
        table.date('date').notNullable();
        table.time('startTime').notNullable();
        table.time('duration').notNullable();
        table.integer('repetitionType');
        table.date('repetitionEnd');
        table.integer('parentID').notNullable();
        table.foreign('parentID').references('taskID').inTable('tasks');
    });    
};

exports.down = function(knex) {
    return knex.schema.dropTable('schedules');  
};
