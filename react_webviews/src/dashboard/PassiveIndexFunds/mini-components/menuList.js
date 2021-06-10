import React, { Component, Fragment } from 'react';
import { getConfig } from 'utils/functions';
import "./commonStyles.scss";

class MenuListDropDownClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menulistProducts: props.menulistProducts,
            type: getConfig().productName,
        }
        this.renderPorducts = this.renderPorducts.bind(this);
    }


    renderPorducts(props, index) {

        return (
            <div key={index}>
                <div className='wvmenu-list-dropdown' data-aid={`menu-list-dropdown-${this.props.dataAidSuffix}-${index + 1}`}
                    onClick={() => this.props.handleClick(props, index)}>
                    <div className='wvmenulist-block'>
                        <img src={props.icon} alt="" className='image-icon' />
                        <div className='dropdown-elements'
                            style={{ borderBottomStyle: this.state.menulistProducts.length - 1 !== index ? 'solid' : '' }}>
                            <div className='wvmenu-title' data-aid={`menu-title-${this.props.dataAidSuffix}-${index + 1}`}>{props.title} {' '}
                            </div>
                            <div className='wvmenu-subtitle' data-aid={`menu-subtitle-${this.props.dataAidSuffix}-${index + 1}`}>{props.subtitle}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };


    render() {
        return (
            <Fragment>
                <div className='wvmenulist-products' data-aid={`menulist-products-${this.props.dataAidSuffix}`}>
                    {this.state.menulistProducts.map(this.renderPorducts)}
                </div>
            </Fragment >
        )
    }
}

const Menulist = (props) => {
    return (
        <MenuListDropDownClass {...props} />
    )
}

export default Menulist;