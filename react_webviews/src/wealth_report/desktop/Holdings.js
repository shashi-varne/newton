import React, { Component } from 'react';
import HoldingCard from '../mini-components/HoldingCard';
import Button from '@material-ui/core/Button';

export default class Holdings extends Component {
  render() {
    return (
      <div>
        {/* <div className="wr-filter">
          <Button
            variant="contained"
            disableRipple
            className="wr-button"
          >
            Filter
            <img src={require(`assets/fisdom/ic-filter.svg`)} alt="" style={{marginLeft:'8px'}}/>
          </Button>
        </div> */}

        <div className="wr-filter-content">
          <div className="wr-head">
            Fund Type:
            <Button
            variant="contained"
            disableRipple
            className="wr-button"
          >
            Debt
          </Button>
          <Button
            variant="contained"
            disableRipple
            className="wr-button"
          >
            Equity
          </Button>
          <Button
            variant="contained"
            disableRipple
            className="wr-button"
          >
            Other
          </Button>
          </div>
        </div>

        <HoldingCard />
      </div>
    );
  }
}