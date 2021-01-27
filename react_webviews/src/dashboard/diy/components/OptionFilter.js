import React, { useEffect, useState } from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { storageService } from '../../../utils/validators'

const OptionFilter = () => {
  const [fundOption, setFundOption] = useState('')

  useEffect(() => {
    const diyFundOption = storageService().get('diystore_fundOption')
    if (diyFundOption) {
      setFundOption(diyFundOption)
    }
  }, [])

  const handleChange = (event) => {
    storageService().set('diy_fundOption', event.target.value)
    setFundOption(event.target.value)
  }

  return (
    <FormControl component="fieldset" className="diy-option-filter">
      <RadioGroup
        aria-label="Fund Options"
        name="diyOptionFilter"
        className=""
        onChange={handleChange}
        value={fundOption}
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
