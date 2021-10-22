import React, {useState} from 'react';
import {GiCheckMark} from 'react-icons/gi'
import {BsArrowBarUp} from 'react-icons/bs'
import './Task.css';

/* MaterialUI imports */
import Collapse from '@material-ui/core/Collapse';

export interface TaskObj {
    title: string,
    description?: string,
    done?: boolean
}

interface TaskProps {
    obj: TaskObj,
    onSetAsParent?(title: string): void
}

const Task: React.FC<TaskProps> = (props) => {
   
    /* Desconstruction of props parameter */
    var {
        title, 
        description
    } = props.obj;
    
    var parentCallback = props.onSetAsParent;

    if(!description)
        description = "";

    const [newTitle, setNewTitle] = useState<string>(title);
    const [newDescription, setNewDescription] = useState<string>(description);
    const [fullDetail, setFullDetail] = useState<boolean>(false);
    const [done, setDone] = useState<boolean>(false);

    function toggleStatus()
    {
        setDone(!done);
    }

    const titleHTML = (fullDetail ? 
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
        onClick={() => setFullDetail(true)}
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
                        <button 
                            onClick={() => setFullDetail(false)}
                            className="task-hide"
                        >    
                            <BsArrowBarUp/> Click to Hide Details <BsArrowBarUp/>
                        </button>

                        <label 
                            htmlFor="task-description"
                            className="task-description-label"
                        >
                            Description:
                        </label>
                        <input
                            type="text"
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
                                onClick={() => {if(parentCallback) parentCallback(newTitle);}}
                            >
                                See all
                            </button>
                        </div>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default Task;