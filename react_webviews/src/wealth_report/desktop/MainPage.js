import React, { Component } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";
import Taxation from "./Taxation";
import Header from "../mini-components/Header";
import Footer from "../common/Footer";
import Tooltip from 'common/ui/Tooltip';
import EmailList from "../mini-components/EmailList";
import UserAccount from '../mini-components/UserAccount';
import EmailListMobile from '../mini-components/EmailListMobile';
import UserAccountMobile from '../mini-components/UserAccountMobile';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      bottom: false,
    };
  }

  renderTab = (tab) => {

    if (tab === 'overview') {
      return <Overview />;
    } else if (tab === 'holdings') {
      return <Holdings />
    } else if (tab === 'taxation') {
      return <Taxation />
    }
  }

  handleOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { params } = this.props.match;
    console.log(params);

    const email = <img src={require(`assets/fisdom/ic-emails.svg`)} alt="" onClick={this.handleOpen} />;
    const account = <img src={require(`assets/fisdom/ic-account.svg`)} alt="" onClick={this.handleOpen} />;
    
    return (
      <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'scroll' }}>
        <div id="wr-header-hero">
          <div className="wr-hero-container">

          {window.innerWidth > 812 ? <div>
            <img src='' alt="fisdom" />
            <span className="wr-report">Mutual fund report</span>
          </div> : ''}

          <div className="wr-account">
            {window.innerWidth > 812 ?
              <Tooltip content={<EmailList />} eventToggle="onClick" direction="down" >
              {email}
              </Tooltip> : 
              <React.Fragment>
                {email}
                <EmailListMobile open={this.state.open} onClose={this.handleClose} />
              </React.Fragment>
            }

            {window.innerWidth > 812 ?
              <Tooltip content={<UserAccount />} eventToggle="onClick" direction="down" >
              {account}
              </Tooltip> : 
              <React.Fragment>
                {account}
                <UserAccountMobile open={false} onClose={this.handleClose} />
              </React.Fragment>
            }
          </div>

          </div>
        </div>
        <Header />
        
        <div id="wr-body">
          {this.renderTab(params.tab)}
        </div>
        <div id="wr-footer">
        <Footer />
        </div>
      </div>
    );
  }
}