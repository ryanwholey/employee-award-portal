import React from 'react'
import { Link, Redirect, Route, Switch } from 'react-router-dom'

import AdminUsers from './AdminUsers'

export default class AdminHome extends React.Component {
    render() {
        const getIsActiveClassName = (type) => this.props.location.pathname.startsWith(`/admin/${type}`) ? 'active' : ''

        return (
            <React.Fragment>
                <div className="nav-container gutters">
                    <nav>
                        <Link to="/admin/users" className={`nav-link ${getIsActiveClassName('users')}`}>Users</Link>
                        <Link to="/admin/awards" className={`nav-link ${getIsActiveClassName('awards')}`}>Awards</Link>
                    </nav>
                </div>
                <div className="gutters">
                <Switch>
                    <Redirect exact from="/admin" to="/admin/users" />
                    <Route path="/admin/users" render={() => <AdminUsers /> } />
                    <Route path="/admin/awards" render={() => (<div>Award</div>) } />
                </Switch>
                </div>
            </React.Fragment>
        )
    }
}
