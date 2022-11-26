import React, {useState} from 'react';
import {TaskObj} from './Task';
import './Task.css';

interface NewTaskProps {
    onSubmit(task: TaskObj): void,
    parentId: number
}

const NewTask: React.FC<NewTaskProps> = (props) => {
    const [title, setTitle] = useState<string>("");
    
    function checkAndSubmit(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault();

        if(title !== "")
        {
            props.onSubmit({
                id: -1,
                title: title,
                parent: props.parentId,
                done: false
            });
            setTitle("");
        } 
    }

    return (
        <div className="task">
            <div className="task-inner">
                <form onSubmit={(event) => checkAndSubmit(event)}>
                    <input 
                        type="text" 
                        placeholder="Nova Tarefa..."
                        className="task-title"
                        value={title} 
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </form>
            </div>
        </div>
    )
}

export default NewTask;