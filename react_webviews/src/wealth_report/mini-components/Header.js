import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import PanSelect from './PanSelect';

const tabs = [
  {
    'name': 'Overview',
    'id': 'overview',
    'image-active': 'ic-nav-overview-active.svg',
    'image-inactive': 'ic-nav-overview-inactive.svg'
  },
  {
    'name': 'Analysis',
    'id': 'analysis',
    'image-active': 'ic-nav-analysis-active.svg',
    'image-inactive': 'ic-nav-analysis-inactive.svg'
  },
  {
    'name': 'Holdings',
    'id': 'holdings',
    'image-active': 'ic-nav-holdings-active.svg',
    'image-inactive': 'ic-nav-holdings-inactive.svg'
  },
  {
    'name': 'Taxation',
    'id': 'taxation',
    'image-active': 'ic-nav-taxation-active.svg',
    'image-inactive': 'ic-nav-taxation-inactive.svg'
  }
];

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown_open: false,
      selectedPan: 'BXRPR87008N',
      pans: ['BXRPR87008N', 'QWCTE6223N', 'TRQEW2995K'],
      activeTab: this.props.match.params.tab,
    };
  }

  selectTab = (tab) => {
    this.setState({
      dropdown_open: false,
      activeTab: tab
    })
  }

  render() {
    let { activeTab } = this.state;

    return (
      <div id="wr-header-bar">
        <PanSelect />

        {tabs.map((tab, index) => (
          <Link to={`${tab.id + this.props.location.search}`}
            onClick={() => this.selectTab(tab.id)}
            className="wr-header-tab"
            key={index}
            style={{borderBottom: activeTab === tab.id ? 'solid 4px var(--primary)' : ''}}
            key={tab.name}
          >
            <img
              src={require(`assets/fisdom/${activeTab === tab.id ? tab["image-active"] : tab["image-inactive"]}`)}
              alt=""
            />
            <div
              className="wr-select"
              style={{ color: activeTab === tab.id ? '#000' : '#a9a9a9' }}
            >
              {tab.name}
            </div>
          </Link>
        ))}

      </div>
    );
  }
}

export default withRouter(Header);
