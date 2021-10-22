import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Task, {TaskObj} from './Task/Task';
import NewTask from './Task/NewTask';
import {GrNext} from 'react-icons/gr';
import api from '../../../services/api';

import './List.css';

/* MaterialUI imports */
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

interface ListProps {
}

const List: React.FC<ListProps> = (props) => {

    const [tasks, setTasks] = useState<[] | Array<TaskObj> >([]);
    const [path, setPath] = useState<Array<string>>(["Titulo"]);
    
    useEffect(() => {
        api.get('tasks').then(response => {
            setTasks(response.data);
        });
    })

    function updateList(title: string)
    {
        setPath([...path, title]);
    }

    function goToPath(event: React.MouseEvent<HTMLAnchorElement>, index: number)
    {
        event.preventDefault();

        setPath(path.slice(0, index+1));
    }

    function updateTasks(newTask: TaskObj)
    {
        api.post('tasks', newTask).then(response => {
            if(response.status === 201)
                setTasks([...tasks, newTask]);
        });
    }

    return (
        <div className="list">
            <div className="list-inner">
                <nav className="list-navigator">
                    <Breadcrumbs separator={<GrNext/>} maxItems={3} aria-label="breadcrumb">
                        {path.map((title: string, index: number) => 
                            <Link color="inherit" to="#" onClick={(e) => goToPath(e, index)}>
                                {title}
                            </Link>
                        )}
                    </Breadcrumbs>
                </nav>
                {tasks.map((task : TaskObj) => 
                    <Task obj={task} onSetAsParent={updateList}/>
                )}
                <NewTask onSubmit={updateTasks} />
            </div>
        </div>
    )
}

export default List;