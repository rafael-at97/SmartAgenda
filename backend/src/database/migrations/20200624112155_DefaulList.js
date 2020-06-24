
exports.up = function(knex) {
    return knex('lists')
    .insert({name:'00_DEFAULT_00', color: '#ffffff', parentID: 1});
};

exports.down = function(knex) {
  return  knex('lists').where('listID', 1).delete();
};
