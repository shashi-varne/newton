import React, { useState } from 'react';
import Container from '../../fund_details/common/Container';
import { navigate as navigateFunc} from '../common/commonFunction';
import "./style.scss"

const GoalType = (props) => {
  const [year,setYear] = useState(parseInt(new Date().getFullYear() + 15));
  const subtype = props.match?.params?.subtype;
  const navigate = navigateFunc.bind(props);
  const goNext = () => {
    navigate(`${subtype}/${year}`)
}
  const handleChange = (e) => {
    // if(typeof e.target.value !== Number){
    //   return
    // }
      setYear(e.target.value);
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
     <section className="invest-goal-type-container">
       <div>
         In year
       </div>
       <div className="invest-goal-type-input">
         <input type="number" value={year} onChange={handleChange}/>
       </div>
     </section>
    </Container>
  );
};
export default GoalType;
