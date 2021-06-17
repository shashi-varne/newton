import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { isEmpty } from 'lodash';
import "./commonStyles.scss";

const RenderTabOptions = ({
  dataAidSuffix,
  activeTab,
  selectedFilters,
  onOptionsSelected,
  activeTabOptions,
}) => {
  const handleChange = (event) => {
    if (event.target.type === "radio")
      onOptionsSelected({
        ...selectedFilters,
        [activeTab]: event.target.value,
      });
    else {
      let presentSelected = selectedFilters[activeTab] || [];
      if (presentSelected.includes(event.target.value)) {
        let newArray = presentSelected.filter(
          (item) => item !== event.target.value
        );
        onOptionsSelected({ ...selectedFilters, [activeTab]: newArray });
      } else {
        presentSelected.push(event.target.value);
        onOptionsSelected({
          ...selectedFilters,
          [activeTab]: presentSelected,
        });
      }
    }
  };
  return (
    <FormControl component="fieldset" className="wv-render-tab-options-container">
      {!isEmpty(activeTabOptions) &&
        activeTabOptions.map((item, idx) => {
          return (
            <FormControlLabel
              data-aid={`tab-options-${dataAidSuffix}-${idx+1}`}
              value={item.value}
              name={item.isMulti}
              key={idx}
              control={
                <item.control
                  checked={(selectedFilters[activeTab] || []).includes(
                    item.value
                  )}
                  {...item?.controlProps}
                />
              }
              label={
                <div className="wv-tab-option-title">{item.title}
                  {item.subtitle && <p className="wv-tab-option-subtitle">{item.subtitle}</p>}
                </div>
              }
              onChange={handleChange}
              {...item?.labelProps}
            ></FormControlLabel>
          );
        })}
    </FormControl>
  );
};

export default RenderTabOptions;
