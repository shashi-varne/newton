import React from 'react';
import Container from '../../../fund_details/common/Container';
import { navigate as navigateFunc} from '../common/commonFunction';

const saveGoal = {
  "Retirement":{
    name:"retirement",
    icon:require("assets/retirement_fund_icon.png")
  },
  "Child's Education":{
    name:"childeducation",
    icon:require("assets/child_education_icon.png")
  },
  "Child's Wedding":{
    name:"childwedding",
    icon:require("assets/wedding_icon.png")
  },
  "Vacation":{
    name:"vacation",
    icon:require("assets/vacation_icon.png")
  },
  "Other":{
    name:"other",
    icon:require("assets/other_goal_icon.png")
  }
}
const InvestGoal = (props) => {
  const navigate = navigateFunc.bind(props);
  const goNext = (name) => ()=> {
    navigate(`savegoal/${name}`)
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
      noFooter
    //  handleClick={goNext}
      classOverRideContainer='pr-container'
    >
     <section className="invest-goal-container">
       <div className="invest-goal-list-type">
        {
          Object.keys(saveGoal).map((key,idx) => {
            return <div key={idx} className="invest-goal-list-item" onClick={goNext(saveGoal[key].name)}>
              <div>
                <img src={saveGoal[key].icon} alt={key}/>
                </div>
                <div>{key}</div>
              </div>
          })
        }
       </div>
     </section>
    </Container>
  );
};
export default InvestGoal;
