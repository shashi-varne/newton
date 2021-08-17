import './WVMenuListDropdown.scss';
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

  const itemSelected = (propObj) => {
    setSelected(propObj.key === selected ? "" : propObj.key)
    handleClick(propObj)
  }

  return (
    <>
      {!isEmpty(renderPorducts) &&
        renderPorducts.map((propObj, idx) => {
          return (
            <WVMenuListDropDown
              index={idx}
              title={propObj.title}
              subtitle={propObj.subtitle}
              keyname={propObj.key}
              image={propObj.image}
              handleClick={() => itemSelected(propObj)}
              selected={selected}
              classes={propObj.className}
              isDropDown={propObj.isDropDown}
              renderPorductsList={renderPorductsList}
              dataAidSuffix={dataAidSuffix} >
              {children}
            </WVMenuListDropDown>
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
