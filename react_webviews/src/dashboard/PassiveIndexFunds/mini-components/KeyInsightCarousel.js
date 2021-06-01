import React from 'react'
import ReactHtmlParser from 'react-html-parser'
function KeyInsightCarousel({data}) {
    return (
        <div className="key-insight-carousel">
           <p className="title">{data.title}</p>
           <p className="content">{ReactHtmlParser(data.content)}</p>
        </div>
    )
}

export default KeyInsightCarousel
