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
        const lists = await connection('lists').select('*');

        return response.json({lists});
    },

    async delete(request, response) {
        const {id} = request.params;

        if(id !== '1') {    
            const ans = await connection('lists').where('listID', id).delete();
            if (ans) {
                return response.status(204).send();
            } else {
                return response.status(405).send();
            }
            
        }

       return response.status(403).json({error: 'You cannot delete this list.'});
    },
    
}