import './WVMenuListDropdown.Scss';
import React, { useState } from "react";
import WVMenuListDropDown from './WVMenuListDropdownItem';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';


const WVMenuListDropDownList = ({
  dataAidSuffix,
  renderPorducts,
  renderPorductsList,
  children,
  handleClick,
  ...props
}) => {

  const [selected, setSelected] = useState('');


  return (
    <>
      {!isEmpty(renderPorducts) &&
        renderPorducts.map((propObj, idx) => {
          return (
            <div className="wv-menulist-products" {...props} onClick={() => setSelected(propObj.key === selected ? "" : propObj.key)}>
              <WVMenuListDropDown
                index={idx}
                title={propObj.title}
                subtitle={propObj.subtitle}
                keyname={propObj.key}
                image={propObj.image}
                handleClick={() => handleClick(propObj)}
                selected={selected}
                classes={propObj.className}
                isDropDown={propObj.isDropDown}
                renderPorductsList={renderPorductsList}
                dataAidSuffix={dataAidSuffix} >
                  {children}
              </WVMenuListDropDown>
            </div>
          )
        })}
    </>
  );
}



export default WVMenuListDropDownList;


WVMenuListDropDownList.propTypes = {
  handleClick: PropTypes.func,
  children: PropTypes.node,
  renderPorducts: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.node,
      subtitle: PropTypes.node,
      isDropDown: PropTypes.bool,
      classes: PropTypes.string,
  })),
  renderPorductsList: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.node,
    subtitle: PropTypes.node,
    classes: PropTypes.string,
}))
};

WVMenuListDropDownList.defaultProps = {
  handleClick: () => { },
  classes: {},
  dataAidSuffix: "",
};
