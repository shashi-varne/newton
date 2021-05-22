import React, { Component, Fragment } from 'react';
import { getConfig } from 'utils/functions';
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
                <div className='menulist-dropdown' key={index + 1} onClick={() => this.props.handleClickEntry(props)}>
                    <div className='menulist-dropdown-types'>
                        <img src={props.icon} className="menulist-dropdown-logos_small" alt="" />
                        <div className='menulist-dropdown-line-style'
                            style={{ width: array.length - 1 !== index ? `calc(100% - 85px)` : '100%', paddingBottom: array.length - 1 !== index ? '20px' : '40px' }}>
                            <div className='menulist-dropdown-logos_text'>{props.title} {props.tag && <span className="recommended-tag">{props.tag}</span>}
                                {props.resume_flag && <span className='menu-list-resume_flag'>Resume</span>}</div>
                            <div className='menulist-dropdown-logos_subtext'>{props.subtitle}</div>
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
                <div className='menu-list-dropdown' onClick={() => this.props.handleClick(props, index)}>
                    <div className='menulist-block'>
                        <img src={props.icon} alt="" className='image-icon' />
                        <div className='dropdown-elements'
                            style={(props.type === 'drop-down') ? { borderBottomStyle: this.state.menulistProducts.length - 1 !== index && this.props.value === index ? '' : 'solid' }
                                :
                                { borderBottomStyle: this.state.menulistProducts.length - 1 !== index ? 'solid' : '' }}>
                            <div className='menu-title' >{props.title} {' '}
                                {props.resume_flag && <span className='menu-list-resume_flag'>Resume</span>}
                                {props.type === 'drop-down' && <span className='menulist-img'>
                                    <img src={props.dropdown} alt="" style={{ transform: this.props.value === index ? `rotate(180deg)` : '' }} /></span>}
                            </div>
                            <div className='menu-subtitle'>{props.subtitle}</div>
                        </div>
                    </div>
                </div>
                <div className='menulist-block'>
                    {props.type === 'drop-down' && this.props.value === index &&
                        <div style={{width: '100%'}}
                            onClick={() => this.props.handleClick(props.key, props.title)}>
                            {props.formate === 'object' &&
                                <div className="menulist-dropdown-lists">
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
                <div className='menulist-products'>
                    <h1 className='menulist-header-title'>{this.props.title}</h1>
                    {this.state.menulistProducts.map(this.renderPorducts)}
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