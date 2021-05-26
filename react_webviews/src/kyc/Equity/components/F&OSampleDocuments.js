import React from 'react'
import Container from '../../common/Container'
import SampleDocuments from '../../mini-components/SampleDocuments'

const description = "Please ensure the documents are as per the details required. If you have multiple documents please merge them into one.";
const documents = [
  // Todo: update doc after getting asset
  { title: 'Bank Statement (Last 6 months)', name: "(BANK SAMPLE DOCUMENT)", doc: 'cancelled_cheque' },
  { title: 'ITR (Any from last 2 years)', name: "(ITR SAMPLE DOCUMENT)", doc: 'passbook_first_page' },
  { title: 'Salary Slip (Last 3 months) ', name: "(PAYSLIP SAMPLE DOCUMENT)", doc: 'bank_statement' },
]

const FAndOSampleDocument = (props) => {
  const handleCTAClick = () => {
    props.history.goBack();
  }

  return (
    <Container title="Sample documents" buttonTitle="OKAY" handleClick={handleCTAClick}>
      <SampleDocuments description={description} documents={documents} />
    </Container>
  )
}

export default FAndOSampleDocument