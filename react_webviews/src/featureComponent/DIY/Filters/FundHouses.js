import { FormControl, FormControlLabel, FormGroup, Stack } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import SearchBar from '../../../designSystem/molecules/SearchBar';
import Checkbox from '../../../designSystem/atoms/Checkbox';
import isEmpty from 'lodash/isEmpty';

import './FundHouses.scss';
import Typography from '../../../designSystem/atoms/Typography';

const FundHouses = ({ activeFundHouses, setActiveFundHouses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fundHouseList, setFundHouseList] = useState(FundHouseOptions);

  const handleChange = (option) => () => {
    const isFundAdded = activeFundHouses.includes(option.label);
    if (!isFundAdded) {
      setActiveFundHouses([...activeFundHouses, option.label]);
    } else {
      const filteredFundHouses =  activeFundHouses.filter((el) => el !== option.label)
      // selectedFunds.splice(isFundAdded.label, 1);
      setActiveFundHouses(filteredFundHouses);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredFunds = FundHouseOptions?.filter((el, idx) =>
      el.label.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFundHouseList(filteredFunds);
  };

  return (
    <div className='fund-house-wrapper'>
      <SearchBar placeholder='Search...' value={searchQuery} onChange={handleSearch} />
      <Stack sx={{ mt: 1, height:'calc(100vh - 300px)', overflowY: 'auto' }}>
        {isEmpty(fundHouseList) && (
          <Typography align='center' variant='body2' color='foundationColors.supporting.cadetBlue'>
            No results
          </Typography>
        )}
        <Stack direction='column' spacing={2} sx={{ ml: 2 }}>
          {fundHouseList?.map((option, idx) => {
            const selectedValue = activeFundHouses?.includes(option.label);
            const selectedColor = selectedValue
              ? 'foundationColors.primary.content'
              : 'foundationColors.content.secondary';
            return (
              <Stack direction='row' spading={2} key={idx}>
                <Checkbox checked={selectedValue} onChange={handleChange(option)} />
                <Typography color={selectedColor} sx={{ ml: 2 }} variant='body2'>
                  {option.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </div>
  );
};

const FundHouseOptions = [
  {
    id: 0,
    label: 'HDFC',
    value: 'hdfc',
  },
  {
    id: 1,
    label: 'Canara',
    value: 'canara',
  },
  {
    id: 2,
    label: 'Idfc',
    value: 'idfc',
  },
  {
    id: 3,
    label: 'Axis',
    value: 'axis',
  },
  {
    id: 4,
    label: 'SBI',
    value: 'sbi',
  },
  {
    id: 5,
    label: 'PNB',
    value: 'pnb',
  },
  {
    id: 6,
    label: 'Hdfc',
    value: 'hdfc',
  },
  {
    id: 7,
    label: 'Canara',
    value: 'canara',
  },
  {
    id: 8,
    label: 'Idfc',
    value: 'idfc',
  },
  {
    id: 9,
    label: 'Axis',
    value: 'axis',
  },
  {
    id: 10,
    label: 'SBI',
    value: 'sbi',
  },
  {
    id: 11,
    label: 'PNB',
    value: 'pnb',
  },
  {
    id: 0,
    label: 'Hdfc',
    value: 'hdfc',
  },
  {
    id: 1,
    label: 'Canara',
    value: 'canara',
  },
  {
    id: 2,
    label: 'Idfc',
    value: 'idfc',
  },
  {
    id: 3,
    label: 'Axis',
    value: 'axis',
  },
  {
    id: 4,
    label: 'SBI',
    value: 'sbi',
  },
  {
    id: 5,
    label: 'PNB',
    value: 'pnb',
  },
  {
    id: 6,
    label: 'Hdfc',
    value: 'hdfc',
  },
  {
    id: 7,
    label: 'Canara',
    value: 'canara',
  },
  {
    id: 8,
    label: 'Idfc',
    value: 'idfc',
  },
  {
    id: 9,
    label: 'Axis',
    value: 'axis',
  },
  {
    id: 10,
    label: 'SBI',
    value: 'sbi',
  },
  {
    id: 11,
    label: 'PNB',
    value: 'pnb',
  },
];

export default FundHouses;
