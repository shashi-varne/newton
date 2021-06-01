import React from 'react';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import { isEmpty } from "utils/validators";
import RadioGroup from '@material-ui/core/RadioGroup'
import "./commonStyles.scss"

const SortFilter = ({ localSortFilter, setLocalSortFilter, SortFilterData }) => {

  const handleChange = (event) => {
    console.log(event.target.value)
    setLocalSortFilter(event.target.value)
  }

  return (
    <FormControl component="fieldset" className="diy-sort-filter">
      <RadioGroup
        aria-label="Returns"
        name="sortFilter"
        className=""
        onChange={handleChange}
        value={localSortFilter}
      >
        {!isEmpty(SortFilterData) &&
          SortFilterData.map((item) => {
            return (
              <FormControlLabel
                value={item.value}
                control={<item.control color={item.color} />}
                label={
                    <div className="fc-title">{item.title}
                      {item.subtitle && <p className="fc-subtitle">{item.subtitle}</p>}
                    </div>
                }
                labelPlacement={item.labelPlacement}
              >
              </FormControlLabel>
            );
          })}
      </RadioGroup>
    </FormControl>
  )
}

export default SortFilter;