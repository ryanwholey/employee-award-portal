import React from 'react';

const Award = (props) => {
  return (
    <div 
      className='award-list__item'
      id={props.awardType === 'Employee of the Month' ? 'EE_Month' : 'Sales'}  
    >
      <p>{props.awardType} : {props.name} : {props.email} : {props.createdAt}</p>
      {props.awardType && <button className="button"
                            onClick={(e) => {
                              props.handleDeleteAward(props.id);
                            }}
                          >
                            Remove
                          </button>}
      {props.awardType && <button className="button">Edit</button>}
    </div>
  );
}

export default Award;