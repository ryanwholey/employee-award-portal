import React from 'react';
import Award from './Award';


const AwardList = (props) => {
  return (
    <div className='award-list'>
      <div>
        <h3>Previously Created Awards</h3>
      </div>
        <div className='award-list__items'>
        {
          props.awards.map((award) => (
            <Award
              key={award.id}
              award={award}
              handleDeleteAward={props.handleDeleteAward}
              handleAwardToEdit={props.handleAwardToEdit}
            />
          ))
        }
        </div>
    </div>
  )
};

export default AwardList;