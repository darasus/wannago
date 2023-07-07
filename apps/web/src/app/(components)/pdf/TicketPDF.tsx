import {Document, Page, View, StyleSheet} from '@react-pdf/renderer';
import {HeaderPDF} from './HeaderPDF';
import {PDFProps} from './type';
import {TicketContentPDF} from './TicketContentPDF';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  image: {
    marginBottom: 10,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
    paddingTop: 5,
    borderWidth: 3,
    borderColor: 'gray',
    borderStyle: 'dashed',
  },
});

export function TicketPDF({ticketSale}: PDFProps) {
  return (
    <Document>
      <Page style={styles.page}>
        <HeaderPDF ticketSale={ticketSale} />
        <View style={styles.container}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {/* <Image
              src="https://react-pdf.org/static/images/luke.jpg"
              style={styles.image}
            /> */}
          <TicketContentPDF ticketSale={ticketSale} />
          {/* <Skills /> */}
          {/* <Experience /> */}
        </View>
        {/* <Text style={styles.footer}>
          This IS the candidate you are looking for
        </Text> */}
      </Page>
    </Document>
  );
}
