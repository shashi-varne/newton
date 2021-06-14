/*

   Use case:  MenuList Can be used As a (dropdown or List of product) with Image + Title + Subtitle.

    Example syntax:

        <WVMenuListDropdown
          title={item.title}                                // Title for MenuList
          subtitle={item.subtitle}                         // Subtitle for MenuList
          image={item.icon}                               // image for MenuList
          keyname={item.key}                             // keyname (Key used to map )
          contentPropsMapList={}                        // Dropdown subsection
          handleClick={this.handleClick}               // Action
          value={this.state.selectedValue}            // Selected Value to Display Drop-down subsection
          isDropDown={item.isDropDown}               // Boolean(if true then Block is a dropdown)
          selectedValue={this.selectedValue}        // Callback Function to set Value pros from parent Page
        />

 */


import './WVMenuListDropdown.Scss';
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


const WVMenuListDropdown = ({
    dataAidSuffix,
    index,
    value,
    isDropDown,
    keyname,
    handleClick,
    title, // Title for MenuList
    subtitle, // Subtitle for MenuList (shows below title)   
    image, // Image to show on Left corner
    classes,
    contentPropsMapList,
    selectedValue,  // CallBack Fun To set Selected Value
    tag,
    resumeFlag,
    ...props // Any other props to be sent to MenuList
}) => {

    return (

        <div className={`wv-menulist-products ${classes.header}`} data-aid={`menulist-products-${dataAidSuffix}`} onClick={handleClick} key={index}>
            <div className='wv-menu-list-dropdown' data-aid={`menu-list-dropdown-${dataAidSuffix}`}
                onClick={() => selectedValue(keyname === value ? "" : keyname)}>
                <div className='wv-menulist-block'>
                    <Imgc src={image} alt="" className={`wv-image-icon ${classes.Image}`} />
                    <div className='wv-dropdown-elements'>
                        {title &&
                            <Title classes={classes} dataAidSuffix={dataAidSuffix} isDropDown={isDropDown} keyname={keyname} value={value}>
                                {title}
                            </Title>}
                        {subtitle &&
                            <Subtitle classes={classes} dataAidSuffix={dataAidSuffix}>
                                {subtitle}
                            </Subtitle>}
                    </div>
                </div>
            </div>


            {contentPropsMapList && value === keyname &&
                <>
                    {!isEmpty(contentPropsMapList) &&
                        contentPropsMapList.map((propObj, idx) => {
                            if (keyname === propObj.keyBelongsTo) {
                                return (
                                    <WVMenuListDropdown
                                        index={idx}
                                        title={propObj.title}
                                        subtitle={propObj.subtitle}
                                        image={propObj.image}
                                        keyname={keyname}
                                        handleClick={() => handleClick(propObj)}
                                        resumeFlag={propObj.resumeFlag}
                                        classes={propObj.className || style}
                                        tag={propObj.tag}
                                        dataAidSuffix={dataAidSuffix} >
                                    </WVMenuListDropdown>
                                )
                            } else return null;
                        })}
                </>}
        </div >
    );
};


const Title = ({ children, classes, isDropDown, keyname, value, dataAidSuffix }) => {
    return (
        <div className={`wv-menu-title ${classes?.headerTitle}`} data-aid={`menu-title-${dataAidSuffix}`}>
            {children}
            {isDropDown &&
                <span className='menulist-img'>
                    <img src={arrow} alt="" style={{ transform: keyname === value ? `rotate(180deg)` : '' }} />
                </span>}
        </div>
    );
}


const Subtitle = ({ children, classes, dataAidSuffix }) => {
    return (
        <div className={`wv-menu-subtitle ${classes?.subheader}`} data-aid={`wv-menu-subtitle-${dataAidSuffix}`}>
            {children}
        </div>
    );
}




WVMenuListDropdown.propTypes = {
    handleClick: PropTypes.func,
    isDropDown: PropTypes.bool,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    keyname: PropTypes.string,
    classes: PropTypes.exact({
        card: PropTypes.string,
        header: PropTypes.string,
        headerTitle: PropTypes.string,
        Image: PropTypes.string,
        subheader: PropTypes.string,
        children: PropTypes.string,
    }),
    children: PropTypes.node,
    contentPropsMapList: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
    }))
};

WVMenuListDropdown.defaultProps = {
    keyname: "",
    selectedValue: () => { },
    handleClick: () => { },
    classes: {},
    isDropDown: false,
    value: null,
    dataAidSuffix: ""
};


export default WVMenuListDropdown;