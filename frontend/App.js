import React from 'react'
import Home from './containers/Home'

export default class App extends React.Component {

    render() {
        return (
            <div>
                <h1>Employee Awards Portal</h1>
                <Home passedProp="Passed prop" />
            </div>
        )
    }
}