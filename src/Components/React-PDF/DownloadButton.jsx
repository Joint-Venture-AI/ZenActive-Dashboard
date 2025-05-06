// DownloadButton.js
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RecentTransactionsPdf from './RecentTransactions';


const DownloadButton = ({ modalData }) => (
    <PDFDownloadLink
        document={<RecentTransactionsPdf modalData={modalData} />}
        fileName="transaction_details.pdf"
        style={{ textDecoration: 'none' }} // you can override styles if needed
    >
        {({ loading }) =>
            loading ? (
                <button className="w-[300px] bg-[#174C6B] text-white px-10 h-[50px] flex items-center justify-center gap-3 text-lg outline-none rounded-xl">
                    <span className="text-white font-light">Loading document...</span>
                </button>
            ) : (
                <button className="w-[300px] bg-[#174C6B] text-white px-10 h-[50px] flex items-center justify-center gap-3 text-lg outline-none rounded-xl">
                    <span className="text-white font-light">Download</span>
                </button>
            )
        }
    </PDFDownloadLink>
);

export default DownloadButton;
