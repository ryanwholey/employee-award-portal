import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },

  container: {
    backgroundColor: '#E2F9FA',
    alignItems: 'center',
    margin: 100,
    padding: 100,
    flexGrow: 1,
    border: 3,
    opacity: 5
  },

  message: {
    fontFamily: 'Courier-Oblique',
    paddingBottom: 25
  },

  header: {
    fontFamily: 'Helvetica-Bold',
    paddingBottom: 15
  }
});

const createDoc = (props) => {
  const {
    awardType,
    granted,
    creator,
    recipient,
  } = props.award

  const myDoc = (
    <Document>
      <Page style={styles.page} orientation='landscape' size='A4'>
        <View style={styles.container}>
          <Text style={styles.header}>Congratulations, {recipient.first_name} {recipient.last_name}!</Text>
          <Text style={styles.message}>You've been awarded the {awardType.name} award by {creator.first_name} {creator.last_name}.</Text>
          <Text style={styles.date}>{granted}</Text>
        </View>
      </Page>
    </Document>
  )
  return myDoc
}

const Award = (props) => {
  const {
    recipient,
    creator,
    awardType,
    id,
    granted,
  } = props.award

  return (
    <div 
      key={id}
      className='award-list__item'
      id={awardType.name === 'Employee of the Month' ? 'EE_Month' : 'Sales'}  
    >
      <p>{awardType.name} : {recipient.first_name} {recipient.lastName} : {recipient.email} : {granted}</p>
      <button className="button"
        onClick={(e) => props.handleDeleteAward(id)}
      >
        Remove
      </button>
      <button 
        className="button"
        onClick={(e) => props.handleAwardToEdit(id)}
      >
        Edit
      </button>
      <div>
        <PDFDownloadLink document={createDoc(props)} fileName="example.pdf">
          {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download')}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

export default Award;