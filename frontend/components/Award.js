import React from 'react';
import AwardPdf from './AwardPdf'
import { PDFDownloadLink } from '@react-pdf/renderer';

const Award = (props) => {
  const {
    recipient,
    creator,
    awardType,
    id,
    granted,
  } = props.award

  if (!recipient) {
    return null
  }

  const awardPdfProps = {
    awardTypeName: awardType.name,
    granted,
    creatorName: `${creator.first_name} ${creator.last_name}`,
    recipientName: `${recipient.first_name} ${recipient.last_name}`,
  }
  
  return (
    <div 
      key={id}
      className='award-list__item'
      id={awardType.name === 'Employee of the Month' ? 'EE_Month' : 'Sales'}  
    >
      <p>{awardType.name} : {recipient.first_name} {recipient.last_name} : {recipient.email} : {granted}</p>
      <button className="button"
        onClick={(e) => props.handleDeleteAward(id)}
      >
        Remove
      </button>
      <div>
        <PDFDownloadLink document={<AwardPdf {...awardPdfProps} />} fileName="example.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download')}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

export default Award;