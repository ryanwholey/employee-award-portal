import React from 'react'
import { Link, Redirect, Route, Switch } from 'react-router-dom'
import AdminUsers from './AdminUsers'

export default class AdminHome extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/admin">Users</Link>
                <Link to="/admin/awards">Awards</Link>
                <h1>hello admin</h1>
                <Switch>
                <Redirect exact from="/admin" to="/admin/users" />
                <Route path="/admin/users" render={() => <AdminUsers /> } />
                <Route path="/admin/awards" render={() => (<div>award</div>) } />
                </Switch>
                
            </React.Fragment>
        )
    }
}
