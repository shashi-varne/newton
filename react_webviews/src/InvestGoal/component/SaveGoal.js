import React,{useState} from 'react';
import Container from '../../fund_details/common/Container';
import { navigate as navigateFunc} from '../common/commonFunction';
import { formatAmountInr,numDifferentiationInr } from 'utils/validators';
import {getRateOfInterest} from "../../mf_journey_common/common/commonFunction"
import { storageService } from 'utils/validators';
import {get_recommended_funds} from "../../mf_journey_common/common/api"
import {saveGoalMapper} from "../constants"
import "./style.scss"
const stockReturns = 15;
  const bondReturns = 8;
const SaveGoal = (props) => {
    // const [amount,setAmount] = useState(0);
    // const [stockSplitVal, setStockSplitVal] = useState(0);
    
  const navigate = navigateFunc.bind(props);
  const {subtype,year} = props.match?.params;
  const term = parseInt(year - new Date().getFullYear());

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
        const {recommendation} = await get_recommended_funds(params);
        const monthlyAmount = getMonthlyCommitmentNew(amount,recommendation.equity)
        console.log("monthly amount is",monthlyAmount)
        const graphData = {
          year,
          amount:monthlyAmount,
          corpus:amount,
          stockSplit:recommendation.equity,
          subtype,
          term,
          investType:"saveforgoal"
        }
        storageService().setObject("graphData",graphData);
        goNext();
    }
    catch(err){
        console.log("the err is ",err)
    }
}
  const goNext = () => {
      navigate(`/invest/savegoal/amount`,true)
  }
  const calculateCorpusValue = (amount) => {
    return Math.round(amount * Math.pow(1 + 0.05, parseInt(year - new Date().getFullYear())));
  };

  
  const handleInvestedAmount = (type) => () =>{
    const amount =  calculateCorpusValue(type.corpus,type.name);
    fetchRecommendedFunds(amount)
    console.log("invested amount is",amount)
  }
  return (
    <Container
     //goBack={()=>{}}
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='Next'
      helpContact
      hideInPageTitle
      hidePageTitle
      title="Some heading"
      handleClick={goNext}
      noFooter
      classOverRideContainer='pr-container'
    >
     <section className="invest-goal-save-container">
        <div className="invest-goal-save-header">
        How much money do you want to save for retirement?
        </div>

        <div className="invest-goal-save-list">
            {
                saveGoalMapper[subtype]?.map((el,idx) => {
                    return(
                        <div key={idx} className="invest-goal-save-item" onClick={handleInvestedAmount(el)}>
                            <img src={el.icon} alt={el.name} width="80"/>
                            <p>{el.name}</p>
                            <div className="invest-goal-save-item-corpus">Corpus in {year}: <span>{numDifferentiationInr(calculateCorpusValue(el.corpus))}</span></div>
                        </div>
                    )
                })
            }
        </div>
        <div className="invest-goal-set-target">
            Let me set my target
        </div>
     </section>
    </Container>
  );
};
export default SaveGoal;
