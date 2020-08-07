import React, { Component } from 'react';
import HoldingCard from '../mini-components/HoldingCard';
import Filter from '../mini-components/FIlter';

export default class Holdings extends Component {
  render() {
    return (
      <div className="wr">
        <Filter />
        <HoldingCard />
      </div>
    );
  }
}