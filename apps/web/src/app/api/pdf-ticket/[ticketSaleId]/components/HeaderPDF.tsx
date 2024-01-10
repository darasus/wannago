import React from 'react';

import {Text, View, StyleSheet} from '@react-pdf/renderer';
import {PDFProps} from './type';
import {getConfig} from 'utils';

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
  return (
    <View style={styles.container}>
      <View style={styles.detailColumn}>
        <Text style={styles.title}>{ticketSale.event.title}</Text>
        <Text style={styles.organizerName}>{`By ${getConfig().name}`}</Text>
      </View>
    </View>
  );
}
