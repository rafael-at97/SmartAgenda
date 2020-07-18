const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const {name, color, parentID} = request.body;       
        const [list_id] = await connection('lists').insert({
            name, color, parentID
        });

        return response.json( {list_id} );
    },

    async index(request, response) {
        const {id} = request.params;
        var lists  = [], tasks = [];

        if(id) {
            lists = await connection('lists').where('parentID',id).whereNot('listID', id).select('*');
            tasks = await connection('tasks').where('parentID', id).select('*');
        } else {
            lists = await connection('lists').select('*');
        }
        

        return response.json({lists,tasks});
    },

    async delete(request, response) {
        const {id} = request.params;

        await connection('tasks').where('parentID', id).delete();
        await connection('lists').where('parentID', id).whereNot('listID', 1).delete();
        await connection('lists').where('listID', id).whereNot('listId', 1).delete();
        
        return response.status(204).send();  
    },
    
}