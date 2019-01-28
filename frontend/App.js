import React from 'react'
import Home from './containers/Home'
import About from './containers/About'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import './app.css'

export default class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                    <div>
                        <h1>Employee Awards Portal</h1>
                    </div>
                    <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    </ul>
                    <Route 
                        path="/" 
                        exact 
                        render={() => <Home passedProp="Passed prop" /> } 
                    />
                    <Route 
                        path="/about"
                        render={() => <About /> } 
                    />
                </div>
            </BrowserRouter>
        )
    }
}
