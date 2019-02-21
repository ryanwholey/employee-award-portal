import React from 'react';

const Award = (props) => {
  const award = props.award
  console.log(`${award.name} - ${award.id}`);
  return (
    <div 
      className='award-list__item'
      id={award.awardType === 'Employee of the Month' ? 'EE_Month' : 'Sales'}  
    >
      <p>{award.awardType} : {award.name} : {award.email} : {award.createdAt}</p>
      {award.awardType && 
        <button className="button"
          onClick={(e) => {
            props.handleDeleteAward(award.id);
          }}
        >
        Remove
        </button>}
      {award.awardType && 
        <button 
          className="button"
          //award={award}
          onClick={(e) => {
            props.handleAwardToEdit(award.id);
            console.log(`I'm in Award.js: ${award.id}`);
          }}
        >
        Edit
        </button>}
    </div>
  );
}

export default Award;