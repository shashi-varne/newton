import React, { Component } from "react";
import { withRouter } from "react-router-dom";

const tabs = [
  {
    'name': 'Overview',
    'id': 'overview',
    'color': '#a9a9a9',
    'image': 'ic-nav-overview-inactive.svg'
  },
  {
    'name': 'Analysis',
    'id': 'analysis',
    'color': '#a9a9a9',
    'image': 'ic-nav-analysis-inactive.svg'
  },
  {
    'name': 'Holdings',
    'id': 'holdings',
    'color': '#a9a9a9',
    'image': 'ic-nav-holdings-inactive.svg'
  },
  {
    'name': 'Taxation',
    'id': 'taxation',
    'color': '#a9a9a9',
    'image': 'ic-nav-taxation-inactive.svg'
  }
];

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown_open: false,
      selectedPan: 'BXRPR87008N',
      pans: ['BXRPR87008N', 'QWCTE6223N', 'TRQEW2995K'],
    };
  }

  handleClick = () => {
    this.setState({
      dropdown_open: !this.state.dropdown_open,
    });
  };

  navigate = (pathname) => {
    let searchParams = this.props.location.search;
    this.props.history.push({
      pathname: pathname,
      search: searchParams,
    });
    this.setState({
      dropdown_open: false
    })
  };

  selectPan = (pan) => {
    this.setState({
      dropdown_open: false,
      selectedPan: pan
    })
  }

  render() {
    let { params } = this.props;
    let { dropdown_open, pans, selectedPan } = this.state;
    let count = 1;

    return (
      <div id="wr-header-bar">
        <div className="wr-pan-dropdown">
          <div className="wr-header-pan-select">
            <div className="wr-pan-content" onClick={this.handleClick} style={{ paddingLeft: "17px" }}>
              <img
                src={require(`assets/fisdom/ic-added-pans.svg`)}
                alt=""
              />

              <div style={{ paddingLeft: "16px" }}>
                <div style={{ fontSize: "15px", color:'#a9a9a9' }}>Showing report for</div>
                <div className="wr-pan">{selectedPan}</div>
              </div>

              <img
                src={require("assets/fisdom/ic-dropdown.svg")}
                alt=""
                className="wr-dropdown"
              />
            </div>

            <div style={{ display: dropdown_open ? "inherit" : "none" }}>
              {pans.map((pan, index) => pan !== selectedPan && (
                <div onClick={() => this.selectPan(pan)}>
                  <div className="hr"></div>
                  <div className="wr-pan-content">
                    <img
                      src={require(`assets/fisdom/ic-added-pans.svg`)}
                      alt=""
                      style={{ paddingLeft: "17px" }}
                    />
                    <div style={{ paddingLeft: "16px" }}>
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
          <div
            onClick={() => this.navigate(tab.id)}
            className="wr-header-tab"
          >
            <img
              src={require(`assets/fisdom/${tab.image}`)}
              alt=""
            />
            <div
              className="wr-select"
              style={{ color: tab.color }}
            >
              {tab.name}
            </div>
          </div>
        ))}

      </div>
    );
  }
}

export default withRouter(Header);
