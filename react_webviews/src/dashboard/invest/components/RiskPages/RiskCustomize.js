import { CircularProgress } from 'material-ui';
import React, { useState } from 'react';
import { storageService } from '../../../../utils/validators';
import Container from '../../../common/Container';
import { get_recommended_funds } from '../../common/api';
import { navigate as navigateFunc, selectTitle } from '../../common/commonFunction';
import EquityDebtSlider from '../mini_components/EquityDebtSlider';
import toast from 'common/ui/Toast'
import './RiskPages.scss';
import InfoBox from '../../../../common/ui/F-InfoBox';
import { getConfig } from '../../../../utils/functions';

const { productName } = getConfig();

const RiskCustomize = (props) => {
  const graphData = storageService().getObject('graphData');
  const [loader, setLoader] = useState(false);
  // const [title, setTitle] = useState('');
  const navigate = navigateFunc.bind(props);
  const [stockSplit, setStockSplit] = useState(graphData.stockSplit || 0);
  const [bondSplit, setBondSplit] = useState(100 - stockSplit);

  // useEffect(() => {
  //   const investTitle = selectTitle(graphData.investType);
  //   setTitle(investTitle);
  // }, []);

  const fetchRecommendations = async () => {
    const { amount, investType: type, term } = graphData;
    var params = {
      amount,
      term,
      type,
      equity: stockSplit,
      debt: bondSplit,
      rp_enabled: true,
    };

    try {
      setLoader(true);
      const res = await get_recommended_funds(params);

      storageService().setObject('graphData', {
        ...graphData,
        ...res,
        stockSplit: stockSplit,
        bondSplit: bondSplit
      });
      storageService().set('userSelectedRisk', 'Custom');

      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
      throw(err);
    }
  }


  const goNext = async () => {
    try {
      await fetchRecommendations();
      navigate('recommendations');
    } catch (err) {
      console.log(err);
      toast(err)
    }
  };

  const handleChange = (value) => {
    setStockSplit(value);
    setBondSplit(100 - value);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle={loader ? <CircularProgress size={22} thickness={4} /> : 'Next'}
      helpContact
      disable={loader}
      title='Customise Equity-Debt distribution'
      handleClick={goNext}
      classOverRideContainer='pr-container'
    >
      <>
        <InfoBox
          image={require(`assets/${productName}/info_icon.svg`)}
          classes={{
            root: 'risk-info'
          }}
        >
          <div className="risk-info-title">Info</div>
          <div className="risk-info-desc">
            We do not recommend setting custom equity & debt 
            distribution if you are unfamiliar with market dynamics.
          </div>
        </InfoBox>
        <EquityDebtSlider
          stockSplit={stockSplit}
          onChange={handleChange}
        />
      </>
    </Container>
  );
};

export default RiskCustomize;