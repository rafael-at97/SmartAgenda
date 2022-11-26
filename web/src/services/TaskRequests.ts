import { TaskObj } from '../pages/Home/List/Task/Task';
import api from './api';

class taskRequests
{
    static async getTasks(parentId ?: number, bTitleOnly ?: boolean) {
        const response = await api.get('tasks', {params: {parent: parentId, 
                                                          titleOnly: bTitleOnly}});
        return response.data;
    }

    static async insertTask(newTask : TaskObj) {
        const response = await api.post('tasks', newTask);

        if (response.status === 201)
            return response.data;
        else
            return null;
    }

    static async deleteTask(deletedTaskId : Number) {
        const response = await api.delete('tasks', {data: {taskID: deletedTaskId}});
        return (response.status === 200);
    }
}

export default taskRequests;