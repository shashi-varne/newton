import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Header from '../../common/components/Header';
import { didmount } from '../../common/components/container_functions';
import Footer from './footer';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from '../../utils/functions';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      project: 'help',
      inPageTitle: true
    }

    this.didmount = didmount.bind(this);
  }

  componentDidMount() {
    this.didmount();
  }

  componentWillUnmount() {
    this.unmount();
  }

  componentDidUpdate(prevProps) {
    this.didupdate();
  }
  
  historyGoBack = () => {
    let pathname = this.props.history.location.pathname;

    switch (pathname) {
      case "/help":
        nativeCallback({ action: 'exit', events: this.getEvents() });
        break;
      default:
        if (navigator.onLine) {
          nativeCallback({ events: this.getEvents() });
          this.props.history.goBack();
        } else {
          this.setState({
            openDialog: true
          });
        }
    }
  }

  render() {
    if (this.state.mounted) {
      return (
        <div className="ContainerWrapper">
          {/* Header Block */}
          {!this.props.hideheader &&
            <Header
              title={this.props.title}
              goBack={this.historyGoBack}
              type={getConfig().productName}
              inPageTitle={this.state.inPageTitle}
              force_hide_inpage_title={this.state.force_hide_inpage_title}
             />
          }

          {/* Below Header Block */}
          {<div id="HeaderHeight" style={{ top: 56 }}>
          </div>}

          {!this.state.force_hide_inpage_title && !this.props.hideheader && 
            this.new_header_scroll() 
          }

          {/* Children Block */}
          <div className={`Container ${this.props.background}`}>
            {this.props.children}
          </div>

          {/* Footer Block */}
          {!this.props.noFooter &&
            <Footer
              fullWidthButton={this.props.fullWidthButton}
              buttonTitle={this.props.buttonTitle}
              handleClick={this.props.handleClick}
              noFooter={this.props.noFooter}
              isDisabled={this.props.isDisabled} />
          }

          {/* No Internet */}
          {this.renderDialog()}
        </div>
      );
    }

    return null;
  }
};

export default withRouter(Container);
