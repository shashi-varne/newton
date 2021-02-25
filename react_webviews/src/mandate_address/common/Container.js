import React, { Component , Fragment } from 'react';
import { withRouter } from 'react-router';
 
// import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
 
import {didMount ,commonRender} from '../../common/components/container_functions';
 
class Container extends Component {
 constructor(props) {
   super(props);
   this.state = {
     openDialog: false,
     productName: getConfig().productName
   }
   this.historyGoBack = this.historyGoBack.bind(this);
 
   this.didMount = didMount.bind(this);
   this.commonRender =  commonRender.bind(this);
 }
 
 redirectCallback(type) {
   let url;
   if (type === 'back') {
     url = 'http://app.fisdom.com/#/page/invest/campaign/callback?name=mandate&message=back&code=400&destination=';
   } else {
     url = 'http://app.fisdom.com/#/page/invest/campaign/callback?name=mandate&message=success&code=200&destination=';
   }
   window.location.replace(url);
 }
 
 historyGoBack = () => {
   let { params } = this.props.location
   if (params && params.disableBack) {
     this.redirectCallback('success');
     return;
   }
   let pathname = this.props.history.location.pathname;
   switch (pathname) {
     case "/mandate":
       this.redirectCallback('back');
       break;
     case "/mandate/success":
       this.redirectCallback('success');
       break;
     default:
       if (navigator.onLine) {
         this.props.history.goBack();
       } else {
         this.setState({
           openDialog: true
         });
       }
   }
 }
 
 componentWillUnmount() {
    this.unmount();
 }
 
 componentDidMount() {
 
   this.didMount();
 }
 
 
 componentDidUpdate(prevProps) {
   this.didupdate();
 }
 
 
 render() {
 
   return(
     <Fragment>
     {this.commonRender()}
     </Fragment>
   )
 }
 
 
 
};
 
export default withRouter(Container);