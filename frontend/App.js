import Cookies from 'universal-cookie'
import React from 'react'
import { BrowserRouter, Route, Switch, withRouter, Link } from 'react-router-dom'

import ForgotPassword from './containers/ForgotPassword'
import AdminHome from './containers/AdminHome'
import PasswordReset from './containers/PasswordReset'
import ProfilePage from './containers/ProfilePage'
import Login from './components/Login'
import Signup from './components/Signup'
import CreateAward from './components/CreateAward'

import './app.css'
import 'react-table/react-table.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datetime/css/react-datetime.css'
import './styles/styles.scss'

class LoggedInHeader extends React.Component{

    cookies = new Cookies()

    _handleLogout = () => {
        this.cookies.remove('eap-token', { path: '/' })
        window.location = '/login'
    }

    _handleOnClick = (e) => {
        e.preventDefault()
        
        window.location = '/'
    }

    render() {
        return (
            <React.Fragment>
                <button className="button" onClick={ this._handleLogout }>logout</button>
                <span style={{ cursor: 'pointer' }} onClick={this._handleOnClick} className="nav-link">Home</span>
                <Link to="/profile" className="nav-link">Profile</Link>
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
            <Route path="/signup" render={() => <Signup {...props} />} />
            <Route path="/forgot_password" render={() => <ForgotPassword {...props} />} />
            <Route path="/profile" render={() => 
                <LoggedInHeader>
                    <ProfilePage {...props} />
                </LoggedInHeader>
            } />
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
