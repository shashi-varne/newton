/*
Use: MenuListDropDown for selecting category and sub-category from a dropdown

Example syntax:
  <WVMenuListDropDown
    menulistProducts={[{key,subtitle,icon, dropDownArrow, resume_flag={true or false}}, component: [ { key,title, subtitle,icon, Product_name},}]}
    value={this.state.value}  // THIS IS THE SELECTED INDEX OF THE DROPDOWN
    handleClick={this.handleClick} // handleClick ACTION
    handleClickEntry={this.handleClickEntry} // sub category handleClickEntry Action
  />

*/

import React, { Component, Fragment } from 'react';
import { getConfig } from 'utils/functions';
import "./WVMenuListDropDownSheet.scss"
class MenuListDropDownClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menulistProducts: props.menulistProducts,
            type: getConfig().productName,
        }
        this.renderPorducts = this.renderPorducts.bind(this);
        this.renderPorductList = this.renderPorductList.bind(this)
    }

    renderPorductList(props, index, array) {
        if (!props.disabled) {
            return (
                <div className='wvmenulist-dropdown' data-aid={`menulist-dropdown-${index+1}`} key={index + 1} onClick={() => this.props.handleClickEntry(props)}>
                    <div className='wvmenulist-dropdown-types'>
                        <img src={props.icon} className="menulist-dropdown-logos_small" alt="" />
                        <div className='wvmenulist-dropdown-line-style'
                            style={{ width: array.length - 1 !== index ? `calc(100% - 85px)` : '100%', paddingBottom: array.length - 1 !== index ? '20px' : '40px' }}>
                            <div className='wvmenulist-dropdown-logos_text' data-aid={`menulist-dropdown-logos_text-${index+1}`}>{props.title} {props.tag && <span className="recommended-tag">{props.tag}</span>}
                                {props.resume_flag && <span className='wvmenu-list-resume_flag'>Resume</span>}</div>
                            <div className='wvmenulist-dropdown-logos_subtext' data-aid={`menulist-dropdown-logos_subtext-${index+1}`}>{props.subtitle}</div>
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
                <div className='wvmenu-list-dropdown' data-aid={`menu-list-dropdown-${this.props.dataAidSuffix}-${index+1}`} onClick={() => this.props.handleClick(props, index)}>
                    <div className='wvmenulist-block'>
                        <img src={props.icon} alt="" className='image-icon' />
                        <div className='dropdown-elements'
                            style={(props.type === 'drop-down') ? { borderBottomStyle: this.state.menulistProducts.length - 1 !== index && this.props.value === index ? '' : 'solid' }
                                :
                                { borderBottomStyle: this.state.menulistProducts.length - 1 !== index ? 'solid' : '' }}>
                            <div className='wvmenu-title' data-aid={`menu-title-${this.props.dataAidSuffix}-${index+1}`}>{props.title} {' '}
                                {props.resume_flag && <span className='wvmenu-list-resume_flag'>Resume</span>}
                                {props.type === 'drop-down' && <span className='wvmenulist-img'>
                                    <img src={props.dropDownArrow} alt="" style={{ transform: this.props.value === index ? `rotate(180deg)` : '' }} /></span>}
                            </div>
                            <div className='wvmenu-subtitle' data-aid={`menu-subtitle-${this.props.dataAidSuffix}-${index+1}`}>{props.subtitle}</div>
                        </div>
                    </div>
                </div>
                <div className='wvmenulist-block'>
                    {props.type === 'drop-down' && this.props.value === index &&
                        <div style={{ width: '100%' }}
                            onClick={() => this.props.handleClick(props.key, props.title)}>
                            {props.formate === 'object' &&
                                <div className="menulist-dropdown-lists" data-aid="menulist-dropdown-lists">
                                    <div className='products' style={{ marginTop: '-8px' }}>
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
                <div className='wvmenulist-products' data-aid={`menulist-products-${this.props.dataAidSuffix}`}>
                    {this.props.title && <h1 className='wvmenulist-header-title'data-aid={`menulist-header-title-${this.props.dataAidSuffix}`}>{this.props.title}</h1>}
                    {this.state.menulistProducts.map(this.renderPorducts)}
                </div>
            </Fragment >
        )
    }
}

const WVMenuListDropDown = (props) => {
    return (
        <MenuListDropDownClass {...props} />
    )
}

export default WVMenuListDropDown;