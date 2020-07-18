import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {FiMenu, FiHome, FiChevronLeft} from 'react-icons/fi'

import './styles.css'

export default function Home()
{
    const [path, setPath] = useState([]);

    // Using static variables for now, until connection with backend is stablished
    var lists = [{title: "Faculdade", color: "None"}, {title: "Estágio", color:"None"}];
    var tasks = [{title: "Terminar a interface"}, {title: "Task 2"}];

    function handleClickList(title)
    {
        setPath(path.concat([{title: title, pos: path.length+1}]));
    }

    function handleClickTask(title)
    {
    }

    function handleClickPath(pos)
    {
        setPath(path.slice(0, pos));
    }

    return (
        <div className="home-container">
            <header>
                <div className="app-info">
                    <strong> P.A.W.L.I.(N.E.)</strong>
                </div>

                <div className="list-info">
                    <button className="icon"
                            onClick={() => handleClickPath(0)}>
                        <FiHome size={20}/>
                    </button>
                    <div className="path">
                        {path.map(subpath => (
                            <button
                                className="subpath" 
                                onClick={() => handleClickPath(subpath.pos)}>
                                \{subpath.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="settings">
                    <button className="icon">
                        <FiMenu size={20}/>
                    </button>
                </div>
            </header>

            <ul>
                {lists.map(list => (
                    <li>
                        <button onClick={() => handleClickList(list.title)}>
                            <p className="title">{list.title}</p>
                        </button>
                    </li>
                ))}
                {tasks.map(task => (
                    <li>
                        <button onClick={() => handleClickTask(task.title)}>
                            <p className="title">{task.title}</p>
                            <p>07/09/1997</p>
                            <p>16:20</p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}