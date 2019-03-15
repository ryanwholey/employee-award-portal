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
    signatureUrl,
  } = props.award

  if (!recipient) {
    return null
  }

  const awardPdfProps = {
    awardTypeName: awardType.name,
    granted,
    creatorName: `${creator.first_name} ${creator.last_name}`,
    recipientName: `${recipient.first_name} ${recipient.last_name}`,
    signatureUrl,
  }
  
  return (
    <div 
      key={id}
      className='award-list__item'
      id={awardType.name === 'Employee of the Month' ? 'EE_Month' : 'Sales'}  
    >
    <div id='AwardText'>
      <nobr id='AwardTextItem'><b>Type: </b> {awardType.name}</nobr>
      <nobr id='AwardTextItem'><b>Recipient: </b>{recipient.first_name} {recipient.last_name}</nobr>
      <nobr id='AwardTextItem'><b>Date: </b>{granted}</nobr>
      <br></br>
    </div>
      <button className="button"
        onClick={(e) => props.handleDeleteAward(id)}
      >
        Remove
      </button>
      <div id='DownloadLink'>
        <PDFDownloadLink document={<AwardPdf {...awardPdfProps} />} fileName="award.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download')}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

export default Award;