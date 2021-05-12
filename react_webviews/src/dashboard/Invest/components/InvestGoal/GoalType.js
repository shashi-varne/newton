import './GoalType.scss';
import React from 'react';
import Container from '../../../common/Container';

import { navigate as navigateFunc} from '../../common/commonFunctions';
import { nativeCallback } from '../../../../utils/native_callback';

const goalTypes = {
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
const GoalType = (props) => {
  const navigate = navigateFunc.bind(props);
  const goNext = (name) => () => {
    sendEvents('next', name);
    navigate(`savegoal/${name}`);
  }

  const sendEvents = (userAction, purpose) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "goal select",
        "flow": "invest for goal",
        "goal_purpose": purpose || ""
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }
  
  return (
    <Container
      classOverRide='pr-error-container'
      events={sendEvents("just_set_events")}
      buttonTitle='NEXT'
      title="Save for a Goal"
      noFooter
      classOverRideContainer='pr-container'
    >
     <section className="invest-goal-container">
       <div className='title'>What is the purpose of this goal?</div>
       <div className="invest-goal-list-type">
        {
          Object.keys(goalTypes).map((key,idx) => {
            return <div key={idx} className="invest-goal-list-item" onClick={goNext(goalTypes[key].name)}>
              <div>
                <img src={goalTypes[key].icon} alt={key}/>
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
export default GoalType;
