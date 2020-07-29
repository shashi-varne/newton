import React, { Component } from "react";

export default class WrTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnHeaders: ['date', 'type', 'amount'],
      tableData: [
        { date: '20 Apr 2020', type: 'Investment', amount: '₹ 2.30L'},
        { date: '8 Oct 2019', type: 'Withdrawal', amount: '₹ 1.80L'},
        { date: '20 Apr 2020', type: 'Investment', amount: '₹ 2.30L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
        { date: '12 Jan 2020', type: 'Switch', amount: '₹ 3.10L'},
      ],
    };
  }

  render() {
    const { columnHeaders, tableData } = this.state;

    return (
      <table className={`wr-table ${this.props.classes}`} style={this.props.style || {}}>
          <thead>
            <tr>
              {columnHeaders.map(col => (
                <td key={col}>{col}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx}>
                {columnHeaders.map(col => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    );
  }
}