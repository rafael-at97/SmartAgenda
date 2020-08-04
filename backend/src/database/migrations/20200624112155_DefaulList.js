exports.up = function(knex) {
    return knex('lists').insert({title:'00_DEFAULT_00', color: '0xffffff', parentID: 1});
};

exports.down = function(knex) {
    return  knex('lists').where('listID', 1).delete();
};
