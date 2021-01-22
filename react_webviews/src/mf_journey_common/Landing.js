import React, { useState,useEffect } from 'react';
import Container from '../fund_details/common/Container';
import { storageService } from 'utils/validators';
import {formatAmountInr} from "../utils/validators"
import {navigate as navigateFunc,isRecurring} from "./common/commonFunction"
import {get_recommended_funds} from "./common/api"
import InvestType from "../dashboard/invest/components/mini_components/InvestType"
import "./style.scss"
const term = 15;
const date = new Date();
const month = date.getMonth();
const currentMonth = month + 1;
let currentYear = date.getFullYear();
let duration = (currentMonth > 3) ? 15 - currentMonth : 3 - currentMonth;
if (duration === 0) {
  duration = 1;
}
if (currentMonth > 3) {
  currentYear = currentYear + 1;
}
const investTypeMapper = {
  savetax:{
    maxSavingsAmount:150000,
    eligibleAmount:150000,
    onetime:150000,
    sip:parseInt(Math.floor(150000 / duration)),
  }
}
const renderData =  {
    title: "How would you like to invest?",
    count: "1",
    total: "2",
    options: [
      {
        text: "SIP",
        value: "sip",
        icon: "ic_sip.svg",
      },
      {
        text: "One Time",
        value: "onetime",
        icon: "ic_onetime.svg",
      },
    ],
  }
const Landing = (props) => {
    const [data,setData] = useState(null);
    const [investTypeDisplay,setInvestTypeDisplay] = useState("sip")
    const [investType,setInvestType] = useState("");
    const navigate = navigateFunc.bind(props);
    console.log(props.match)
    useEffect(() => {
        const path = props.match.path;
        const result = path.match(/\w+$/g);
        console.log("result is",result)
        setInvestType(result[0])

    },[])
    const fetchRecommendedFunds = async () => {

        const params = {
            type:investType
        }
        if(investType === "savetax"){
          if(investTypeDisplay === "sip"){
            params.type = "savetaxsip"
          }
        } else if(investType === "parkmoney"){
          params.type = "investsurplus"
        }
        try{
          const recurring  = isRecurring(params.type)
          const data = await get_recommended_funds(params);
            const graphData = {
                recommendation: data.recommendation,
                amount: investTypeMapper[investType][investTypeDisplay],
                term,
                // eslint-disable-next-line radix
                year: parseInt(date.getFullYear() + term),
                corpus:120000,
                investType:params.type,
                stockSplit: data.recommendation.equity,
                bondSplit: data.recommendation.debt,
                flow: "build wealth",
                isRecurring:recurring,
                investTypeDisplay
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

    const goNext = () => {
      navigate(`${investType}/amount`,data)
    }
    const handleChange = (type) => {
        setInvestTypeDisplay(type)
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
     <InvestType
            baseData={renderData}
            selected={investTypeDisplay}
            handleChange={handleChange}
          />
        </section>
    </Container>
  );
};
export default Landing;
