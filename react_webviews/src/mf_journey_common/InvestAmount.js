import React, { useState ,useEffect} from 'react';
import Container from '../fund_details/common/Container';
import { storageService } from 'utils/validators';
import {formatAmountInr} from "../utils/validators"
import {navigate as navigateFunc} from "./common/commonFunction"
import {get_recommended_funds} from "./common/api"
import "./style.scss"
const InvestAmount = (props) => {
    const [amount,setAmount] = useState("");
    const [year,setYear] = useState(null);
    const [corpus,setCorpus] = useState(null);
    const navigate = navigateFunc.bind(props);
    const handleChange = (e) => {
      setAmount(parseInt(e.target.value))
    }
    const graphData = storageService().getObject("graphData");
    useEffect(()=>{
      const{amount,corpus,year} = graphData;
      setAmount(amount)
      setYear(year)
      setCorpus(corpus)
    },[])
    const fetchRecommendedFunds = async () => {
      const{investType} = graphData;
      try{
        const params={
          amount,
          type:investType,
        }
          const data = await get_recommended_funds(params);
          console.log("data is",data);

      }
      catch(err){
          console.log("the err is ",err)
      }
  }


    const goNext = () => {
      fetchRecommendedFunds();
      storageService().setObject("graphData",{...graphData,amount});
      navigate("invested-amount",{...graphData,amount})
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
      classOverRideContainer='pr-container'
    >
     <section className="invest-amount-common">
        <div className="invest-amount-input">
            <p className="invest-amount-input-head">I want to invest</p>
            <div>
                <input inputMode="numeric" className="invest-amount-num" onChange={handleChange} value={amount} type="text" />
            </div>
            <p className="invest-amount-input-duration">per month</p>
        </div>
        <div className="invest-amount-corpus">
            <div className="invest-amount-corpus-duration">Corpus in {year}:</div>
            <div className="invest-amount-corpus-amount">₹ {corpus} Lac</div>
        </div>
     </section>
    </Container>
  );
};
export default InvestAmount;
