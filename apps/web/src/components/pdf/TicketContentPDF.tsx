import {Text, View, StyleSheet} from '@react-pdf/renderer';
import {PDFProps} from './type';
import {formatDate} from 'utils';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 12,
    color: 'black',
    width: '80vw',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: 11,
    textDecoration: 'none',
    color: '#cccccc',
    marginBottom: 5,
  },
  value: {
    marginBottom: 5,
  },
  subValue: {
    fontSize: 10,
  },
});

export function TicketContentPDF({ticketSale}: PDFProps) {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.label}>Ticket</Text>
        <Text style={styles.value}>{ticketSale.ticket.title}</Text>
        {ticketSale.ticket.description && (
          <Text style={styles.subValue}>{ticketSale.ticket.description}</Text>
        )}
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>Quantity</Text>
        <Text style={styles.value}>{ticketSale.quantity}</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>Start date</Text>
        <Text style={styles.value}>
          {formatDate(ticketSale.event.startDate, 'dd MMM yyyy, HH:mm')}
        </Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>End date</Text>
        <Text style={styles.value}>
          {formatDate(ticketSale.event.endDate, 'dd MMM yyyy, HH:mm')}
        </Text>
      </View>
    </View>
  );
}
