/*

   Use case:  MenuList Can be used As a (dropdown or List of product) with Image + Title + Subtitle.

    Example syntax:

 <React.Fragment>
   {!isEmpty() &&
     ARRAY.map((item) => {
    return (
        <WVMenuListDropdown
          title={item.title}                                // Title for MenuList
          subtitle={item.subtitle}                         // Subtitle for MenuList
          image={item.icon}                               // image for MenuList
          keyname={item.key}                             // keyname (Key used to map )
          contentPropsMapList={}                        // Dropdown subsection
          handleClick={this.handleClick}               // Action
          value={this.state.selectedValue}            // Selected Value for Display Drop-down
          isDropDown={item.isDropDown}               // Boolean(if true the then Block is a dropdown)
          selectedValue={this.selectedValue}        // Callback Function to set Value pros from parent Page
        />
   );
  })}
 </React.Fragment>


 */


import './WVMenuListDropdown.Scss';
import React from "react";
import { Imgc } from '../Imgc';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import arrow from "../../../assets/back_nav_bar_icon.png";


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

        <div className='wv-menulist-products' data-aid={`menulist-products-${dataAidSuffix}`} onClick={handleClick} key={index}>
            <div className='wv-menu-list-dropdown' data-aid={`menu-list-dropdown-${dataAidSuffix}`}
                onClick={() => selectedValue(keyname === value ? "" : keyname)}>
                <div className='wv-menulist-block'>
                    <Imgc src={image} alt="" className='wv-image-icon' />
                    <div className='wv-dropdown-elements'>
                        <div className={`wv-menu-title ${classes.headerTitle}`} data-aid={`menu-title-${dataAidSuffix}`}>
                            {title}
                            {isDropDown &&
                                <span className='menulist-img'>
                                    <img src={arrow} alt="" style={{ transform: keyname === value ? `rotate(180deg)` : '' }} />
                                </span>}
                            {tag &&
                                <span className="recommended-tag">
                                    {tag}
                                </span>}
                            {resumeFlag &&
                                <span className='wv-menu-list-resume-flag'>
                                    {resumeFlag}
                                </span>}
                        </div>
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
                                    <WVMenuListDropdownList
                                        index={idx}
                                        title={propObj.title}
                                        subtitle={propObj.subtitle}
                                        image={propObj.image}
                                        keyname={keyname}
                                        handleClick={handleClick}
                                        resumeFlag={propObj.resumeFlag}
                                        classes={propObj.className || propObj.classes}
                                        tag={propObj.tag}
                                        dataAidSuffix={dataAidSuffix} >
                                    </WVMenuListDropdownList>
                                )
                            } else return null;
                        })}
                </>}
        </div >
    );
};


const Subtitle = ({ children, classes, dataAidSuffix }) => {
    return (
        <div className={`wv-menu-subtitle ${classes?.subheader}`} data-aid={`wv-menu-subtitle-${dataAidSuffix}`}>
            {children}
        </div>
    );
}


const WVMenuListDropdownList = ({
    handleClick,
    title,
    subtitle,
    resumeFlag,
    tag,
    image,
    dataAidSuffix,
    index,
    classes,
    ...props }) => {

    return (

        <div className="wv-menulist-products">
            <div className='wv-menulist-block'>
                <div className="wv-menulist-dropdown-lists">
                    <div className='wv-menulist-dropdown' onClick={handleClick} key={index} data-aid={`wv-menulist-dropdown-${dataAidSuffix}`}>
                        <div className='wv-menulist-dropdown-types'>
                            <Imgc src={image} className="wv-menulist-logos-small" alt="" />
                            <div className='wv-menulist-dropdown-line-style'>
                                <div className={`wv-menulist-dropdown-logos-text ${classes?.headerTitle}`} data-aid={`wv-menulist-dropdown-logos-text-${dataAidSuffix}`}>
                                    {title}
                                    {tag &&
                                        <span className="recommended-tag">
                                            {tag}
                                        </span>}
                                    {resumeFlag &&
                                        <span className='wv-menu-list-resume-flag'>
                                            {resumeFlag}
                                        </span>}
                                </div>
                                <div className='wv-menulist-dropdown-logos-subtext'>
                                    <Subtitle classes={classes} dataAidSuffix={dataAidSuffix}>
                                        {subtitle}
                                    </Subtitle>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

WVMenuListDropdown.List = WVMenuListDropdownList


WVMenuListDropdown.propTypes = {
    handleClick: PropTypes.func,
    isDropDown: PropTypes.bool,
    keyname: PropTypes.string,
    classes: PropTypes.exact({
        card: PropTypes.string,
        header: PropTypes.string,
        headerTitle: PropTypes.string,
        headerImage: PropTypes.string,
        subheader: PropTypes.string,
        children: PropTypes.string,
    }),
    children: PropTypes.string.isRequired,
    contentPropsMapList: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.required,
    }))
};

WVMenuListDropdownList.propTypes = {
    handleClick: PropTypes.func,
    keyname: PropTypes.string,
    classes: PropTypes.exact({
        header: PropTypes.string,
        headerTitle: PropTypes.string,
        headerImage: PropTypes.string,
        subheader: PropTypes.string,
        children: PropTypes.string,
    }),
    children: PropTypes.string.isRequired,
};

WVMenuListDropdown.defaultProps = {
    keyname: "",
    selectedValue: () => { },
    handleClick: () => { },
    classes: {},
    isDropDown: false,
    value: null,
};

WVMenuListDropdownList.propTypes = {
    handleClick: () => { },
    classes: {},
}


export default WVMenuListDropdown;