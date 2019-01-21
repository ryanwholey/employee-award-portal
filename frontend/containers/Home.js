import React from 'react'
import PropTypes from 'prop-types'

export default class Home extends React.Component {

    static propTypes = {
        passedProp: PropTypes.string.isRequired
    }

    state = {
        isButtonOn: false,
        data: null,
        errors: []
    }

    componentDidMount() {
        fetch('/api/data')
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                this.setState((state) => {
                    return {
                        errors: [...state.errors, 'ERROR_FETCHING_DATA']
                    }
                })
            }
        })
        .then((res) => {
            this.setState({
                data: res.data
            })
        })
    }
    
    _handleButtonClick = () => {
        this.setState((state) => {
            return {
                isButtonOn: !state.isButtonOn
            }
        })
    }


    _renderData() {
        const {
            data,
            errors
        } = this.state

        if (errors.includes('ERROR_FETCHING_DATA')) {
            return <div>Error fetching data</div>
        } else if (data === null || data === undefined) {
            return <div>Loading...</div>
        } else if (data === []) {
            return <div>Empty</div>
        }

        return data.map((item, index) => <div key={ index }>{ item }</div>)
    }

    render() {
        const { 
            isButtonOn,
            data,
            errors
        } = this.state

        const buttonText = isButtonOn ? 'Button is on' : 'Button is not on'

        return (
            <div>
                <h1>Homepage</h1>
                <button onClick={ this._handleButtonClick }>{ buttonText }</button>
                { this._renderData() }
            </div>
        )
    }
}
