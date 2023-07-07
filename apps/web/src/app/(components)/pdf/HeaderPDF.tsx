import React from 'react';

import {Text, View, StyleSheet} from '@react-pdf/renderer';
import {PDFProps} from './type';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    alignItems: 'stretch',
  },
  detailColumn: {
    flexDirection: 'column',
  },
  linkColumn: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
    justifySelf: 'flex-end',
  },
  title: {
    fontSize: 24,
  },
  organizerName: {
    fontSize: 10,
  },
});

export function HeaderPDF({ticketSale}: PDFProps) {
  const organizerName = ticketSale.event.organization
    ? ticketSale.event.organization.name
    : `${ticketSale.event.user?.firstName} ${ticketSale.event.user?.lastName}`;

  return (
    <View style={styles.container}>
      <View style={styles.detailColumn}>
        <Text style={styles.title}>{ticketSale.event.title}</Text>
        <Text style={styles.organizerName}>{`By ${organizerName}`}</Text>
      </View>
    </View>
  );
}
