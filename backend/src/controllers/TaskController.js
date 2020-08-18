const connection = require('../database/connection');
const ValidateData = require('../validate/ValidateData');
const repDefs = require('../validate/repetitionDefs');

module.exports = {
    async create(request, response) {
        var {title, description, parentID, schedules} = request.body;

        // First validate task

        //title Validation
        if(ValidateData.empty(title)) {
            return response.status(400).send({"error":"Title required/not valid"});
        } 
        var title = title.split(" ").filter(function(value){ return value !== "";}).join(" "); //Retirando espaços extras
        if (title.length > 64) {
            return response.status(400).send({"error":"Title too big"});
        }

        // description Validation
        if(ValidateData.empty(description)) {
            description = null;                 // Default value
        }
        else if (description.length > 255) {
            return response.status(400).send({"error":"Description too big"});
        }

        // parentID Validation
        if(ValidateData.empty(parentID)) {
            parentID = 1;
        } else if (isNaN(parentID)){
            return response.status(400).send({"error":"parentID not valid"});
        } else {
            var [count] = await connection('lists').where('listID', parentID).count();
            count = count['count(*)'];
            if (!count) {
                return response.status(400).send({"error":"parentID not valid"});
            }
        }
        
        var done = 0;

        try {
            const [task_id] = await connection('tasks').insert({title, description, done, parentID});
        }
        catch(err) {
            return response.status(400).send(err);
        }

        // After task is created, validate and insert schedules

        // Validate batch
        for (var i = 0; i<schedules.length; )
        {
            // Date Validation
            if(ValidateData.empty(schedules[i]['date'])) {
                schedules[i]['date'] = new Date().toISOString().slice(0,10); // ISO String without time information
            } else if(!ValidateData.isDate(schedule[i]['date'])){
                return response.status(400).send({"error":"startDate not valid"});
            }
            
            // startTime Validation
            if(ValidateData.empty(schedules[i]['startTime'])) {
                schedules[i]['startTime'] = new Date().toISOString().slice(11,23);  // ISO String without date information
            } else if(!ValidateData.isTime(schedules[i]['startTime'])) {
                return response.status(400).send({"error": "startTime not valid"});
            }
            
            // duration Validation
            if(ValidateData.empty(schedules[i]['duration'])) {
                schedules[i]['duration'] = null;
            } else if(!ValidateData.isTime(schedules[i]['duration'])) {
                return response.status(400).send({"error": "duration not valid"});
            } 

            // repetitionType patternization -- Ainda nao ha validacao porque n sabemos como sera o padrao, Rosana rimando
            if(ValidateData.empty(schedules[i]['repetitionType'])) {
                schedules[i]['repetitionType'] = 0;
            } else if(schedules[i]['repetitionType'] & repDefs.EVERY_X_DAY)

        }
        /*


         //repetitionEnd patternization --Ainda nao ha validacao porque n sabemos como sera o padrao
        if(ValidateData.empty(repetitionEnd)) {
            repetitionEnd = 0;
        }

        */

        return response.json({task_id, title, description, done, parentID});
    },

    async delete(request, response) {
        const {id} = request.params;

        const ans = await connection('tasks').where('taskID', id).del();
        if(ans) {
            return response.status(204).send();
        } else {
            return response.status(405).send();
        }
    },

    async index(request, response) {
        const {id} = request.params;
        if(id) {
            var tasks = await connection('tasks').where('parentID', id).select('*');
        } else {
            var tasks = await connection('tasks').select('*');
        }
        return response.json({tasks});
    },
    async alter (request, response) {
        const {id} = request.params;
        var task = request.body;

        //title Validation
        if(ValidateData.empty(task['title'])) {
            delete task['title'];
        } else {
            var str = task['title'];
            task['title'] = str.split(" ").filter(function(value){ return value !== "";}).join(" "); //Retirando espacos extras
        }

        //startDate Validation
        if(ValidateData.empty(task['startDate'])) {
           delete task['startDate'];
        } else if(ValidateData.date(task['startDate'])){
            return response.status(400).send({"error":"startDate not valid"});
        }
        //endDate Validation
        if(ValidateData.empty(task['endDate'])) {
            delete task['endDate'];
        } else if(ValidateData.date(task['endDate'])){
            return response.status(400).send({"error":"endDate not valid"});
        }

        //startTime Validation
        if(ValidateData.empty(task['startTime'])) {
            delete task['startTime'];
        } else if(ValidateData.time(task['startTime'])) {
            return response.status(400).send({"error": "startTime not valid"});
        }

        //endTime Validation
        if(ValidateData.empty(task['endTime'])) {
            delete task['endTime'];
        } else if(ValidateData.time(task['endTime'])) {
            return response.status(400).send({"error": "endTime not valid"});
        } 

        var res = await connection('tasks').where('taskID', id).update(task);

        if(!res) return response.status(400).send();
        return response.status(204).send();
    }
}

