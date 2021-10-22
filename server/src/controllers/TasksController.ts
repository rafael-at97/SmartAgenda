import { Request, Response } from 'express';

import db from '../database/connection'

export default class TasksController {
    async index(request : Request, response : Response)
    {   
        var parent;
        const filters = request.query;
        
        if(!filters.parent)
            parent = '0';
        else
            parent = filters.parent as string;

        const tasks = await db('tasks')
            .where('parent', '=', parent)
            .andWhere('id', '>', 0); 
        
        return response.json(tasks);
    };
    
    async create(request : Request, response : Response) 
    {
        var {
            title,
            description,
            done,
            parent
        } = request.body;
    
        if (parent == null)
            parent = 0;
    
        try 
        {
            await db('tasks').insert({
                title,
                description,
                done,
                parent
            });
        
            return response.status(201).send();
        }
        catch (err) 
        {
            console.log(err);
            return response.status(400).json({
                error: 'Database error!'
            })
        }
    };
}