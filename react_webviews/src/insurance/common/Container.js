import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getConfig, setHeights } from 'utils/functions';
import Header from './Header';
import Footer from './footer';
import Banner from '../../common/ui/Banner';
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
import { nativeCallback } from 'utils/native_callback';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import '../../utils/native_listner';


class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPopup: false,
      popupText: '',
      callbackType: '',
      loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom
    }
    this.historyGoBack = this.historyGoBack.bind(this);
  }

  componentDidMount() {
    setHeights({ 'header': true, 'container': false });
    let generic_callback = new URLSearchParams(getConfig().searchParams).get('generic_callback');
    let that = this;
    if (generic_callback === "true") {
      window.callbackWeb.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.historyGoBack();
        }
      });
    } else {
      window.PlutusSdk.add_listener({
        type: 'back_pressed',
        go_back: function () {
          that.historyGoBack();
        }
      });
    }

  }

  componentWillUnmount() {
    let generic_callback = new URLSearchParams(getConfig().searchParams).get('generic_callback');
    if (generic_callback === "true") {
      window.callbackWeb.remove_listener({});
    } else {
      window.PlutusSdk.remove_listener({});
    }
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: this.props.location.search
    });
  }


  historyGoBack = () => {
    // let insurance_v2 = getConfig().insurance_v2;
    nativeCallback({ action: 'native_back' });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      openPopup: false
    });

  }

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handlePopup = () => {
    this.setState({
      openPopup: false
    });

    if (this.state.callbackType === 'show_quotes') {
      let eventObj = {
        "event_name": 'exit_from_payment',
        "properties": {
          "user_action": 'yes',
          "source": 'summary'
        }
      };
      nativeCallback({ events: eventObj });
      window.sessionStorage.setItem('show_quotes', true);
      this.navigate('/insurance/quote');
    }


    nativeCallback({ action: this.state.callbackType });
  }

  renderPopup = () => {
    if (getConfig().insurance_v2) {
      return (
        <Dialog
          fullScreen={false}
          open={this.state.openPopup}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          {/* <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              {this.state.popupText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="default">
              No
            </Button>
            <Button onClick={this.handlePopup} color="default" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  }

  renderPageLoader = () => {
    if (this.props.showLoader) {
      return (
        <div className="Loader">
          <div className="LoaderOverlay">
            <img src={this.state.loaderMain} alt="" />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    setHeights({ 'header': true, 'container': false });
  }

  render() {
    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
      if (this.props.current > i) {
        steps.push(<span className='active'
          style={{ background: getConfig().primary }} key={i}></span>);
      } else {
        steps.push(<span key={i}></span>);
      }
    }

    return (
      <div className={`ContainerWrapper ${this.props.classOverRide}  ${(getConfig().productName !== 'fisdom') ? 'blue' : ''}`}  >
        {/* Header Block */}
        <Header
          disableBack={this.props.disableBack}
          title={this.props.title}
          smallTitle={this.props.smallTitle}
          provider={this.props.provider}
          count={this.props.count}
          total={this.props.total}
          current={this.props.current}
          goBack={this.historyGoBack}
          edit={this.props.edit}
          type={getConfig().productName}
          resetpage={this.props.resetpage}
          handleReset={this.props.handleReset}
          filterPgae={this.props.filterPgae}
          handleFilter={this.props.handleFilter} />

        {/* Below Header Block */}
        <div id="HeaderHeight" style={{ top: 56 }}>

          {/* Loader Block */}
          {this.renderPageLoader()}

          {steps && <div className={`Step ${(this.props.type !== 'fisdom') ? 'blue' : ''}`}>
            {steps}
          </div>}

          {/* Banner Block */}
          {this.props.banner && <Banner text={this.props.bannerText} />}

        </div>

        {/* Children Block */}
        <div className={`Container ${this.props.classOverRideContainer}`}>
          {this.props.children}
        </div>

        {/* Footer Block */}
        {!this.props.noFooter &&
          <Footer
            fullWidthButton={this.props.fullWidthButton}
            logo={this.props.logo}
            buttonTitle={this.props.buttonTitle}
            provider={this.props.provider}
            premium={this.props.premium}
            paymentFrequency={this.props.paymentFrequency}
            edit={this.props.edit}
            resetpage={this.props.resetpage}
            handleClick={this.props.handleClick}
            handleReset={this.props.handleReset}
            onlyButton={this.props.onlyButton}
            showDotDot={this.props.showDotDot}
            noFooter={this.props.noFooter} />
        }
        {/* No Internet */}
        {this.renderDialog()}
        {this.renderPopup()}
      </div>
    );
  }
};

export default withRouter(Container);
