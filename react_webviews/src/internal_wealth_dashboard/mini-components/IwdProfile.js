import { Button } from 'material-ui';
import React, { useState } from 'react';

const IwdProfile = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  if (expanded) {
    return (
      <div id="iwd-profile" onClick={toggleExpanded}>
        <div id="iwd-profile-icon">U</div>
        <div id="iwd-profile-username">Uttam Paswan</div>
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
    <div id="iwd-profile-icon" onClick={toggleExpanded}>U</div>
  );
};

export default IwdProfile;