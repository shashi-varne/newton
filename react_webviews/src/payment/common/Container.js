import React, { Component } from "react";
import { withRouter } from "react-router";

import Header from '../../common/components/Header';
import { didmount } from '../../common/components/container_functions';

import Footer from "./footer";
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  // DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

import { nativeCallback } from "utils/native_callback";
import '../../utils/native_listner';
import { getConfig } from 'utils/functions';
import { checkStringInString } from 'utils/validators';
import { goBackMap } from '../constants';
import UiSkelton from '../../common/ui/Skelton';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: "",
      callbackType: "",
      inPageTitle: true,
      force_hide_inpage_title: this.props.hidePageTitle,
      new_header: true,
      project: 'payment' //to use in common functions
    };

    this.didmount = didmount.bind(this);
  }

  componentDidMount() {
    this.didmount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  historyGoBack = (backData) => {

    if (this.getEvents("back")) {
      nativeCallback({ events: this.getEvents("back") });
    }


    if (this.props.headerData && this.props.headerData.goBack) {
      this.props.headerData.goBack();
      return;
    }

    let pathname = this.props.history.location.pathname;
    if (checkStringInString(pathname, "home")) {
      this.setState({
        callbackType: 'exit',
        openPopup: true,
        popupText: 'Are you sure you want to exit the payment process?'
      })
      return;
    }

    if (goBackMap(pathname)) {
      this.navigate(goBackMap(pathname));
      return;
    }


    switch (pathname) {
      case "/pg/neft":
        this.props.history.goBack();
        break;
      default:
        this.props.history.goBack();
        break;
    }
  };

  componentDidUpdate(prevProps) {
    this.didupdate();
  }

  headerGoBack = () => {
    this.historyGoBack({ fromHeader: true });
  }

  handleClose = () => {
    this.setState({
      openPopup: false
    });
  }

  handlePopup = () => {

    let eventObj = {
      "event_name": "Payment failed",
      "properties": {
        "reason": "dropped"
      }
    };
    nativeCallback({ events: eventObj });
    this.setState({
      openPopup: false
    });
    nativeCallback({ action: this.state.callbackType });

  }

  renderPopup = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openPopup}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{this.state.popupText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handlePopup} color="default" autoFocus>
            Yes
              </Button>
          <Button onClick={this.handleClose} color="default">
            No
              </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className="active" key={i}></span>);
      } else {
        steps.push(<span key={i}></span>);
      }
    }

    if (this.state.mounted) {
      return (
        <div className={`ContainerWrapper paymentMainContainer ${this.props.classOverRide}  ${(getConfig().productName !== 'fisdom') ? 'blue' : ''}`}  >
          {/* Header Block */}
          {(!this.props.noHeader && !getConfig().hide_header) && this.props.showLoader !== true &&
            <Header
              disableBack={this.props.disableBack}
              title={this.props.title}
              smallTitle={this.props.smallTitle}
              provider={this.props.provider}
              count={this.props.count}
              total={this.props.total}
              current={this.props.current}
              goBack={this.headerGoBack}
              edit={this.props.edit}
              type={getConfig().productName}
              resetpage={this.props.resetpage}
              handleReset={this.props.handleReset}
              inPageTitle={this.state.inPageTitle}
              force_hide_inpage_title={this.state.force_hide_inpage_title}
              style={this.props.styleHeader}
              className={this.props.classHeader}
              headerData={this.props.headerData}
            />}

          {/* Below Header Block */}
          <div id="HeaderHeight" style={{ top: 56 }}>
            {/* Loader Block */}
            {this.renderPageLoader()}
          </div>

          {/*  */}


          {!this.state.force_hide_inpage_title && !this.props.noHeader && !this.props.hidePageTitle &&
            this.new_header_scroll()
          }

          { this.props.skelton && 
            <UiSkelton 
            type={this.props.skelton}
            />
          }
  

          {/* Children Block */}
          <div
            style={{...this.props.styleContainer, backgroundColor: this.props.skelton ? '#fff': 'initial'}}
            className={`Container ${this.props.classOverRideContainer} ${this.props.noPadding ? "no-padding" : ""}`}
          >
            <div 
            className={`${!this.props.skelton ? 'fadein-animation' : ''}`}
            style={{display: this.props.skelton ? 'none': ''}}
            > {this.props.children}
             </div>
          </div>

          {/* Footer Block */}
          {!this.props.noFooter && !this.props.skelton && (
            <Footer
              noFooter={this.props.noFooter}
              fullWidthButton={this.props.fullWidthButton}
              logo={this.props.logo}
              buttonTitle={this.props.buttonTitle}
              provider={this.props.provider}
              premium={this.props.premium}
              paymentFrequency={this.props.paymentFrequency}
              edit={this.props.edit}
              resetpage={this.props.resetpage}
              handleClick={this.props.handleClick}
              handleClick2={this.props.handleClick2}
              handleReset={this.props.handleReset}
              onlyButton={this.props.onlyButton}
              disable={this.props.disable}
              withProvider={this.props.withProvider}
              buttonData={this.props.buttonData}
            />
          )}
          {/* No Internet */}
          {this.renderDialog()}
          {this.renderPopup()}
        </div>
      );
    }

    return null;


  }
}

export default withRouter(Container);
