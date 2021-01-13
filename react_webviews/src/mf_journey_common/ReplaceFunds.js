import React, { useState, useEffect } from 'react';
import Container from '../fund_details/common/Container';
import { storageService } from 'utils/validators';
import { FormControl, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import FundCard from './FundCard';
import './style.scss';
import { navigate as navigateFunc } from './common/commonFunction';
const ReplaceFunds = (props) => {
  const [alternateFunds, setAlternateFunds] = useState(null);
  const [selectedFund, setSelectedFund] = useState('');
  const { recommendation, alternatives } = storageService().getObject('graphData');
  const { graphData: {mftype,mfid,amount} } = props.location.state;
  const navigate = navigateFunc.bind(props);
  useEffect(() => {
    filterAlternateFunds();
  }, []);
  const filterAlternateFunds = () => {
    // eslint-disable-next-line no-unused-expressions
    recommendation?.forEach((el) => {
      return alternatives[mftype]?.forEach((alt, idx) => {
        if (alt.mf.mfid === el.mf.mfid) {
          // eslint-disable-next-line no-unused-expressions
          alternatives[mftype].splice(idx, 1);
        }
      });
    });
    setAlternateFunds(alternatives[mftype]);
  };
  const handleChange = (e) => {
    setSelectedFund(e.target.value);
  };
  const replaceFund = () => {
      const alternateFund = alternatives[mftype].find(el => el.mf.mfid === selectedFund);
      if(alternateFund){

        alternateFund.amount = amount;
        const newData = recommendation?.map(el => {
          if(el.mf.mfid === mfid){
            return alternateFund
          } 
          return el;
        })
        const graphData = storageService().getObject("graphData");
        graphData.recommendation = newData;
        storageService().setObject("graphData",graphData);
      }
        navigate("edit-funds");
  }
  return (
    <Container
      //goBack={()=>{}}
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='Done'
      helpContact
      hideInPageTitle
      hidePageTitle
      title='Some heading'
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
                control={<Radio />}
                label={<FundCard fund={el} history={props.history} />}
              />
            ))}
            
          </RadioGroup>
        </FormControl>
        <div>
        {
          alternateFunds?.length === 0 && <h1>No alternative fund</h1>
        }
        </div>
      </section>
    </Container>
  );
};
export default ReplaceFunds;
