import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

const Filters = [
    {
        'category': 'Fund Type',
        'filter': ['Debt', 'Equity', 'Other']
    },
    {
        'category': 'Current Value',
        'filter': ['<1L', '1.5L', '5-10L', '10L+']
    },
    {
        'category': 'Fisdom Rating',
        'filter': ['3 & Below', '4 & above']
    }
]

export default class HoldingFilter extends Component {
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

        {/* <div className="wr-filter-content">
          <div className="wr-head">
            Fund Type:
            <Button
            variant="contained"
            disableRipple
            className="wr-button"
            size="small"
          >
            Debt
          </Button>
          <Button
            variant="contained"
            disableRipple
            className="wr-button"
            size="small"
          >
            Equity
          </Button>
          <Button
            variant="contained"
            disableRipple
            className="wr-button"
            size="small"
          >
            Other
          </Button>
          </div>
        </div> */}

        <div className="wr-filter-content">
            {Filters.map(item => (
                <div className="wr-head">
                    {item.category}
                    {item.filter.map(item => (
                      <Button
                          variant="contained"
                          disableRipple
                          className="wr-button"
                          size="small"
                      >
                        {item}
                      </Button>
                    ))}
                </div>
            ))}
        </div>

      </div>
    );
  }
}