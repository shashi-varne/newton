import React, { useMemo } from 'react'
import { getConfig } from '../../utils/functions';
import Container from '../common/Container'
import SampleDocuments from '../mini-components/SampleDocuments'

const description = "Please ensure the documents are as per the details required. If you have multiple documents please merge them into one.";
const documents = [
  // Todo: update doc after getting asset
  { title: 'Bank Statement (Last 6 months)', name: "(BANK SAMPLE DOCUMENT)", doc: 'bank_statement' },
  { title: 'ITR (Any from last 2 years)', name: "(ITR SAMPLE DOCUMENT)", doc: 'itr' },
  { title: 'Salary Slip (Last 3 months) ', name: "(PAYSLIP SAMPLE DOCUMENT)", doc: 'salary_slip' },
]

const FnOSampleDocuments = (props) => {
  const { productName } = useMemo(getConfig, []);
  const handleCTAClick = () => {
    props.history.goBack();
  }

  return (
    <Container 
      title="Sample documents" 
      buttonTitle="OKAY" 
      handleClick={handleCTAClick} 
      iframeRightContent={require(`assets/${productName}/kyc_illust.svg`)}
      data-aid='kyc-sample-doc-screen'
    >
      <SampleDocuments description={description} documents={documents} />
    </Container>
  )
}

export default FnOSampleDocuments