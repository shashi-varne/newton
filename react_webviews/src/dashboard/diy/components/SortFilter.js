import React, { useEffect, useState } from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { storageService } from '../../../utils/validators'

const SortFilter = ({ localSortFilter, setLocalSortFilter}) => {
  
  const handleChange = (event) => {
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
        <FormControlLabel
          value="returns"
          control={<Radio color="secondary" />}
          label="Returns - High to Low"
        />
        <FormControlLabel
          value="rating"
          control={<Radio color="secondary" />}
          label="Rating - High to Low"
        />
        <FormControlLabel
          value="fundsize"
          control={<Radio color="secondary" />}
          label="Fund Size - High to Low"
        />
      </RadioGroup>
    </FormControl>
  )
}

export default SortFilter
