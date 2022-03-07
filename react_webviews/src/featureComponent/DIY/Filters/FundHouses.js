import { Stack } from '@mui/material';
import React, { useMemo, useState } from 'react';
import SearchBar from '../../../designSystem/molecules/SearchBar';
import Checkbox from '../../../designSystem/atoms/Checkbox';
import isEmpty from 'lodash/isEmpty';

import './FundHouses.scss';
import Typography from '../../../designSystem/atoms/Typography';
import { useSelector } from 'react-redux';
import { getFundHouses } from "businesslogic/dataStore/reducers/diy";
import { getConfig } from '../../../utils/functions';
const FundHouses = ({ activeFundHouses, setActiveFundHouses }) => {
  const fundHouses = useSelector(getFundHouses);
  const [searchQuery, setSearchQuery] = useState('');
  const [fundHouseList, setFundHouseList] = useState(fundHouses);
  const { isMobileDevice } = useMemo(getConfig, [])

  const handleChange = (option) => () => {
    const isFundAdded = activeFundHouses.includes(option);
    if (!isFundAdded) {
      setActiveFundHouses([...activeFundHouses, option]);
    } else {
      const filteredFundHouses =  activeFundHouses.filter((el) => el !== option)
      setActiveFundHouses(filteredFundHouses);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredFunds = fundHouses?.filter(el =>
      el.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFundHouseList(filteredFunds);
  };

  return (
    <div className='fund-house-wrapper' data-aid="grp_fundsName">
      <SearchBar placeholder='Search...' value={searchQuery} onChange={handleSearch} dataAid="fundHouse" inputDataAid="tv_title" />
      <Stack sx={{ mt: 1, height: isMobileDevice ? 'calc(100vh - 220px)' : 'calc(100vh - 300px)', overflowY: 'auto' }}>
        {isEmpty(fundHouseList) && (
          <Typography align='center' variant='body2' color='foundationColors.supporting.cadetBlue' dataAid="noResult">
            No results
          </Typography>
        )}
        <Stack direction='column' spacing={2} sx={{ ml: 2 }} data-aid="grp_fundHouseList" >
          {fundHouseList?.map((option, idx) => {
            const isSelected = activeFundHouses?.includes(option);
            const selectedColor = isSelected
              ? 'foundationColors.primary.content'
              : 'foundationColors.content.secondary';
            return (
              <Stack direction='row' spading={2} key={idx} data-aid={`grp_${idx+1}`} >
                <Checkbox checked={isSelected} onChange={handleChange(option)} dataAid={idx+1} />
                <Typography color={selectedColor} sx={{ ml: 2 }} variant='body2' dataAid={`list${idx+1}`} >
                  {option}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </div>
  );
};

export default FundHouses;
