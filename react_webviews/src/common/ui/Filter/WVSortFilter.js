import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { isEmpty } from 'lodash';
import "./WVFilterCommonStyles.scss";

const WVSortFilter = ({
  selectedTab,
  localSortFilter,
  setLocalSortFilter,
  SortFilterData,
}) => {
  const handleChange = (event) => {
    if (event.target.type === "radio")
      setLocalSortFilter({
        ...localSortFilter,
        [selectedTab]: event.target.value,
      });
    else {
      let presentSelected = localSortFilter[selectedTab] || [];
      if (presentSelected.includes(event.target.value)) {
        let newArray = presentSelected.filter(
          (item) => item !== event.target.value
        );
        setLocalSortFilter({ ...localSortFilter, [selectedTab]: newArray });
      } else {
        presentSelected.push(event.target.value);
        setLocalSortFilter({
          ...localSortFilter,
          [selectedTab]: presentSelected,
        });
      }
    }
  };
  return (
    <FormControl component="fieldset" className="diy-sort-filter">
        {!isEmpty(SortFilterData) &&
          SortFilterData.map((item, idx) => {
            return (
              <FormControlLabel
                value={item.value}
                name={item.isMulti}
                key={idx}
                control={
                  <item.control
                    checked={(localSortFilter[selectedTab] || []).includes(
                      item.value
                    )}
                    color={item.color}
                  />
                }
                label={
                  <div className="fc-title">{item.title}
                    {item.subtitle && <p className="fc-subtitle">{item.subtitle}</p>}
                  </div>
                }
                onChange={handleChange}
                labelPlacement={item.labelPlacement}
              ></FormControlLabel>
            );
          })}
    </FormControl>
  );
};

export default WVSortFilter; 
