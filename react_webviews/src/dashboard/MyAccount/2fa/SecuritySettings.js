// import "./commonStyle.scss"
// import React, { Component } from 'react';
// import Container from "../../common/Container";
// import { Imgc } from '../../../common/ui/Imgc';
// import { initializeComponentFunctions } from "./commonFunctions";

// class SecuritySettingPage extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             showLoader: false,
//         }
//         this.initializeComponentFunctions = initializeComponentFunctions.bind(this);
//     }

//     componentDidMount() {
//         this.initializeComponentFunctions();
//     }



//     handleClick = (route) => {
//         this.navigate(route);
//     };


//     render() {
//         return (
//             <Container
//                 data-aid='my-account-screen'
//                 // events={this.sendEvents("just_set_events")}
//                 noFooter={true}
//                 skelton={this.state.showLoader}
//             >
//                 <div className="security-settings">
//                     <>
//                         <Imgc
//                             src={require(`assets/group_12.svg`)}
//                             alt=""
//                             className="img-center bottom-space" />
//                     </>
//                     <div
//                         data-aid='security-setting'
//                         className="account-options"
//                         onClick={() => {
//                             // this.sendEvents("security setting");   [EVENT GOES HERE]
//                             this.handleClick("/reset-pin");
//                         }}
//                     >
//                         <Imgc
//                             src={require(`assets/padlock1.svg`)}
//                             alt=""
//                         />
//                         <div>Set Fisdom PIN</div>
//                     </div>
//                 </div>

//             </Container>
//         )
//     }
// };


// const SecuritySettings = (props) => {
//     return (<SecuritySettingPage {...props} />)
// }


// export default SecuritySettings;