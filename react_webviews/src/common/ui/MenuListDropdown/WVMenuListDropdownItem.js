/*

   Use case:  MenuList Can be used As a (dropdown or List of product) with Image + Title + Subtitle.

    Example syntax:

        <WVMenuListDropdownItem
          title={item.title}                                // Title for MenuList
          subtitle={item.subtitle}                         // Subtitle for MenuList
          image={item.icon}                               // image for MenuList
          keyname={item.key}                            // keyname (Key used to map)
          renderPorductsList={}                        // Dropdown subsection
          handleClick={this.handleClick}              // Action
          isDropDown={item.isDropDown}               // Boolean(if true then Block is a dropdown)
          children                                  // FallBack Component
        />

 */


import './WVMenuListDropdown.scss';
import React from "react";
import { Imgc } from '../Imgc';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import arrow from "../../../assets/back_nav_bar_icon.png";


const style = {
    headerTitle: 'wv-menulist-dropdown-logos-text',
    header: 'wv-menulist-header',
    Image: 'wv-image-icon-small',
}


const WVMenuListDropdownItem = ({
    dataAidSuffix,        // for Data-aid
    index,
    renderPorductsList, // Array of Product SubSection
    keyname,           // For Maping renderPorductsList with renderPorducts
    selected,         // selected Dropdown Key Value
    isDropDown,      // Boolean  if Item is a dropdown then True
    handleClick,    // Action
    title,         // Title for MenuList
    subtitle,     // Subtitle for MenuList (shows below title)   
    image,       // Image to show on Left corner
    classes,    // Css ClassName
    children,  // FallBack Component
    ...props  // Any other props to be sent to MenuList
}) => {


    return (

        <div className={`wv-menulist-products ${classes.header}`} data-aid={`menulist-products-${dataAidSuffix}`} onClick={handleClick} key={index}>
            <div className='wv-menu-list-dropdown' data-aid={`menu-list-dropdown-${dataAidSuffix}`}>
                <div className='wv-menulist-block'>
                    <Imgc src={image} alt="" className={`wv-image-icon ${classes.Image}`} style={{ width : "50px"}} />
                    <div className='wv-dropdown-elements'>
                        {title &&
                            <Title classes={classes} dataAidSuffix={dataAidSuffix} isDropDown={isDropDown} selected={selected} >
                                {title}
                            </Title>}
                        {subtitle &&
                            <Subtitle classes={classes} dataAidSuffix={dataAidSuffix}>
                                {subtitle}
                            </Subtitle>}
                    </div>
                    {isDropDown &&
                        <div className='wv-menulist-img'>
                            <img src={arrow} alt="" style={{ transform: selected === keyname ? `rotate(180deg)` : '' }} />
                        </div>}
                </div>
            </div>


            {renderPorductsList && selected === keyname &&
                !isEmpty(renderPorductsList) &&
                renderPorductsList.map((propObj, idx) => {
                    if (selected === propObj.keyBelongsTo) {
                        return (
                            <WVMenuListDropdownItem
                                index={idx}
                                title={propObj.title}
                                subtitle={propObj.subtitle}
                                image={propObj.image}
                                selected={selected}
                                keyname={keyname}
                                handleClick={() => handleClick(propObj)}
                                classes={propObj.className || style}
                                dataAidSuffix={dataAidSuffix} >
                            </WVMenuListDropdownItem>
                        )
                    } else return null;
                })
            }
            {!renderPorductsList && selected === keyname && children}
        </div >
    );
};


const Title = ({ children, classes, dataAidSuffix }) => {
    return (
        <div className={`wv-menu-title ${classes?.headerTitle}`} data-aid={`menu-title-${dataAidSuffix}`}>
            {children}
        </div>
    );
}


const Subtitle = ({ children, classes, dataAidSuffix }) => {
    return (
        <div className={`wv-menu-subtitle ${classes?.subheader}`} data-aid={`menu-subtitle-${dataAidSuffix}`}>
            {children}
        </div>
    );
}




WVMenuListDropdownItem.propTypes = {
    handleClick: PropTypes.func,
    isDropDown: PropTypes.bool,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    keyname: PropTypes.string,
    classes: PropTypes.exact({
        header: PropTypes.string,
        headerTitle: PropTypes.string,
        Image: PropTypes.string,
        subheader: PropTypes.string,
        children: PropTypes.node,
    }),
    children: PropTypes.node,
    renderPorductsList: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        subtitle: PropTypes.node,
        keyname: PropTypes.string,
        classes: PropTypes.exact({
            header: PropTypes.string,
            headerTitle: PropTypes.string,
            Image: PropTypes.string,
            subheader: PropTypes.string,
            children: PropTypes.node,
        }),
    })),
    dataAidSuffix: PropTypes.string,
    selected: PropTypes.string,
};

WVMenuListDropdownItem.defaultProps = {
    keyname: "",
    handleClick: () => { },
    classes: {},
    isDropDown: false,
    dataAidSuffix: "",
    children: PropTypes.node,
};


export default WVMenuListDropdownItem;