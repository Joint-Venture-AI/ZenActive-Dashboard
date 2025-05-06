// MyDocument.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

// Define your styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },
    section: {
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    value: {
        marginLeft: 5,
    },
    heading: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

const RecentTransactionsPdf = ({ modalData }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.heading}>Transaction Details</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Transaction ID:</Text>
                    <Text style={styles.value}>{modalData.transIs}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>
                        {moment(modalData.purchaseDate).format('DD MM YYYY')}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>User Name:</Text>
                    <Text style={styles.value}>{modalData.userId.name.firstName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Package Name:</Text>
                    <Text style={styles.value}>{modalData.packageName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Package Price:</Text>
                    <Text style={styles.value}>${modalData.packagePrice}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default RecentTransactionsPdf;
