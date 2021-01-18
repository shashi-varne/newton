import React, { useState,useEffect } from 'react';
import Container from '../fund_details/common/Container';
import { storageService } from 'utils/validators';
import {formatAmountInr} from "../utils/validators"
import {navigate as navigateFunc,isRecurring} from "./common/commonFunction"
import {get_recommended_funds} from "./common/api"
import "./style.scss"
const term = 15;
const date = new Date();
const investType = "buildwealth"
const Landing = (props) => {
    const [data,setData] = useState(null);
    const navigate = navigateFunc.bind(props);
    console.log(props.match)
    const fetchRecommendedFunds = async () => {
        const params = {
            type:investType
        }
        try{
            const recurring  = isRecurring(investType)
            const data = await get_recommended_funds(params);
            const graphData = {
                recommendation: data.recommendation,
                amount: 5000,
                term,
                // eslint-disable-next-line radix
                year: parseInt(date.getFullYear() + term),
                corpus:120000,
                investType,
                stockSplit: data.recommendation.equity,
                bondSplit: data.recommendation.debt,
                flow: "build wealth",
                isRecurring:recurring
            }
            storageService().setObject("goalRecommendations",data.recommendation.goal)
            storageService().setObject("graphData",graphData)
            setData(graphData);
            goNext();
        }
        catch(err){
            console.log("the err is ",err)
        }
    }

    // useEffect(()=>{
    //     fetchRecommendedFunds()
    // },[])
    const goNext = () => {
      navigate(`${investType}/amount`,data)
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
     handleClick={fetchRecommendedFunds}
      classOverRideContainer='pr-container'
    >
     <section className="invest-amount-common">
         <h1>Go the next page</h1>
        </section>
    </Container>
  );
};
export default Landing;
