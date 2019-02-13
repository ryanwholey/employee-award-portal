import Cookies from 'universal-cookie'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './containers/Home'
import AdminHome from './containers/AdminHome'
import PasswordReset from './containers/PasswordReset'

import './app.css'

export default class App extends React.Component {

    cookies = new Cookies()

    _handleLogout = () => {
        this.cookies.remove('eap-token', { path: '/' })
        window.location = '/login'
    }

    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <button onClick={ this._handleLogout }>logout</button>
                    <Switch>
                        <Route path="/admin" render={() => <AdminHome /> } />
                        <Route path="/reset_password" render={() => <PasswordReset /> } />
                        <Route render={() => <Home passedProp="Pased prop" />} />
                    </Switch>
                </React.Fragment>
            </BrowserRouter>
        )
    }
}
