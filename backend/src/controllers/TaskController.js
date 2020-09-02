const connection = require('../database/connection');
const ValidateData = require('../validate/ValidateData');

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
        /*
        try {
            const [task_id] = await connection('tasks').insert({title, description, done, parentID});
        }
        catch(err) {
            return response.status(400).send(err);
        }*/

        // After task is created, validate and insert schedules

        // Validate batch

        if (schedules != null ){
            for (var i = 0; i<schedules.length; i++)
            {
                // Date Validation
                if(ValidateData.empty(schedules[i]['date'])) {
                    schedules[i]['date'] = new Date().toISOString().slice(0,10); // ISO String without time information
                } else if(!ValidateData.isDate(schedules[i]['date'])){
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
                } else if(/* schedules[i]['duration'].length != 5 ||*/ !ValidateData.isTime(schedules[i]['duration'])) {
                    return response.status(400).send({"error": "duration not valid"});
                }
                
                // Repetition type received as an object from front-end
                let repetition = schedules[i]['repetition'];

                // repetition will be an object with properties 'type', 'wdays', 'mweeks', 'value'

                if(!ValidateData.empty(repetition)) {
                    if(repetition['wdays'] == null) {
                        repetition['wdays'] = 0; 
                    } else {
                        repetition['wdays'] = "0b".concat(repetition['wdays']);
                    }
                    if(repetition['mweeks'] == null) repetition['mweeks'] = 0;
                    if(repetition['value'] == null) repetition['value'] = 0;

                    if(!ValidateData.isValidRepetition(repetition)){
                        return response.status(400).send({"error": "repetition type not valid"});
                    }

                    // All valid, transform object into int for database
                    let dbRep = 0;
                    
                    if(repetition['type'].toLowerCase() == 'day') {
                        dbRep = 1 << 8;
                    }
                    else if(repetition['type'].toLowerCase() == 'week') {
                        dbRep = 2 << 8;
                    }
                    else if(repetition['type'].toLowerCase() == 'month') {
                        dbRep = 4 << 8;
                    }
                    else if(repetition['type'].toLowerCase() == 'year') {
                        dbRep = 8 << 8;
                    }

                    dbRep = (dbRep | repetition['wdays']) << 4;
                    dbRep = (dbRep | repetition['mweeks']) << 16;
                    dbRep = dbRep | repetition['value'];

                    schedules[i]['repetition'] = dbRep.toString(16);
                }
                else {
                    schedules[i]['repetition'] = null;
                }

                schedules[i]['task_id'] = 1; //change to task_id
            }
        }
        //insert into database and return response/*
        /*try{
            for (var i = 0; i < schedules.length ; i++) {
                await connection('schedules').insert(schedules[i]);
            }
        } catch(err) {
            return response.status(400).send(err);
        }*/

        return response.json({ title, description, done, parentID, schedules});
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

