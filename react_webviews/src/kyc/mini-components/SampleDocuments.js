import React from 'react'

function SampleDocument({ description, documents }) {
  return (
    <section id="sample-docs" data-aid='sample-docs'>
      <div className="description" data-aid='description'>
        {description}
      </div>
      <main data-aid='sample-documents'>
        {documents.map(({ title, name, doc }) => (
          <div className="doc" data-aid='doc' key={doc}>
            <div className="doc-name" data-aid='doc-name'>{title}</div>
            <fieldset>
              <legend data-aid='legend'>{name}</legend>
              <div className="doc-image">
                <img src={require(`assets/${doc}.svg`)} alt={name} />
              </div>
            </fieldset>
          </div>
        ))}
      </main>
    </section>
  )
}

export default SampleDocument
