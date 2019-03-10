import React from 'react';
import uuid from 'uuid';
import isEmpty from 'lodash/isEmpty'
import { fetchAll, fetchGet, fetchPost } from '../utils/http'

import NewAward from './NewAward';
import Header from './Header';
import AwardList from './AwardList';
import EditModal from './EditModal';
import { ToastContainer, toast } from 'react-toastify'


export default class CreateAward extends React.Component {

  state = {
    awards: null,
    awardTypes: null,
    awardToEdit: undefined,
    showModal: false,
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
    }
    
    fetchPost('/api/awards', newAward)
    .then((res) => {
      this.setState((prevState) => ({ 
        awards: [...prevState.awards, newAward]
      }))
    })
    .catch((err) => {
        this.showToast(err.message, { type: 'error' })
    })
  }

  handleDeleteAward = (awardToRemove) => {
    this.setState((prevState) => ({
      awards: prevState.awards.filter((award) => awardToRemove !== award.id)
    }));
  };

  handleEditAward = (awardState) => {
    let awardIdx = this.state.awards.findIndex((award) => award.id === this.state.awardToEdit);
    let newAwardsArr = [...this.state.awards];
    newAwardsArr[awardIdx] = awardState
    this.setState(() => ({ awards: newAwardsArr, awardToEdit: undefined, showModal: false }));
  };

  handleCancelEdit = () => {
    this.setState(() => ({ awardToEdit: undefined, showModal: !this.state.showModal}))
  } 

  handleAwardToEdit = (id) => {
    this.setState(() => ({ awardToEdit: id, showModal: !this.state.showModal }));
  }

  renderModal = () => {
    const { 
      awards,
      awardTypes,
      awardToEdit,
      showModal,
    } = this.state

    const award = awards.filter((award) => ( award.id === awardToEdit ))

    return (
      <EditModal 
        showModal={showModal}
        award={award}
        awardTypes={awardTypes}
        handleEditAward={this.handleEditAward}
        handleCancelEdit={this.handleCancelEdit}
      />
    )
  }

  renderAwardList = () => {
    const {
      users,
      awards, 
      awardTypes, 
    } = this.state

    const formattedAwards = awards.map((award) => ({
      id: award.id,
      granted: award.granted,
      recipient: users.find((user) => user.id === award.recipient),
      creator: users.find((user) => user.id === award.creator),
      awardType: awardTypes.find((type) => type.id === award.type),
    }))

    return (
      <AwardList 
        awards={formattedAwards} 
        handleDeleteAward={this.handleDeleteAward} 
        handleAwardToEdit={this.handleAwardToEdit}
      />
    )
  }

  render() {
    const {
      user,
      users,
      awardTypes,
      showModal,
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
          {this.renderModal()}
          <ToastContainer />
        </div>
      </div>
    );
  }
}