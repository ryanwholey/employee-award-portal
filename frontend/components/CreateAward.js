import React from 'react';
import NewAward from './NewAward';
import Header from './Header';
import AwardList from './AwardList';
import EditModal from './EditModal';
import uuid from 'uuid';


export default class CreateAward extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      awards: [{
        id: uuid(),
        name: 'User1',
        awardType: 'Employee of the Month',
        email: 'sample@gmail.com',
        message: '',
        createdAt: '1' 
      }, {
        id: uuid(),
        name: 'User2',
        awardType: 'Monthly Sales Winner',
        email: 'sample2@gmail.com',
        message: '',
        createdAt: '2'
      }],
      //awards: [],
      awardOptions: ['Employee of the Month',
                     'Monthly Sales Winner'],
      awardToEdit: undefined,
      showModal: false
    };

    this.handleAddAward = this.handleAddAward.bind(this);
    this.handleDeleteAward = this.handleDeleteAward.bind(this);
    this.handleEditAward = this.handleEditAward.bind(this);
    this.handleAwardToEdit = this.handleAwardToEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
  };

  handleAddAward(award) {
    const newAward = {
      id: award.id,
      name: award.name,
      awardType: award.awardType,
      email: award.email,
      message: award.message,
      createdAt: award.createdAt
    };

    this.setState((prevState) => ({ awards: prevState.awards.concat(newAward) }));
  };

  handleDeleteAward(awardToRemove) {
    this.setState((prevState) => ({
      awards: prevState.awards.filter((award) => awardToRemove !== award.id)
    }));
  };

  handleEditAward(awardState) {
    let awardIdx = this.state.awards.findIndex((award) => award.id === this.state.awardToEdit);
    let newAwardsArr = [...this.state.awards];
    newAwardsArr[awardIdx] = awardState
    this.setState(() => ({ awards: newAwardsArr, awardToEdit: undefined, showModal: false }));
  };

  handleCancelEdit() {
    this.setState(() => ({ awardToEdit: undefined, showModal: !this.state.showModal}))
  } 

  handleAwardToEdit(id) {
    this.setState(() => ({ awardToEdit: id, showModal: !this.state.showModal }));
  };
  
  render() {
    const subtitle = 'Welcome back, UserName!';
    let award = this.state.awards.filter((award) => ( award.id === this.state.awardToEdit ));
    return (
      <div>
        <Header subtitle={subtitle} />
        <div className='container'>
          <NewAward 
            awardOptions={this.state.awardOptions}
            handleAddAward={this.handleAddAward}
          />
          <AwardList 
            awards={this.state.awards} 
            handleDeleteAward={this.handleDeleteAward} 
            handleAwardToEdit={this.handleAwardToEdit}
          />
          <EditModal 
            showModal={this.state.showModal}
            award={award}
            awardOptions={this.state.awardOptions}
            handleEditAward={this.handleEditAward}
            handleCancelEdit={this.handleCancelEdit}
          />
        </div>
      </div>
    );
  }
}