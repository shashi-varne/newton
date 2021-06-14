import './GoalType.scss';
import React from 'react';
import Container from '../../../common/Container';

import { nativeCallback } from '../../../../utils/native_callback';
import { flowName } from '../../constants';
import { navigate as navigateFunc} from 'utils/functions';

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
    navigate(`/invest/savegoal/${name}`);
  }

  const sendEvents = (userAction, purpose) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "goal select",
        "flow": flowName['saveforgoal'],
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
      data-aid='goal-type-screen'
      classOverRide='pr-error-container'
      events={sendEvents("just_set_events")}
      buttonTitle='NEXT'
      title="Save for a Goal"
      noFooter
      classOverRideContainer='pr-container'
    >
     <section className="invest-goal-container" data-aid='invest-goal-page'>
       <div className='title'>What is the purpose of this goal?</div>
       <div className="invest-goal-list-type" data-aid='invest-goal-list-type'>
        {
          Object.keys(goalTypes).map((key,idx) => {
            return <div key={idx} className="invest-goal-list-item" onClick={goNext(goalTypes[key].name)} data-aid={`invest-goal-list-item-${idx+1}`}>
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
