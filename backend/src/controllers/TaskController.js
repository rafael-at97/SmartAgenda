const connection = require('../database/connection');
const ValidateData = require('../validate/ValidateData');

module.exports = {
    async create(request, response) {
        var {title, description, startDate, startTime, endDate, endTime, 
        repetitionType, repetitionEnd, parentID} = request.body;

        //title Validation
        if(ValidateData.empty(title)) {
            return response.status(400).send({"error":"Title required/not valid"});
        } 
        var title = title.split(" ").filter(function(value){ return value !== "";}).join(" "); //Retirando espaços extras

        //startDate Validation
        if(ValidateData.empty(startDate)) {
            startDate = new Date().toISOString().slice(0,10);
        } else if(ValidateData.date(startDate)){
            return response.status(400).send({"error":"startDate not valid"});
        }

        //endDate Validation
        if(ValidateData.empty(endDate)) {
            endDate = null;
        } else if(ValidateData.date(endDate)){
            return response.status(400).send({"error":"endDate not valid"});
        }

        //startTime Validation
        if(ValidateData.empty(startTime)) {
            startTime = new Date().toISOString().slice(11,23);
        } else if(ValidateData.time(startTime)) {
            return response.status(400).send({"error": "startTime not valid"});
        }

        //endTime Validation
        if(ValidateData.empty(endTime)) {
            endTime = null;
        } else if(ValidateData.time(endTime)) {
            return response.status(400).send({"error": "endTime not valid"});
        } 

        //parentID Validation
        if(ValidateData.empty(parentID)) {
            parentID = 1;
        } else if (isNaN(parentID)){
            return response.status(400).send({error: 'parentID not valid'});
        } else {
            var [count] = await connection('lists').where('listID', parentID).count();
            count = count['count(*)'];
            if (!count) {
                return response.status(400).send({"error": 'parentID not valid'});
            }
        }

        //description padronization
        if(ValidateData.empty(description)) {
            description = null;
        }

        //repetitionType padronization --Ainda nao ha validacao porque n sabemos como sera o padrao
        if(ValidateData.empty(repetitionType)) {
            repetitionType = 0;
        }

         //repetitionEnd padronization --Ainda nao ha validacao porque n sabemos como sera o padrao
        if(ValidateData.empty(repetitionEnd)) {
            repetitionEnd = 0;
        }
        
        var done = 0;

        const [task_id] = await connection('tasks').insert({
            title, description, startDate, startTime, endDate, endTime, 
            repetitionType, repetitionEnd, done, parentID 
        });

        return response.json({task_id, title, description, startDate, startTime, endDate, endTime, 
            repetitionType, repetitionEnd, done, parentID});
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

