import React, { useState } from 'react'
import Container from '../../common/Container'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import RatingStar from '../../../fund_details/common/RatingStar';
import "./style.scss"
function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }
const FundList = ({match,classes}) => {
const [value,setValue] = useState(0);
const handleChange = (event, value) => {
    setValue(value);
  };
  return (
    <Container
      classOverRIde="pr-error-container"
      noFooter
      helpContact
      hideInPageTitle
      title="Explore All Mutual Funds"
      classOverRideContainer="pr-container"
    >
        <div style={{margin:"-20px"}}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="on"
            fullWidth
            classes={{scrollButtons:"tab-scroll-buttons",
            scroller:"tab-scroller",
            flexContainer:"tab-flex-container"}}
          >
            <Tab label="1M" />
            <Tab label="3M" />
            <Tab label="6M" />
            <Tab label="1Y" />
            <Tab label="3Y" />
            <Tab label="5Y" />
          </Tabs>
        {value === 0 && <TabContainer>{[1,2,3].map(el => <DiyFundCard/>)}</TabContainer>}
      </div>
    </Container>
  )
}

export default FundList


const DiyFundCard = (props) => {
    return(
        <div className="diy-fund-card">
            <div className="diy-fund-card-img">
                <img src={require("assets/fisdom/Large_cap.svg")} alt="some" width="90"/>
            </div>
            <div className="diy-fund-card-details">
                <div className="diy-fund-card-name">Quant Active Fund-GROWTH OPTION</div>
                <div className="diy-fund-card-info-container">
                    <div className="diy-fund-card-info">
                        <p>AUM: 133 Crs</p>
                        <p>Return: <span>+15.4%</span></p>
                        <RatingStar value={4} />
                    </div>
                    <div className="diy-fund-card-cart">
                        <img src={require("assets/fisdom/Large_cap.svg")} alt="some" />
                    </div>
                </div>
            </div>
        </div>
    )
}