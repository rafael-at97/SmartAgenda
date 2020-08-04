const express = require('express');

const ListController = require ('./controllers/ListController');
const TaskController = require('./controllers/TaskController');

const routes = express.Router();

routes.post('/lists', ListController.create);
routes.get('/lists', ListController.index);
routes.get('/lists/:id', ListController.index);
routes.delete('/lists/:id', ListController.delete);
routes.put('/lists/:id', ListController.alter);

routes.post('/tasks', TaskController.create);
routes.get('/tasks', TaskController.index);
routes.get('/tasks/:id', TaskController.index);
routes.delete('/tasks/:id', TaskController.delete);
routes.put('/tasks/:id', TaskController.alter);

module.exports = routes;
