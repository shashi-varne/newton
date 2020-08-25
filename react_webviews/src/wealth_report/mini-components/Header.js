import React, { useState } from "react";
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

const Header = (props) => {
  const { animation, match, location, onPanSelect } = props;
  const [activeTab, setActiveTab] = useState(match.params.tab);
  
  return (
    <div id="wr-header-bar" className={animation || ''}>
      <PanSelect onPanSelect={onPanSelect}/>

      {tabs.map((tab, index) => (
        <Link to={`${tab.id + location.search}`}
          onClick={() => setActiveTab(tab.id)}
          className="wr-header-tab"
          key={index}
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

export default withRouter(Header);
