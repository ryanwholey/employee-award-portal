import Cookies from 'universal-cookie'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './containers/Home'
import AdminHome from './containers/AdminHome'

import './app.css'

export default class App extends React.Component {

    cookies = new Cookies()

    _handleLogout = () => {
        console.log('logging out...')
        this.cookies.remove('eap-token', { path: '/' })
    }

    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <button onClick={ this._handleLogout }>logout</button>
                    <Switch>
                        <Route path="/admin" render={() => <AdminHome /> } />
                        <Route render={() => <Home passedProp="Pased prop" />} />
                    </Switch>
                </React.Fragment>
            </BrowserRouter>
        )
    }
}
