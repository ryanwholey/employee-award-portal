import React from 'react';
import uuid from 'uuid';
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'

import NewAward from './NewAward';
import Header from './Header';
import AwardList from './AwardList';
import EditModal from './EditModal';
import { ToastContainer, toast } from 'react-toastify'
import { fetchAll, fetchGet, fetchDelete, fetchPost } from '../utils/http'


export default class CreateAward extends React.Component {

  state = {
    awards: null,
    awardTypes: null,
    isFetching: true,
    user: null,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.setState({ isFetching: true })
    return Promise.all([
      fetchGet('/api/users/me'),
      fetchAll('/api/users/'),
      fetchAll('/api/users/me/awards?filters=sent'),
      fetchAll('/api/award_types'),
    ])
    .then(([ userRes, users, awards, awardTypes ]) => {
      const {
        id,
        first_name: firstName, 
        last_name: lastName,
        email,
        region,
      } = userRes.data

      this.setState({
        awards,
        awardTypes,
        isFetching: false,
        user: { id, firstName, lastName, email, region },
        users,
      })
    })
    .catch((err) => {
        this.showToast(err.message, { type: 'error' })
    })
  }

  showToast = (message, props) => {
    toast(message, props)
  }

  handleAddAward = (award) => {
    const newAward = {
      type: award.awardType,
      recipient: award.recipientId,
      creator: award.creatorId,
      granted: moment(award.granted).format('YYYY-MM-DD HH:mm:ss'),
    }
    
    fetchPost('/api/awards', newAward)
    .then((res) => {
      this.setState((prevState) => ({ 
        awards: [...prevState.awards, res.data]
      }))
    })
    .then(() => {
      this.showToast('Successfully created award', { type: 'success' })
    })
    .catch((err) => {
      this.showToast(err.message, { type: 'error' })
    })
  }

  handleDeleteAward = (awardToRemove) => {
    fetchDelete(`/api/awards/${awardToRemove}`)
    .then(() => {
      this.setState((prevState) => ({
        awards: prevState.awards.filter((award) => awardToRemove !== award.id)
      }))
    })
    .then(() => {
      this.showToast('Successfully deleted award', { type: 'success' })
    })
    .catch((err) => {
        this.showToast(err.message, { type: 'error' })
    })
  };

  renderAwardList = () => {
    const {
      users,
      awards, 
      awardTypes, 
    } = this.state

    const formattedAwards = awards.map((award) => ({
      id: award.id,
      granted: moment(award.granted).format('lll'),
      recipient: users.find((user) => user.id === award.recipient),
      creator: users.find((user) => user.id === award.creator),
      awardType: awardTypes.find((type) => type.id === award.type),
    }))

    return (
      <AwardList 
        awards={formattedAwards} 
        handleDeleteAward={this.handleDeleteAward}
      />
    )
  }

  render() {
    const {
      user,
      users,
      awardTypes,
      isFetching,
    } = this.state

    if (isFetching) {
      return <span>Loading...</span>
    }
    
    return (
      <div>
        <Header subtitle={`Welcome back, ${user.firstName} ${user.lastName}!`} />
        <div className='container'>
          <NewAward
            users={users}
            creator={user}
            awardTypes={awardTypes}
            handleAddAward={this.handleAddAward}
          />
          {this.renderAwardList()}
          <ToastContainer />
        </div>
      </div>
    );
  }
}