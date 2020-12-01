import React, { useEffect, useState } from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { UnSelectedRadio, SelectedRadio } from '../common/RadioBox';
import { storageService } from '../../utils/validators';
import isEmpty from 'lodash/isEmpty';
const styles = {
  root: {
    width: 'fit-content',
    padding: '0px 0px 5px 0px',
    margin: '0px',
    '&:last-child': {
      padding: '0px',
    },
  },
  label: {
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '21px',
    color: '#767E86',
    marginLeft: '20px',
  },
};
const FilterSection = ({
  type,
  filterList,
  id,
  classes,
  onFilterChange,
  clearFilter,
  filter_key,
}) => {
  const [value, setValue] = useState(null);
  const ref = React.useRef(filter_key);
  const handleChange = (id, value) => {
    setValue(value);
    onFilterChange(id, value);
  };
  useEffect(() => {
    const data = storageService().getObject(filter_key);
    if (!isEmpty(data)) {
      setValue(data[id]);
    }
    if (clearFilter) {
      setValue(null);
    }
  }, [clearFilter]);
  return (
    <div className='iwd-filter-section'>
      <FormControl component='fieldset'>
        <div className='iwd-filter-type'>{type}</div>

        <RadioGroup
          aria-label={type}
          name={type}
          value={value}
          onChange={(e) => handleChange(id, e.target.value)}
        >
          {filterList?.map((el) => {
            return (
              <FormControlLabel
                classes={{ root: classes.root, label: classes.label }}
                key={el.value}
                value={el.value}
                control={<Radio icon={<UnSelectedRadio />} checkedIcon={<SelectedRadio />} />}
                label={el.label}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default withStyles(styles)(FilterSection);
