import React from 'react';
import Container from '../fund_details/common/Container';
import { storageService } from 'utils/validators';
import {formatAmountInr} from "../utils/validators"
import FundCard from "./FundCard"
import "./style.scss"
import { navigate as navigateFunc} from './common/commonFunction';
const Recommendations = (props) => {
    const {recommendation,alternatives} = storageService().getObject("graphData");
    const navigate = navigateFunc.bind(props);
    const EditFund = () => {
        const data= {
            recommendation,
            alternatives
        }
        navigate("edit-funds",data)
    }
  return (
    <Container
     //goBack={()=>{}}
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='How It Works?'
      helpContact
      hideInPageTitle
      hidePageTitle
      title="Some heading"
     // handleClick={retry}
      classOverRideContainer='pr-container'
    >
     <section className="recommendations-common-container">
        <div className="recommendations-header">
            <div>
                Our Recommendation
            </div>
            <div onClick={EditFund}>
                Edit
            </div>
        </div>
        <div className="recommendations-funds-lists">
            {
                recommendation && recommendation?.map((el,idx) => (
                    <FundCard key={idx} fund={el} history={props.history}/>
                ))
            }
        </div>
        <div className="recommendations-total-investment">
            <div>
                Total Investment
            </div>

            <div>
                50000
            </div>
        </div>
        <div className="recommendations-disclaimer">
            <div>
                Morning Star
            </div>
            <div>
                <p>
                By clicking on the button below, I agree that I have read and accepted 
                the terms & conditions and understood the scheme offer documents
                </p>
            </div>
        </div>
     </section>
    </Container>
  );
};
export default Recommendations;
