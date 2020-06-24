const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        var {title, description, startDate, startTime, endDate, endTime, 
        repetitionType, repetitionEnd, done, parentID} = request.body;
        
        if(!parentID) {
            parentID = 1;
        }
        if(!startDate) {
            startDate = new Date().toISOString().slice(0,10);
        }
        if(!endDate) {
            endDate = startDate;
        }
        if(!startTime) {
            startTime = new Date().toISOString().slice(11,23);
        }
        if(!endTime) {
            endTime = startTime;
        }
        if(!done) {
            done = 0;
        }
        const [task_id] = await connection('tasks').insert({
            title, description, startDate, startTime, endDate, endTime, 
            repetitionType, repetitionEnd, done, parentID 
        });

        return response.json({task_id});
    }, 
    async delete(request, response) {
        const {id} = request.params;

        const ans = await connection('tasks').where('taskID', id).delete();
        if(ans) {
            return response.status(204).send();
        } else {
            return response.status(405).send();
        }
    }, 
    async index(request, response) {
        const tasks = await connection('tasks').select("*");

        return response.json({tasks});
    }
}

