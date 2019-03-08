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
  const myDoc = (
    <Document>
      <Page style={styles.page} orientation='landscape' size='A4'>
        <View style={styles.container}>
          <Text style={styles.header}>Congratulations, {props.award.name}!</Text>
          <Text style={styles.message}>You've been awarded the {props.award.awardType} award by UserName.</Text>
          <Text style={styles.date}>{props.award.createdAt}</Text>
        </View>
      </Page>
    </Document>
  )
  return myDoc
}

const Award = (props) => {
  const award = props.award
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
          onClick={(e) => {
            props.handleAwardToEdit(award.id);
          }}
        >
        Edit
        </button>}
      {award.awardType && 
        <div>
          <PDFDownloadLink document={createDoc(props)} fileName="example.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download')}
          </PDFDownloadLink>
        </div>
      }
    </div>
  );
}

export default Award;