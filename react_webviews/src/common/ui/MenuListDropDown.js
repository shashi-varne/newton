import React, { Component, Fragment } from 'react';
import { getConfig } from 'utils/functions';
class MenuListDropDownClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            insuranceProducts: props.insuranceProducts,
            value: this.props.parent.state.value,
            type: getConfig().productName,
        }
        this.renderPorducts = this.renderPorducts.bind(this);
        this.renderPorductList = this.renderPorductList.bind(this)
    }

    renderPorductList(props, index, array) {
        if (!props.disabled) {
            return (
                <div className='insurance_plans' style={{ width: '100%' }} key={index + 7} onClick={() => this.props.parent.handleClickEntry(props)}>
                    <div className='insurance_plans_types' style={{ width: '100%', padding: '0px' }}>
                        <img src={props.icon}  className="insurance_plans_logos_small"  alt=""/>
                        <div style={{
                            borderBottomWidth: '1px', width: array.length - 1 !== index ? `calc(100% - 85px)` : '100%',
                            borderBottomColor: '#EFEDF2', borderBottomStyle: 'solid', paddingTop: '20px', paddingBottom: array.length - 1 !== index ? '20px' : '40px',
                            justifyContent: 'space-between', cursor: 'pointer'
                        }}>
                            <div className='insurance_plans_logos_text' style={{ fontWeight: '400', fontSize: '13px', marginBottom: '5px', lineHeight: '15.41px', width: '100%' }}>{props.title} {props.key === 'GMC' && <span className="recommended-tag">Recommended</span>}
                              {props.resume_flag && <span style={{background: '#ff6868', letterSpacing: 0.1, fontSize : '8px', lineHeight : '10.06px', position : 'relative', top:'-3px',
                                borderRadius: 7 , padding: '2px 4px', marginTop : '-30px' , color : 'white', fontWeight : '700' , width :'40px' , left:'6px', height:'14px', 
                               }}>Resume</span>}</div>
                            <div className='insurance_plans_logos_subtext' style={{ fontWeight: '300' }}>{props.subtitle}</div>
                        </div>
                    </div>
                </div>
            )
        }
        return null;
    }

    renderPorducts(props, index) {

        return (
            <div key={index}>
                <div className='menu-list-dropdown' onClick={() => this.props.parent.handleClick(props,index )}>
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
                            {props.formate === 'component' && < props.component onSelectEvent={this.props.parent.handleEvent} parent={this.props.parent} />}
                            {props.formate === 'object' &&
                                <div className="group-health-insurance-entry" style={{ width: '100%' }}>
                                    <div className='products' style={{ width: '100%', marginTop: '-8px' }}>
                                        {props.component.map(this.renderPorductList)}
                                    </div>
                                </div>}
                        </div>}
                </div>
            </div>
        )
    }


    render() {
        return (
            <Fragment>
                <div className='products' style={{ marginTop: '10px' }}>
                    <h1 className='header-title' >{this.props.title}</h1>
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