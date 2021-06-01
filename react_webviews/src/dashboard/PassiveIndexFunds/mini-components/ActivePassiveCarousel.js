import React from 'react'
function ActivePassiveCarousel({data}) {
    
    return (
        <div className="active-passive-carousel">
            <div  className="image">
            <img src={require(`assets/${data.src}`)} alt="" />
            </div>
            <p className="header">{data.header}</p>
            <div className="body">
                <div className="left">
                    <p className="left-title">{data.left.title.toUpperCase()}</p>
                    <p className="content">{data.left.content}</p>
                </div>
                <div className="right">
                    <p className="right-title">{data.right.title.toUpperCase()}</p>
                    <p className="content">{data.right.content}</p>
                </div>
            </div>
        </div>
    )
}

export default ActivePassiveCarousel
