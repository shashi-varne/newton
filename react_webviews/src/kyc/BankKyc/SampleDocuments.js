import React from 'react'
import Container from '../common/Container'

const SampleDocument = () => {
  const documents = [
    { name: 'Cancelled cheque', doc: 'cancelled_cheque' },
    { name: 'First page of passbook', doc: 'passbook_first_page' },
    { name: 'Bank account statement', doc: 'bank_statement' },
  ]
  return (
    <Container noFooter title="Sample bank documents" data-aid='sample-bank-documents-screen'>
      <section id="kyc-bank-sample-docs">
        <div className="description" data-aid='kyc-description'>
          Please ensure that the documents you are uploading must have your
          name, account number and IFSC code
        </div>
        <main data-aid='kyc-sample-bank-doc'>
          {documents.map(({ name, doc }) => (
            <div className="doc" key={doc}>
              <div className="doc-name" data-aid='kyc-doc-name'>{name}</div>
              <fieldset>
                <legend data-aid='kyc-name'>{name}</legend>
                <div className="doc-image">
                  <img src={require(`assets/${doc}.svg`)} alt={name} />
                </div>
              </fieldset>
            </div>
          ))}
        </main>
      </section>
    </Container>
  )
}

export default SampleDocument