import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> 
{
    return knex('tasks').insert(
        {
            id: 0,
            title: 'root',
            description: 'Root',
            done: false
        }
    ).then(function(result) {
        return knex('tasks').where('id', '=', 0)
                            .update({parent: 0});
    });
}


export async function down(knex: Knex): Promise<void> 
{
    return knex('tasks').where('id', 0).del();   
}
