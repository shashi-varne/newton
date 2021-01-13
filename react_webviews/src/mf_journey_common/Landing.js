import React, { useState,useEffect } from 'react';
import Container from '../fund_details/common/Container';
import { storageService } from 'utils/validators';
import {formatAmountInr} from "../utils/validators"
import {navigate as navigateFunc} from "./common/commonFunction"
import {get_recommended_funds} from "./common/api"
import "./style.scss"
const term = 15;
const date = new Date();
const amount = 5000;
const Landing = (props) => {
    const [data,setData] = useState(null);
    const navigate = navigateFunc.bind(props);
    
    const fetchRecommendedFunds = async () => {
        const params = {
            type:"buildwealth"
        }
        try{

            const data = await get_recommended_funds(params);
            const graphData = {
                recommendation: data.recommendation,
                amount: 5000,
                term,
                // eslint-disable-next-line radix
                year: parseInt(date.getFullYear() + term),
                corpus:120000,
                investType:"buildwealth",
                stockSplit: data.recommendation.equity,
                bondSplit: data.recommendation.debt,
                flow: "build wealth"
            }
            storageService().setObject("graphData",graphData)
            setData(graphData);
        }
        catch(err){
            console.log("the err is ",err)
        }
    }

    useEffect(()=>{
        storageService().setObject("graphData",{})
        fetchRecommendedFunds()
    },[])
    const goNext = () => {
      navigate("invest-amount",data)
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
         <h1>Go the next page</h1>
        </section>
    </Container>
  );
};
export default Landing;
