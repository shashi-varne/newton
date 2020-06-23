import React, { Component, Fragment } from 'react';
import { LinearProgress } from 'material-ui';

export default class TopHoldings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  toggleView = () => {
    this.setState((state) => ({
      open: !state.open,
    }));
  }

  renderHoldings = () => {
    let holdings = (JSON.parse(JSON.stringify(this.props.holdings))).sort((a,b) => b.value - a.value);

    if (!this.state.open) holdings.splice(5);

    if (!holdings || !holdings.length) {
      return (
        <div id="no-top-holdings">
          No holdings to display
        </div>
      );
    }

    return (
      <Fragment>
        {holdings.map((holding, idx) => (
          <div id="top-holding" key={idx}>
            <div id="top-holding-detail">
              <span id="top-holding-name">{holding.name}</span>
              <span id="top-holding-value">{holding.value}%</span>
            </div>
            <LinearProgress
              variant="determinate"
              value={Number(holding.value)}
              classes={{
                root: 'top-holding-bar'
              }}
            />
          </div>
        ))}
        <div id="top-holdings-expand" onClick={this.toggleView}>
          SEE {this.state.open ? 'Less' : 'More'}
        </div>
      </Fragment>
    );
  }

  render() {
    
    return (
      <div id="top-holdings-container">
        {this.renderHoldings()}
      </div>
    );
  }
}