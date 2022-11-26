import React, {useState, useEffect} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {Link} from 'react-router-dom';
import Task, {TaskObj} from './Task/Task';
import NewTask from './Task/NewTask';
import {GrNext} from 'react-icons/gr';
import TaskRequests from '../../../services/TaskRequests';

import './List.css';

/* MaterialUI imports */
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

interface ListProps {
}

const List: React.FC<ListProps> = (props) => {

    const [tasks, setTasks] = useState<[] | Array<TaskObj> >([]);
    const [path, setPath] = useState<Array<TaskObj>>([{id: 0, title: "Lista", parent: 0}]);
 
    async function getAndSetTasks(parentId ?: number) {
        setTasks(await TaskRequests.getTasks(parentId));
    }  

    useEffect(() => {
        getAndSetTasks();
    }, [])

    function updateList(task: TaskObj)
    {
        setPath([...path, task]);
        getAndSetTasks(task.id);
    }

    function goToPath(event: React.MouseEvent<HTMLAnchorElement>, index: number)
    {
        var parentId : number;

        event.preventDefault();

        parentId = path[index].id;

        setPath(path.slice(0, index+1));
        getAndSetTasks(parentId);
    }

    async function updateTasks(newTask: TaskObj)
    {
        var apiTask = await TaskRequests.insertTask(newTask);
        if (apiTask != null)
            setTasks([...tasks, apiTask]);
    }

    async function removeTask(task: TaskObj, index: number)
    {
        var response = await TaskRequests.deleteTask(task.id);
        if (response)
            setTasks(tasks.slice(0, index).concat(tasks.slice(index+1)));
    }
    
    return (
        <div className="list">
            <div className="list-inner">
                <nav className="list-navigator">
                    <Breadcrumbs separator={<GrNext/>} maxItems={3} aria-label="breadcrumb">
                        {path.map((task: TaskObj, index: number) => 
                            <Link 
                                color="inherit" 
                                to="#" 
                                onClick={(e) => goToPath(e, index)}
                                key={index}
                            >
                                {task.title}
                            </Link>
                        )}
                    </Breadcrumbs>
                </nav>
                <TransitionGroup>
                    {tasks.map((task: TaskObj, index: number) => 
                        <CSSTransition key={task.id} timeout={200} classNames="list-item">
                            <Task 
                                obj={task} 
                                onSetAsParent={() => updateList(task)}
                                onTaskDelete={() => removeTask(task, index)}
                                key={task.id}
                            />
                        </CSSTransition>
                    )}
                    <NewTask 
                        parentId={path.length > 0 ? path[path.length -1].id : 0}
                        onSubmit={updateTasks} 
                    />
                </TransitionGroup>
            </div>
        </div>
    )
}

export default List;