import React, { useEffect, useState } from 'react';
import Container from '../../../../fund_details/common/Container';
import { storageService } from 'utils/validators';
import {getRateOfInterest,navigate as navigateFunc,isRecurring} from "../../common/commonFunction"
import {get_recommended_funds} from "../../common/api"
import Input from 'common/ui/Input';
import './style.scss';
import { parse } from 'qs';

const term = 15;
const year = parseInt(new Date().getFullYear() + 15)
const Target = (props) => {
  const [targetAmount, setTargetAmount] = useState(0);
  const navigate = navigateFunc.bind(props);
  console.log("props val rae",props.match)
  const { subtype } = props.match?.params;
  
  useEffect(() => {

    switch (subtype) {
      case 'retirement':
      setTargetAmount(20000000);
      break;
      case 'childeducation':
        setTargetAmount(1000000);
      break;
    case 'childwedding':
      setTargetAmount(1500000);
      break;
    case 'vacation':
      setTargetAmount(200000);
      break;
    case 'other':
      setTargetAmount(20000000);
      break;
    default:
      setTargetAmount(0);
  }
    },[])
  const handleChange = (e) => {
    if(!isNaN(parseInt(e.target.value))){
      setTargetAmount(parseInt(e.target.value))
    }else{
      setTargetAmount("")
    }
  };
  const getMonthlyCommitmentNew = (corpusValue,stockSplitVal) => {
    var n = term * 12;
    var r = getRateOfInterest(stockSplitVal);
    var a = corpusValue;
    var i = (r / 12) / 100;
    var tmp = Math.pow((1 + i), n) - 1;
    var monthlyInvestment = (a * i) / tmp;
    var monthlyAmount = monthlyInvestment;
    if (monthlyAmount < 500) {
      monthlyAmount = 500;
    }
    return Math.floor(monthlyAmount);
  };
  const fetchRecommendedFunds = async (amount) => {
    try{
      const params={
        amount,
        type:"saveforgoal",
        subtype,
        term
      } 
        const recurring = isRecurring("saveforgoal");
        const {recommendation} = await get_recommended_funds(params);
        const monthlyAmount = getMonthlyCommitmentNew(amount,recommendation.equity)
        const graphData = {
          year,
          amount:monthlyAmount,
          corpus:amount,
          stockSplit:recommendation.equity,
          subtype,
          term,
          investType:"saveforgoal",
          isRecurring: recurring
        }
        storageService().setObject("goalRecommendations",recommendation.goal)
        storageService().setObject("graphData",graphData);
        navigate(`savegoal/${subtype}/amount`, true);
    }
    catch(err){
        console.log("the err is ",err)
    }
}

const goNext = () => {
  fetchRecommendedFunds(targetAmount)
  
};

  return (
    <Container
      //goBack={()=>{}}
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='Next'
      helpContact
      hideInPageTitle
      hidePageTitle
      title='Some heading'
      handleClick={goNext}
      classOverRideContainer='pr-container'
    >
      <section className='invest-goal-type-container'>
        <div>Set your target amount</div>
        <div className='invest-goal-type-input'>
        <Input
            id='invest-amount'
            class='invest-amount-num'
            value={targetAmount}
            onChange={handleChange}
            type='text'
            error={!targetAmount}
            helperText={!targetAmount && "This is a required field"}
            autoFocus
            maxLength={4}
            inputMode='numeric'
            pattern='[0-9]*'
          />
        </div>
      </section>
    </Container>
  );
};
export default Target;
