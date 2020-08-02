import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';

const Filters = [
    {
        'category': 'Fund Type:',
        'filter': ['Debt', 'Equity', 'Other']
    },
    {
        'category': 'Current Value:',
        'filter': ['<1L', '1.5L', '5-10L', '10L+']
    },
    {
        'category': 'Fisdom Rating:',
        'filter': ['3 & Below', '4 & above']
    }
]

export default class HoldingFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      checked: false,
    };
  }

  handleClick = () => {
    this.setState({
      clicked: !this.state.clicked,
      checked: !this.state.checked
    })
  }

  render() {
    let { clicked, checked } = this.state;
    let time = 1500;

    return (
      <React.Fragment>
        <div className="wr-filter" style={{display: clicked ? 'none' : 'flex'}}>
          <Button
            variant="contained"
            disableRipple
            className="wr-button"
            onClick={this.handleClick}
            size="small"
          >
            Filter
            <img src={require(`assets/fisdom/ic-filter.svg`)} alt="" style={{marginLeft:'8px'}}/>
          </Button>
        </div>

        <div className="wr-filter-content" style={{display: clicked ? 'flex' : 'none'}}>
          <div className="wr-category">
            {Filters.map(item => {
              time = time - 400;
              return (
                <Grow in={checked}
                 {...(checked ? { timeout: time } : {})}
                 >
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
                </Grow>
            )})}
          </div>
            
          <div class="vl"></div>
          <img src={require(`assets/fisdom/ic-clear-filter.svg`)} alt=""
           style={{marginLeft:'16px', cursor: 'pointer' }}
           onClick={this.handleClick}
           />
        </div>

      </React.Fragment>
    );
  }
}