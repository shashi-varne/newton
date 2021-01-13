import React, { useState } from 'react';
import Container from '../fund_details/common/Container';
import { storageService } from 'utils/validators';
import {formatAmountInr} from "../utils/validators"
import {FormControl,FormLabel,FormControlLabel,RadioGroup,Radio} from "@material-ui/core"
import FundCard from "./FundCard"
import "./style.scss"
import { navigate as navigateFunc} from './common/commonFunction';
const ReplaceFunds = (props) => {
   // const [alternateFunds,setAlternateFunds] = useState(null);
    const {alternatives} = storageService().getObject("graphData");
    const {mfType} = props.location.state.graphData;
    // if(mfType === "balanced"){
    //     setAlternateFunds(alternatives?.balanced)
    // } else{
    //     setAlternateFunds(alternatives?.equity)
    // }
    const EditFund = () => {
        // navigate("edit-funds",data)
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
     <FormControl component="fieldset">
      <RadioGroup aria-label="gender" name="gender1" value="female" onChange={()=>{}}>
            {
                alternatives?.balanced?.map((el,idx) => (
                    <FundCard key={idx} fund={el} history={props.history}/>
                ))
            }
  </RadioGroup>
</FormControl>
     </section>
    </Container>
  );
};
export default ReplaceFunds;
