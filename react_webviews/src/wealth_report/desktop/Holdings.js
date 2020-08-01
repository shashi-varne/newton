import React, { Component } from 'react';
import HoldingCard from '../mini-components/HoldingCard';
import HoldingFilter from '../mini-components/holdingFilter';

export default class Holdings extends Component {
  render() {
    return (
      <div>
        <HoldingFilter />
        <HoldingCard />
      </div>
    );
  }
}