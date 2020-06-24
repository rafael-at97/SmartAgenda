const express = require('express');

const ListController = require ('./controllers/ListController');
const TaskController = require('./controllers/TaskController');

const routes = express.Router();

routes.post('/lists', ListController.create);
routes.get('/lists', ListController.index);
routes.delete('/lists/:id', ListController.delete);

routes.post('/tasks', TaskController.create);
routes.get('/tasks', TaskController.index);
routes.delete('/tasks/:id', TaskController.delete);

module.exports = routes;
