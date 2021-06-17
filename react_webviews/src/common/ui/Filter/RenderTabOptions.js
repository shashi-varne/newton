import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { isEmpty } from 'lodash';
import "./commonStyles.scss";

const RenderTabOptions = ({
  activeTab,
  selectedFilters,
  setSelectedFilters,
  activeTabOptions,
}) => {
  const handleChange = (event) => {
    if (event.target.type === "radio")
      setSelectedFilters({
        ...selectedFilters,
        [activeTab]: event.target.value,
      });
    else {
      let presentSelected = selectedFilters[activeTab] || [];
      if (presentSelected.includes(event.target.value)) {
        let newArray = presentSelected.filter(
          (item) => item !== event.target.value
        );
        setSelectedFilters({ ...selectedFilters, [activeTab]: newArray });
      } else {
        presentSelected.push(event.target.value);
        setSelectedFilters({
          ...selectedFilters,
          [activeTab]: presentSelected,
        });
      }
    }
  };
  return (
    <FormControl component="fieldset" className="render-tab-filter-container">
      {!isEmpty(activeTabOptions) &&
        activeTabOptions.map((item, idx) => {
          return (
            <FormControlLabel
              value={item.value}
              name={item.isMulti}
              key={idx}
              control={
                <item.control
                  checked={(selectedFilters[activeTab] || []).includes(
                    item.value
                  )}
                  {...item.controlProps}
                />
              }
              label={
                <div className="wv-selected-tab-title">{item.title}
                  {item.subtitle && <p className="wv-selected-tab-subtitle">{item.subtitle}</p>}
                </div>
              }
              onChange={handleChange}
              {...item.labelProps}
            ></FormControlLabel>
          );
        })}
    </FormControl>
  );
};

export default RenderTabOptions;
