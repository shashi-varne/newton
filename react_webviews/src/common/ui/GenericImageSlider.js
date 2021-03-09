import React, { Component } from 'react'
import { getConfig } from "utils/functions";

class CheckBox extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            productName: getConfig().productName,
        }
    }

    render() {
        return (
            <div>
                <div className="his">
                    <p className="generic-page-title" style={{ margin: "40px 0 20px 0" }}>{this.props.title}</p>
                    <div className="horizontal-images-scroll">

                        {this.props.image_list.map((item, index) =>{
                            return <img
                                    className="image"
                                    src={require(`assets/${this.state.productName}/${item}`)}
                                    alt=""
                                />
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default CheckBox;
