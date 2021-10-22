import React from 'react';
import List from './List/List';

import './Home.css';

export default function Home()
{
    return(
        <div className="home-container">
            <header>
            </header>

            <main>
                <List/>
            </main>
        </div>
    );
}