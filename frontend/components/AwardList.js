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
              id={award.id}
              awardType={award.awardType}
              name={award.name}
              email={award.email}
              createdAt={award.createdAt}
              handleDeleteAward={props.handleDeleteAward}
            />
          ))
        }
        </div>
    </div>
  )
};

export default AwardList;