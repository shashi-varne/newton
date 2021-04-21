import React, { useState } from 'react';
import Container from '../common/Container';
import { FormControl, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import FundCard from '../Invest/mini-components/FundCard';
import useFunnelDataHook from '../Invest/common/funnelDataHook';

import './ReplaceFunds.scss';

const ReplaceFunds = (props) => {
  const [selectedFund, setSelectedFund] = useState('');
  const { funnelData, updateFunnelData } = useFunnelDataHook();
  const { recommendation, alternatives } = funnelData;
  const {
    mftype, mfid, amount, alternateFunds,
  } = props.location.state;

  const handleChange = (e) => {
    setSelectedFund(e.target.value);
  };

  const replaceFund = () => {
    const alternateFund = alternatives[mftype].find((el) => el.mf.mfid === selectedFund);
    if (alternateFund) {
      alternateFund.amount = amount;
      const newData = recommendation?.map((el) => {
        if (el.mf.mfid === mfid) {
          return alternateFund;
        }
        return el;
      });
      updateFunnelData({ recommendation: newData });
    }
    props.history.goBack();
  };
  
  return (
    <Container
      classOverRide='pr-error-container'
      buttonTitle='Done'
      title='Replace fund'
      handleClick={replaceFund}
      classOverRideContainer='pr-container'
    >
      <section className='recommendations-common-container'>
        <FormControl component='fieldset'>
          <RadioGroup
            aria-label='alternateFund'
            value={selectedFund}
            name='alternateFund'
            onChange={handleChange}
          >
            {alternateFunds?.map((el, idx) => (
              <FormControlLabel
                className='alternate-funds-item'
                key={idx}
                value={el?.mf?.mfid}
                labelPlacement='start'
                control={<Radio color="primary"/>}
                label={<FundCard fund={el} history={props.history} />}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <div>{alternateFunds?.length === 0 && <h1>No alternative fund</h1>}</div>
      </section>
    </Container>
  );
};
export default ReplaceFunds;
