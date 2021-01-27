import React, { useEffect, useState } from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { storageService } from '../../../utils/validators'

const SortFilter = () => {
  const [sortFilter, setSortFilter] = useState('')
  const handleChange = (event) => {
    storageService().set('diystore_sortFilter', event.target.value)
    setSortFilter(event.target.value)
  }
  useEffect(() => {
    const diySortFilter = storageService().get('diystore_sortFilter')
    if (diySortFilter) {
      setSortFilter(diySortFilter)
    }
  }, [])

  return (
    <FormControl component="fieldset" className="diy-sort-filter">
      <RadioGroup
        aria-label="Returns"
        name="sortFilter"
        className=""
        onChange={handleChange}
        value={sortFilter}
      >
        <FormControlLabel
          value="returns"
          control={<Radio color="secondary" />}
          label="Returns - High to Low"
        />
        <FormControlLabel
          value="options"
          control={<Radio color="secondary" />}
          label="Options - High to Low"
        />
        <FormControlLabel
          value="choice"
          control={<Radio color="secondary" />}
          label="Choice - High to Low"
        />
      </RadioGroup>
    </FormControl>
  )
}

export default SortFilter
