import React from 'react';
import Modal from 'react-modal';


export default class EditModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      awardType: '',
      name: '',
      email: '',
      message: '',
      createdAt: undefined
    };

    this.updateState = this.updateState.bind(this);
    this.saveState = this.saveState.bind(this);
    Modal.setAppElement('#root');
  };

  updateState(e) {
    this.setState({ [e.target.name]: e.target.value });
  };

  saveState() {
    const returnState = this.state;
    this.props.handleEditAward(returnState);
  }

  componentDidUpdate(prevProps) {
    const award = this.props.award[0];
    if (this.props.showModal !== prevProps.showModal && award){
      this.setState(() => ({
        id: award.id,
        awardType: award.awardType,
        name: award.name, 
        email: award.email, 
        message: award.message,
        createdAt: award.createdAt
      }));
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        contentLabel="Selected Award"
        onRequestClose={this.props.handleCancelEdit}
        className="modal"
      >
        <h3 className="modal__title">Edit Award</h3>
        <div className="modal-body">
          <form>
            <select name='awardType' value={this.state.awardType} onChange={this.updateState} > 
              <option value={this.props.awardTypes[0]}>Employee of the Month</option>
              <option value={this.props.awardTypes[1]}>Monthly Sales Winner</option>
            </select>       
            <input type='text' name='name' value={this.state.name} placeholder="Name" onChange={this.updateState} />
            <input type='email' name='email' value={this.state.email} placeholder="Email" onChange={this.updateState} />
            <input type='text' name='message' value={this.state.message} placeholder="Message" onChange={this.updateState}/>
          </form>
          <button
            className="button"
            onClick={this.saveState}
          >Save Changes</button>
          <button
            className="button"
            onClick={this.props.handleCancelEdit}
          >Cancel</button>
        </div>
      </Modal>   
    )
  } 
}
