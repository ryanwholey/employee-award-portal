import React from 'react';
import moment from 'moment';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: 'white'
//   },
//   container: {
//     backgroundColor: '#E2F9FA',
//     alignItems: 'center',
//     margin: 100,
//     padding: 100,
//     flexGrow: 1,
//     border: 3,
//     opacity: 5
//   },

//   message: {
//     fontFamily: 'Courier-Oblique',
//     paddingBottom: 25
//   },

//   header: {
//     fontFamily: 'Helvetica-Bold',
//     paddingBottom: 15
//   }
// });

// const createDoc = (props) => {
//     const {
//         awardTypeName,
//         granted,
//         creatorName,
//         recipientName,
//     } = props

//     return (
//       <Document>
//         <Page style={styles.page} orientation='landscape' size='A4'>
//           <View style={styles.container}>
//             <Text style={styles.header}>Congratulations, {recipientName}!</Text>
//             <Text style={styles.message}>You have been awarded the {awardTypeName} award by {creatorName}.</Text>
//             <Text style={styles.date}>{moment(granted).format('lll')}</Text>
//           </View>
//         </Page>
//       </Document>
//     )
// }

//export default createDoc

import React from 'react';
import moment from 'moment';
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
  },

  signature: {
    maxHeight: 100, 
    maxWidth: 100
    //objectPosition: 'right'
  }
});

const createDoc = (props) => {
    const {
        awardTypeName,
        granted,
        creatorName,
        recipientName,
        signatureUrl,
    } = props

    return (
      <Document>
        <Page style={styles.page} orientation='landscape' size='A4'>
          <View style={styles.container}>
            <Text style={styles.header}>Congratulations, {recipientName}!</Text>
            <Text style={styles.message}>You have been awarded the {awardTypeName} award by {creatorName}.</Text>
            <Text style={styles.date}>{moment(granted).format('lll')}</Text>
            {
              signatureUrl ? (
                <Image style={styles.signature} src={{ url: signatureUrl, method: 'GET', headers: {}, body: '' }}/>
              ) : null
            }
          </View>
        </Page>
      </Document>
    )
}

export default createDoc