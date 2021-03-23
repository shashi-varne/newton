import React, { Component, Fragment } from 'react';

class MenuListDropDownClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            insuranceProducts: props.insuranceProducts,
            value: this.props.parent.state.value
        }
        this.renderPorducts = this.renderPorducts.bind(this);
    }

    renderPorducts(props, index) {

        return (
            <div key={index}>
                <div className='menu-list-dropdown' onClick={() => this.props.parent.handleClick(props.key, props.title, index, props.type)}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <img src={props.icon} alt="" className='image-icon' />
                        <div className='dropdown-elements'
                            style={(props.type === 'drop-down') ? {
                                borderBottomStyle: this.props.parent.state.insuranceProducts.length - 1 !== index && this.props.parent.state.value === index ? '' : 'solid'
                            }
                                :
                                { borderBottomStyle: this.props.parent.state.insuranceProducts.length - 1 !== index ? 'solid' : '' }}>
                            <div className='menu-title' >{props.title} {' '}
                                {props.resume_flag && <span className='resume_flag'>Resume</span>}
                                {props.type === 'drop-down' && <span style={{ "float": "right", color: 'green' }}>
                                    <img src={props.dropdown} alt="" style={{ marginLeft: '15px', transform: this.props.parent.state.value === index ? `rotate(180deg)` : '' }} /></span>}
                            </div>
                            <div className='menu-subtitle'>{props.subtitle}</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', width: '100%' }}>
                    {props.type === 'drop-down' && this.props.parent.state.value === index &&
                        <div
                            onClick={() => this.props.parent.handleClick(props.key, props.title)} style={{ width: '100%' }}>
                                {props.type === 'drop-down' && < props.component onSelectEvent={this.props.parent.handleEvent} parent={this.props.parent} />} </div>
                    }
                </div>
            </div>
        )
    }


    render() {
        return (
            <Fragment>
                <div className='products' style={{ marginTop: '10px' }}>
                    <h1 className='header-title' >Explore best plans for your health</h1>
                    {this.state.insuranceProducts.map(this.renderPorducts)}
                </div>
            </Fragment >
            
        )
    }
}

const MenuListDropDown = (props) => {
    return (
        <MenuListDropDownClass {...props} />
    )
}

export default MenuListDropDown;