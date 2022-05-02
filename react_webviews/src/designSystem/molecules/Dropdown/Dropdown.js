import React, { useMemo, useState, useRef, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";
import { isObject, isEmpty } from "lodash-es";
import scrollIntoView from "scroll-into-view-if-needed";

import Typography from "../../atoms/Typography";
import Icon from "../../atoms/Icon";
// import Separator from "../../atoms/Separator";

import "./Dropdown.scss";

const menuProps = {
  classes: {
    root: "dropdown-popover",
    paper: "dropdown-menu-paper",
    list: "dropdown-menu-list",
  },
  "data-aid": "grp_selectionList",
  sx: {
    "&& .MuiMenuItem-root": {
      backgroundColor: "foundationColors.supporting.white",
      "&:hover": {
        backgroundColor: "foundationColors.supporting.white",
      },
      "&:focus": {
        backgroundColor: "foundationColors.supporting.white",
      },
    },
    "&& .Mui-selected": {
      backgroundColor: "foundationColors.primary.100",
      "&:hover": {
        backgroundColor: "foundationColors.primary.100",
      },
      "&:focus": {
        backgroundColor: "foundationColors.primary.100",
      },
    },
    "&& .MuiPaper-root": {
      borderTopColor: "foundationColors.supporting.gainsboro",
      "&::-webkit-scrollbar-track": {
        backgroundColor: "foundationColors.supporting.grey",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "foundationColors.supporting.gainsboro",
      },
    },
  },
};
const Dropdown = (props) => {
  const {
    label,
    helperText,
    error,
    inputLabelProps,
    disabled,
    onChange,
    value = "",
    variant,
    fullWidth,
    dataAid,
    className,
    options = [],
    displayKey,
    valueKey,
    ...restProps
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef();

  const { isValidValue, dropdownOptions } = useMemo(() => {
    const dropdownData = {};
    const menuValues = options.map((data) => {
      const menuData = getMenuData({ data, displayKey, valueKey });
      dropdownData[menuData.value] = menuData.title;
      return menuData.value;
    });
    return {
      isValidValue: !value || menuValues.includes(value),
      dropdownOptions: dropdownData,
    };
  }, [value, options]);

  useEffect(() => {
    if (itemRef.current && isOpen) {
      const element = itemRef.current;
      scrollIntoView(element, {
        block: "center",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [itemRef.current, isOpen]);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const getValue = (value) =>
    `${
      (!isValidValue || !value) && isOpen
        ? `Select`
        : isValidValue && value
        ? dropdownOptions[value]
        : ""
    }`;

  return (
    <FormControl
      fullWidth={fullWidth}
      disabled={disabled}
      data-aid={`dropdown_${dataAid}`}
      error={error}
      autoComplete="off"
      className="molecule-dropdown"
    >
      <InputLabel
        id="select-label"
        variant={variant}
        {...inputLabelProps}
        shrink={
          ((!isValidValue || !value) && isOpen) ||
          (isValidValue && !isEmpty(value))
        }
      >
        <Typography
          variant="body2"
          color="foundationColors.content.secondary"
          dataAid="label"
          sx={{
            pl: "8px",
          }}
        >
          {label}
        </Typography>
      </InputLabel>
      <Select
        labelId="select-label"
        id="dropdown"
        value={value}
        label={label}
        onChange={onChange}
        variant={variant}
        IconComponent={(iconProps) => {
          return (
            <Icon
              {...iconProps}
              src={require("assets/iv_down.svg")}
              dataAid="right1"
              imageWidth="24px"
              imageHeight="24px"
              style={{
                padding: "0px 10px",
                marginTop: "2px",
              }}
            />
          );
        }}
        fullWidth={fullWidth}
        className={`dropdown-selector ${isOpen && `dropdown-open`}`}
        MenuProps={menuProps}
        onOpen={onOpen}
        onClose={onClose}
        displayEmpty={true}
        renderValue={getValue}
        {...restProps}
      >
        {/* <Separator dataAid="1" /> */}
        {options.map((data, index) => {
          const menuData = getMenuData({
            data,
            displayKey,
            valueKey,
          });
          const elementRef = value === menuData.value ? itemRef : null;
          return (
            <MenuItem
              value={menuData.value}
              className="dropdown-menu-item"
              ref={elementRef}
              key={index}
            >
              <Typography variant="body2" dataAid={`text${index + 1}`}>
                {menuData.title}
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default Dropdown;

const getMenuData = ({ data, displayKey, valueKey }) => {
  const menuData = isObject(data)
    ? { title: data[displayKey], value: data[valueKey] }
    : { title: data, value: data };
  return {
    title: menuData.title,
    value: menuData.value?.toString(),
  };
};

Dropdown.defaultProps = {
  variant: "filled",
  fullWidth: true,
  options: [],
  displayKey: "name",
  valueKey: "value",
};

Dropdown.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataAid: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  valueKey: PropTypes.string,
  displayKey: PropTypes.string,
  options: PropTypes.array,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
};
