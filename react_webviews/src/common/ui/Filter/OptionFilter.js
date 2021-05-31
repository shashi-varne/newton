import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import "./commonStyles.scss"

const OptionFilter = ({ localFundOption, setLocalFundOption }) => {
  const handleChange = (event) => {
    setLocalFundOption(event.target.value)
  }

  return (
    <FormControl component="fieldset" className="diy-option-filter">
      <RadioGroup
        aria-label="Fund Options"
        name="localFundOption"
        className=""
        onChange={handleChange}
        value={localFundOption}
      >
        <FormControlLabel
          value="growth"
          control={<Radio color="secondary" />}
          label="Growth"
        />
        <FormControlLabel
          value="dividend"
          control={<Radio color="secondary" />}
          label="Dividend"
        />
      </RadioGroup>
    </FormControl>
  )
}

export default OptionFilter
