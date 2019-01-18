import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Button from 'material-ui/Button';
import icon from '../assets/no_internet_connection_icon.png';

class NoInternet extends Component {
  handleClick = () => {
    window.location.reload(false);
  }

  render() {
    return (
      <div className="NoInternet">
        <img src={icon} alt="" />
        <h1>No Internet Found!</h1>
        <p>Check your connection.</p>
        <Button
          fullWidth={false}
          variant="raised"
          size="small"
          color="secondary"
          className="ReloadButton"
          onClick={this.handleClick} >
          Tap to retry
        </Button>
      </div>
    );
  }
}

export default withRouter(NoInternet);
