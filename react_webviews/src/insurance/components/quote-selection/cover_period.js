import React, { Component } from 'react';
import qs from 'qs';

import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import Api from 'utils/api';
import { getConfig } from 'utils/functions';

import selected_option from 'assets/selected_option.png';
import comver_amount_icon from 'assets/life_cover_icon.png';

class CoverPeriod extends Component {
  constructor(props) {
    var quoteData = JSON.parse(window.localStorage.getItem('quoteData')) || {};
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
      isPrime: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("mypro.fisdom.com") >= 0,
      ismyway: qs.parse(props.history.location.search.slice(1)).base_url.indexOf("api.mywaywealth.com") >= 0,
      type: '',
      selectedIndex: quoteData.selectedIndexCoverPeriod || 0,
      cover_period: 0,
      coverPeriodList: [],
      quoteData: quoteData
    }
    this.renderList = this.renderList.bind(this);
  }

  componentWillMount() {
    if (this.state.ismyway) {
      this.setState({
        type: 'myway'
      });
    } else if (this.state.isPrime) {
      this.setState({
        type: 'Fisdom Prime'
      });
    } else {
      this.setState({
        type: 'fisdom'
      });
    }
  }

  async componentDidMount() {
    try {
      const res = await Api.get('/api/insurance/recommend/cover_term?dob=' + this.state.quoteData.dob)
      this.setState({
        show_loader: false
      });
      let result = res.pfwresponse.result;
      let coverPeriodList = result.list;
      coverPeriodList.push(result.recommendation);
      if (res.pfwresponse.status_code === 200) {
        this.setState({
          coverPeriodList: coverPeriodList,
          recommendation: result.recommendation
        });
        var i = 0;
        for (i in coverPeriodList) {
          if (result.recommendation === coverPeriodList[i]) {
            this.setState({
              selectedIndex: i * 1,
              recommendedIndex: i * 1
            })
            this.setValue(i * 1);
          }
        }
      } else {
        toast(result.error || result.message);
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
    }
  }


  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  handleClick = async () => {
    let quoteData = this.state.quoteData;
    quoteData.cover_period = this.state.cover_period;
    quoteData.selectedIndexCoverPeriod = this.state.selectedIndex;
    window.localStorage.setItem('quoteData', JSON.stringify(quoteData));
    this.navigate('lifestyle')
  }

  setValue(index) {
    this.setState({
      selectedIndex: index,
      cover_period: this.state.coverPeriodList[index]
    })
  }

  renderPopUp() {
  }

  renderList(props, index) {
    return (
      <div key={index} onClick={() => this.setValue(index)}
        className={'ins-row-scroll' + (this.state.selectedIndex === index ? ' ins-row-scroll-selected' : '')}>
        {this.state.selectedIndex !== index &&
          <div style={{ display: '-webkit-box' }}>
            <div style={{ width: '28%' }}>{props}</div>
            {index === this.state.recommendedIndex &&
              <div style={{ width: '60%', color: '#b9a8e6', fontSize: 13 }}>Recommended</div>
            }
          </div>
        }
        {this.state.selectedIndex === index &&
          <div style={{ display: '-webkit-box' }}>
            <div style={{ width: index === this.state.recommendedIndex ? '28%' : '88%', color: '#4f2da7', fontWeight: 500 }}>{props}</div>
            {index === this.state.recommendedIndex &&
              <div style={{ width: '60%', color: '#b9a8e6', fontSize: 13 }}>Recommended</div>
            }
            <img width="20" src={selected_option} alt="Insurance" />
          </div>}
      </div>
    )
  }


  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Basic Details"
        smallTitle="Cover Period"
        count={true}
        total={5}
        current={4}
        handleClick={this.handleClick}
        buttonTitle="Next"
        type={this.state.type}
        fullWidthButton={true}
        onlyButton={true}
      >

        <div className="header-annual-inc-info">
          <div style={{ width: '13%' }}>
            <img style={{ width: 40 }} src={comver_amount_icon} alt="Insurance" />
          </div>
          <div style={{ width: '76%' }}>
            <div style={{ color: '#4a4a4a', fontSize: 16 }}>I would like to cover my family</div>
            <div style={{ display: 'flex' }}>
              <div style={{ margin: '4px 0 0 0px', fontSize: 16, color: ' #4a4a4a' }}>for the next</div>
              <div className="annual-income-data-mid" style={{
                width: 'fit-content', margin: '3px 0 0 7px',
                minWidth: 30, textAlign: 'center'
              }}>
                {this.state.cover_period}
              </div>
              <div style={{ margin: '4px 0 0 8px', fontSize: 16, color: ' #4a4a4a' }}>years</div>
            </div>
          </div>
          <div className="annual-income-info-button" onClick={() => this.renderPopUp()}>INFO</div>
        </div>

        <div style={{ marginTop: 60 }}>
          {this.state.coverPeriodList.map(this.renderList)}
        </div>
      </Container>
    );
  }
}

export default CoverPeriod;
