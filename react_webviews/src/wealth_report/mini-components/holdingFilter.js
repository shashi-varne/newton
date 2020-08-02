import React, { Component } from 'react';
import Grow from '@material-ui/core/Grow';
import WrButton from '../common/Button';

const Filters = [
    {
        'category': 'Fund Type',
        'filters': ['Debt', 'Equity', 'Other']
    },
    {
        'category': 'Current Value',
        'filters': ['<1L', '1.5L', '5-10L', '10L+']
    },
    {
        'category': 'Fisdom Rating',
        'filters': ['3 & Below', '4 & above']
    }
]

export default class HoldingFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      checked: false
    };
  }

  handleClick = () => {
    this.setState({
      clicked: !this.state.clicked,
      checked: !this.state.checked
    })
  }

  selectCategory = (category, filter) => {
    this.setState({
      [category]: filter
    })
  }

  render() {
    let { clicked, checked} = this.state;
    let time = 1500;

    return (
      <React.Fragment>
        <div className="wr-filter" style={{display: clicked ? 'none' : 'flex'}}>
          <WrButton 
          classes={{
            root: 'wr-btn'
          }}
          disableRipple size="small"
          onClick={this.handleClick}
          >
            Filter
              <img src={require(`assets/fisdom/ic-filter.svg`)} alt="" style={{marginLeft:'8px'}}/>
          </WrButton>
        </div>

        <div className="wr-filter-content" style={{display: clicked ? 'flex' : 'none'}}>
          <div className="wr-category">
            {Filters.map(item => {
              time = time - 400;
              return (
                <Grow in={checked}
                 {...(checked ? { timeout: time } : {})}
                 key={item.category}
                 >
                  <div className="wr-head">
                    {`${item.category}:`}
                    {item.filters.map(filter => (
                      <WrButton 
                        key={filter}
                        classes={{
                          root: this.state[item.category] === filter ? 'wr-select-btn' : 'wr-btn'
                        }}
                        disableRipple size="small"
                        onClick={() => this.selectCategory(item.category, filter)}
                      >
                        {filter}
                      </WrButton>
                    ))}
                  </div>
                </Grow>
            )})}
          </div>
            
          <div className="vl"></div>
          <img src={require(`assets/fisdom/ic-clear-filter.svg`)} alt=""
           style={{marginLeft:'16px', cursor: 'pointer' }}
           onClick={this.handleClick}
           />
        </div>

      </React.Fragment>
    );
  }
}