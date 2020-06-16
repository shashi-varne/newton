import React, { Component } from 'react';
import GroupHealthPlanPersonalDetailsCommon from './personal_details_common';

class GroupHealthPlanPersonalDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <GroupHealthPlanPersonalDetailsCommon
          parent={this}
        />
      </div>
    );
  }
}

export default GroupHealthPlanPersonalDetails;