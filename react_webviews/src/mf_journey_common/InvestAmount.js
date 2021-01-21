import React, { useState ,useEffect} from 'react';
import Container from '../fund_details/common/Container';
import { storageService,numDifferentiationInr ,formatAmountInr} from 'utils/validators';
import {navigate as navigateFunc, corpusValue,validateOtAmount,validateSipAmount} from "./common/commonFunction"
import {get_recommended_funds} from "./common/api"
import "./style.scss"
import Input from "common/ui/Input"
const InvestAmount = (props) => {
  const graphData = storageService().getObject("graphData");
  const goalRecommendation = storageService().getObject("goalRecommendations");
  const{investType,year,stockSplit,term,isRecurring,investTypeDisplay} = graphData;
    const [amount,setAmount] = useState(graphData?.amount || "");
    const [corpus,setCorpus] = useState(graphData?.corpus || "");
    const [error,setError] = useState(false);
    const [errorMsg,setErrorMsg] = useState("");
    const navigate = navigateFunc.bind(props);
    const handleChange = (e) => {
      setAmount(parseInt(e.target.value))
    }
    useEffect(() => {
      if(!amount){
        setErrorMsg("This is a required field");
        return;
      }
      let result;
      if(investTypeDisplay === "sip"){
        result = validateSipAmount(amount)
      } else{
        result = validateOtAmount(amount)
      }
      if(result?.error){
        setError(true);
        setErrorMsg(result?.message)
        return;
      } else{
        const valueOfCorpus = corpusValue(stockSplit,amount,investType,isRecurring,term)
        setCorpus(valueOfCorpus)
        setErrorMsg("");
        setError(false);
      }
    },[amount])
    const fetchRecommendedFunds = async () => {
      try{
        const params={
          amount,
          type:investType
        }
        if(investType === "saveforgoal"){
          params.subtype = graphData?.subtype;
          params.term = graphData?.term;
        } else if(investType === "investsurplus"){
          graphData['term'] = 3;
          params.term = 3; //  has to be modified (temp value)
        }
        await get_recommended_funds(params);

      }
      catch(err){
          console.log("the err is ",err)
      }
  }


    const goNext = () => {
      if(!amount){
        return;
      }
      fetchRecommendedFunds();
      storageService().setObject("graphData",{...graphData,amount});
      navigate(`${goalRecommendation.id}/funds`,{...graphData,amount})
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
      disable={error}
      title="Some heading"
     handleClick={goNext}
      classOverRideContainer='pr-container'
    >
     <section className="invest-amount-common">
        <div className="invest-amount-input">
            <p className="invest-amount-input-head">I want to invest</p>
            <div className="invest-amount-container">
              <Input
                id="invest-amount"
                class="invest-amount-num"
                value={amount}
                onChange={handleChange}
                type="number"
                error={error}
                helperText={error && errorMsg}
              />
            </div>
            <p className="invest-amount-input-duration">per month</p>
        </div>
        <div className="invest-amount-corpus">
            <div className="invest-amount-corpus-duration">Corpus in {year}:</div>
            <div className="invest-amount-corpus-amount">{numDifferentiationInr(corpus)}</div>
        </div>
     </section>
    </Container>
  );
};
export default InvestAmount;
