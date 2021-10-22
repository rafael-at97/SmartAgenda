import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home/Home'

function Routes()
{
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component = {Home}/>
            </Switch>
        </BrowserRouter>    
    );
}

export default Routes;