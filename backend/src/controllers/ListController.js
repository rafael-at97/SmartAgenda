const connection = require('../database/connection');
const ValidateData = require('../validate/ValidateData');

module.exports = {
    async create(request, response) {
        var {title, color, parentID} = request.body; 
        
        //Validacao do titulo
        if(ValidateData.empty(title)) {
            return response.status(400).send({"error":"Title required/not valid"});
        } 
        title = title.split(" ").filter(function(value){ return value !== "";}).join(" "); //Retirando espacos extras

        //Verificacao da cor
        if(ValidateData.empty(color)) {
            color = '0xffffff';
        } else if(isNaN(color)) { //por enquanto, a unica validacao eh essa
            return response.status(400).send({"error":"color not valid"});
        }
        
        //Verificacao parentID
        if(ValidateData.empty(parentID)) {
            parentID = 1;
        } else if (isNaN(parentID)){
            return response.status(400).send({"error": "parentID not valid"});
        } else {
            var [count] = await connection('lists').where('listID', parentID).count();
            count = count['count(*)'];
            if (!count) {
                return response.status(400).send({"error": "parentID not valid"});
            }
        }
        
        //Insercao no banco de dados
        const [list_id] = await connection('lists').insert({
            title, color, parentID
        });
        
        return response.json({list_id});
    },

    async index(request, response) { 
        const {id} = request.params;
        var lists  = [], tasks = [];

        if(id) {//Mostra todas as listas e tarefas filhas do id selecionado
            lists = await connection('lists').where('parentID',id).whereNot('listID', id).select('*');
            tasks = await connection('tasks').where('parentID', id).select('*');
            return response.json({lists,tasks});
        } else { //Se o id for nulo, apenas mostrara todas as listas existentes, independente do parentID
            lists = await connection('lists').select('*');
            return response.json({lists});
        }
    },

    async delete(request, response) { //Deleta a lista com o id recebido e todos os filhos dela (listas e tarefas)
        const {id} = request.params;

        var children = [{'listID': parseInt(id,10)}]; //str to num, base 10
        
        //Loop para deletar tambem os possiveis filhos das listas que tem como parentID o id recebido
        for(var i=0; i<children.length ; i++){
            let list_id = children[i]['listID'];
            let aux = await connection('lists').where('parentID', list_id).whereNot('listID', 1).select('listID');
            children = children.concat(aux);
            children[i] = list_id;
        }

        //Apagar e verificar se foi apagado algo de fato
        var res = await connection('lists').whereIn('listID', children).whereNot('listId', 1).del(); 
        //Nota: Nao inverter a ordem, senao corre risco de nao executar a query 
        res = (await connection('tasks').whereIn('parentID', children).del() || res); 

        if(!res) {
            return response.status(405).send();
        }

        return response.status(204).send();  
    },

    async alter(request, response) { //parentID nao podera ser alterado
        const {id} = request.params;
        var list = request.body;
        
        //Validacao do titulo
        if(ValidateData.empty(list['title'])) {
            delete list['title'];
        } else {
            var str = list['title'];
            list['title'] = str.split(" ").filter(function(value){ return value !== "";}).join(" "); //Retirando espacos extras
        }
        
        //Validacao color: verifica se a cor eh um numero e impede de "" ser adicionado
        if(list['color']){ 
            if(isNaN(list['color'])) {
                return response.status(400).send({"error":"color not valid"});
            }
        } else {
            delete list['color']; //Para nao alterar a cor caso {"color" : ""}
        }
        
        var res = await connection('lists').where('listID', id).update(list);

        if(!res) return response.status(400).send();
        return response.status(204).send();
    }
}