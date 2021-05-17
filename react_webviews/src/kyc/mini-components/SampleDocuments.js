import React from 'react'

function SampleDocument({ description, documents }) {
  return (
    <section id="sample-docs">
      <div className="description">
        {description}
      </div>
      <main>
        {documents.map(({ title, name, doc }) => (
          <div className="doc" key={doc}>
            <div className="doc-name">{title}</div>
            <fieldset>
              <legend>{name}</legend>
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
