import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";

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
      activeTab: this.props.match.params.tab
    };
  }

  handleClick = () => {
    this.setState({
      dropdown_open: !this.state.dropdown_open,
    });
  };

  selectTab = (tab) => {
    this.setState({
      dropdown_open: false,
      activeTab: tab
    })
  }

  selectPan = (pan) => {
    this.setState({
      dropdown_open: false,
      selectedPan: pan
    })
  }

  render() {
    let { dropdown_open, pans, selectedPan, activeTab } = this.state;
    let count = 1;

    return (
      <div id="wr-header-bar">
        <div className="wr-pan-dropdown">
          <div className="wr-header-pan-select">
            <div className="wr-pan-content" onClick={this.handleClick}>
              <img
                src={require(`assets/fisdom/ic-added-pans.svg`)}
                alt=""
              />

              <div style={{ padding: "0 75px 0 16px" }}>
                <div style={{ fontSize: "15px", color:'#a9a9a9' }}>Showing report for</div>
                <div className="wr-pan">{selectedPan}</div>
              </div>

              <IconButton classes={{ root: 'wr-icon-button' }} color="inherit" aria-label="Menu">
                <img
                  src={require("assets/fisdom/ic-dropdown.svg")}
                  alt=""
                />
              </IconButton>
            </div>

            <div style={{ display: dropdown_open ? "inherit" : "none" }}>
              {pans.map((pan, index) => pan !== selectedPan && (
                <div onClick={() => this.selectPan(pan)}>
                  <div className="hr"></div>
                  <div className="wr-pan-content">
                    <img
                      src={require(`assets/fisdom/ic-added-pans.svg`)}
                      alt=""
                    />
                    <div style={{ padding: "0 75px 0 16px" }}>
                      <div style={{ fontSize: "15px", color:'#a9a9a9' }}>{`PAN ${++count}`}</div>
                      <div className="wr-pan">{pan}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {tabs.map(tab => (
          <Link to={`${tab.id + this.props.location.search}`}
            onClick={() => this.selectTab(tab.id)}
            className="wr-header-tab"
            style={{borderBottom: activeTab === tab.id ? 'solid 4px var(--primary)' : ''}}
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
