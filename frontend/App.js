import Cookies from 'universal-cookie'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './containers/Home'
import ForgotPassword from './containers/ForgotPassword'
import AdminHome from './containers/AdminHome'
import PasswordReset from './containers/PasswordReset'
import Login from './components/Login'
import CreateAward from './components/CreateAward'
import { withRouter } from 'react-router-dom'

import './app.css'

class LoggedInHeader extends React.Component{

    cookies = new Cookies()

    _handleLogout = () => {
        this.cookies.remove('eap-token', { path: '/' })
        window.location = '/login'
    }

    render() {
        return (
            <React.Fragment>
                <button onClick={ this._handleLogout }>logout</button>
                { this.props.children }
            </React.Fragment>

        )
    }
}

const AppRoutes = (props) => (
    <React.Fragment>
        <Switch>
            <Route path="/reset_password" render={() => <PasswordReset {...props} /> } />
            <Route path="/login" render={() => <Login {...props} />} />
            <Route path="/forgot_password" render={() => <ForgotPassword {...props} />} />
            <Route path="/admin" render={() => (
                <LoggedInHeader>
                    <AdminHome {...props} />
                </LoggedInHeader>
            )} />
            <Route render={() => (
                <LoggedInHeader>
                    <CreateAward {...props} />
                </LoggedInHeader>
            )} />
        </Switch>
    </React.Fragment>
)


const WithRouter = withRouter(AppRoutes)

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <WithRouter />
                </React.Fragment>
            </BrowserRouter>
        )
    }
}
