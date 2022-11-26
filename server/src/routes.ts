import express from 'express';
import TasksController from './controllers/TasksController';

const routes = express.Router();
const tasksController = new TasksController();

routes.get('/tasks', tasksController.index);
routes.post('/tasks', tasksController.create);
routes.delete('/tasks', tasksController.delete);

export default routes;