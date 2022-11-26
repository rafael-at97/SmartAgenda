import React, {useState, useEffect} from 'react';
import {GiCheckMark} from 'react-icons/gi';
import {BsPencil, BsCheckLg} from 'react-icons/bs';
import {FaTrash} from 'react-icons/fa';
import './Task.css';
import TaskRequests from '../../../../services/TaskRequests';

/* MaterialUI imports */
import Collapse from '@material-ui/core/Collapse';

export interface TaskObj {
    id: number,
    title: string,
    parent: number,
    description?: string,
    done?: boolean
}

interface TaskProps {
    obj: TaskObj,
    onSetAsParent?(task: TaskObj): void
    onTaskDelete?(id: number): void
}

const Task: React.FC<TaskProps> = (props: TaskProps) => {
   
    /* Desconstruction of props parameter */
    var {
        title, 
        description,
        id,
        parent
    } = props.obj;
    
    var onShowFullInfo = props.onSetAsParent;
    var onDelete = props.onTaskDelete;

    if(!description)
        description = "";

    const [newTitle, setNewTitle] = useState<string>(title);
    const [newDescription, setNewDescription] = useState<string>(description);
    const [fullDetail, setFullDetail] = useState<boolean>(false);
    const [editEnabled, setEditEnabled] = useState<boolean>(false);
    const [done, setDone] = useState<boolean>(false);
    const [subTasks, setSubTasks] = useState<[] | Array<String>>([]);

    async function getAndSetSubTasks() {
        setSubTasks(await TaskRequests.getTasks(id, true));
    }  

    useEffect(() => {
        getAndSetSubTasks();
    }, []);

    function toggleStatus()
    {
        setDone(!done);
    }

    function deleteSelf()
    {   
        /* Confirm first? */
        /* SendMessageToAPI */ 
        if (onDelete)
            onDelete(id);
    }

    const titleHTML = (editEnabled ? 
        <input
            type="text"
            placeholder="Nova Tarefa..."
            className="task-title"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
        /> 
        : 
        <button 
            className="task-title"
            onClick={() => setFullDetail(!fullDetail)}
        >
            {newTitle}
        </button> 
    );

    return (
        <div className="task">
            <div className="task-inner">
                <div className="title-wrapper">
                    {titleHTML}
                    <button
                        onClick={toggleStatus}
                        className="completed"
                    >
                        {done && <GiCheckMark/>}
                    </button>
                </div>
                <Collapse
                    in={fullDetail}
                    timeout="auto"
                >
                    <div className="task-body">
                        <div className="task-body-line"/>
                        <label 
                            htmlFor="task-description"
                            className="task-description-label"
                        >
                            Description:
                        </label>
                        <textarea
                            id="task-description"
                            placeholder="..."
                            className="task-description"
                            value={newDescription}
                            onChange={(event) => setNewDescription(event.target.value)}
                        />

                        <div className="sub-tasks">
                            <ul>
                                <li>subtask1</li>
                                <li>subtask2</li>
                            </ul>
                            <button
                                onClick={() => {if(onShowFullInfo) onShowFullInfo({id: id, 
                                                                                   title: newTitle,
                                                                                   parent: parent});}}
                            >
                                See all
                            </button>
                        </div>

                        <div className="sub-menu">
                            <div className="left-buttons">
                                <button
                                    onClick={() => setEditEnabled(!editEnabled)}
                                >
                                    {editEnabled ? 
                                        <BsCheckLg className="icon"/>
                                    : 
                                        <BsPencil className="icon"/>
                                    }
                                </button>      
                            </div>
                            <div className="right-buttons">
                                <button
                                    onClick={() => {deleteSelf()}}
                                >
                                    <FaTrash className="icon"/>
                                </button>                            
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default Task;