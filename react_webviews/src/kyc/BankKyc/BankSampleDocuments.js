import React from 'react'
import Container from '../common/Container'
import SampleDocuments from '../mini-components/SampleDocuments'

const description = "Please ensure that the documents you are uploading must have your name, account number and IFSC code";
const documents = [
  { title: 'Cancelled cheque', name: "(BANK SAMPLE DOCUMENT)", doc: 'cancelled_cheque' },
  { title: 'First page of passbook', name: "(BANK SAMPLE DOCUMENT)", doc: 'passbook_first_page' },
  { title: 'Bank account statement', name: "(BANK SAMPLE DOCUMENT)", doc: 'bank_statement' },
]

const BankSampleDocument = () => {
  return (
    <Container noFooter title="Sample bank documents">
      <SampleDocuments description={description} documents={documents} />
    </Container>
  )
}

export default BankSampleDocument