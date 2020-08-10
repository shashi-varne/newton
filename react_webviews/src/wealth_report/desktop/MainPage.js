import React, { Component } from "react";
import Overview from "./Overview";
import Holdings from "./Holdings";
import Taxation from "./Taxation";
import Header from "../mini-components/Header";
import Footer from "../common/Footer";
import Tooltip from 'common/ui/Tooltip';
import UserAccount from '../mini-components/UserAccount';
import EmailList from '../mini-components/EmailList';
import UserAccountMobile from '../mini-components/UserAccountMobile';
import { isMobileDevice } from 'utils/functions';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mailList: false,
      account: false
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

  handleClose = () => {
    this.setState({
      mailList: false,
      account: false
    })
  }

  render() {
    const { params } = this.props.match;
    console.log(params);

    const email = <img src={require(`assets/fisdom/ic-emails.svg`)} 
                    alt="" 
                    onClick={() => this.setState({mailList: true})} />;

    const user_account = <img src={require(`assets/fisdom/ic-account.svg`)}
                    alt=""
                    onClick={() => this.setState({account: true})} />;
    
    return (
      <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'scroll' }}>
        <div id="wr-header-hero">
          <div className="wr-hero-container">

          {!isMobileDevice() ? <div>
            <img src='' alt="fisdom" />
            <span className="wr-report">Mutual fund report</span>
          </div> : ''}

          <div className="wr-user-account">
            {!isMobileDevice() ?
              <Tooltip content={<EmailList />} eventToggle="onClick" direction="down" >
              {email}
              </Tooltip> : 
              <React.Fragment>
                {email}
                <EmailList open={this.state.mailList} onClose={this.handleClose} />
              </React.Fragment>
            }

            {!isMobileDevice() ?
              <Tooltip content={<UserAccount />} eventToggle="onClick" direction="down" >
              {user_account}
              </Tooltip> : 
              <React.Fragment>
                {user_account}
                <UserAccountMobile open={this.state.account} onClose={this.handleClose} />
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