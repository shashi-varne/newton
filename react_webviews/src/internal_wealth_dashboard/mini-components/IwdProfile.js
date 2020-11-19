import { Button } from 'material-ui';
import React, { useState } from 'react';

const IwdProfile = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  if (expanded) {
    return (
      <div className="iwd-profile" onClick={toggleExpanded}>
        <div className="iwd-profile-icon iwd-profile-icon__primary">U</div>
        <div className="iwd-profile-username">Uttam Paswan</div>
        <div className="iwd-profile-detail" id="pan">
          <b>PAN: </b>
          CXIPP 4122 M
        </div>
        <div className="iwd-profile-detail">
          <b>Email: </b>
          uttam@fisdom.com
        </div>
        <div className="iwd-profile-detail">
          <b>Mob.: </b>
          +91-8800927468
        </div>
        <div id="iwd-profile-divider"></div>
        <Button
          fullWidth={true}
          classes={{
            root: 'iwd-profile-logout',
            label: 'iwd-profile-logout-text',
          }}>
          Logout
        </Button>
      </div>
    );
  }
  return (
    <div className="iwd-profile-icon" onClick={toggleExpanded}>U</div>
  );
};

export default IwdProfile;