import React, { Component } from 'react';
import qs from 'qs';
import Footer from '../../common/footer';
// import EnpsConsentAbout from '../../components/enps/about'

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import color from 'material-ui/colors/amber';
import { container } from 'webpack';



class MoneyControlLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      params: qs.parse(props.history.location.search.slice(1)),
    }

  }
 


  render() {
    return (//display: 'flex', justifyContent : 'center'

        <div>   
        <div style={ {backgroundColor: "#3792FC", width: "100%", height: '80px', display: 'flex', justifyContent: 'space-between'}}>
        <span>
        <img src={ require(`assets/finity/back_nav_bar_icon_1.svg`)} style={{marginTop: '32px', marginBottom: '32px', paddingLeft: '80px'}} alt=""/>
        <img src={ require(`assets/finity/back_nav_bar_icon_2.svg`)} style={{marginTop: '32px', marginBottom: '32px',}} alt=""/>
        </span>
        <img src={ require(`assets/finity/moneycontrol_logo.svg`)} style={{ marginTop: '20px', marginBottom: '20px'}} alt=""/>
        <img src={ require(`assets/finity/Finity_Logo.svg`)} style={{paddingRight: '40px', marginTop: '32px', marginBottom: '32px'}} alt=""/>
        </div> 

        <div>

           {/* <EnpsConsentAbout/>               */}
      
       </div>
























       <div style={{ position : 'absolute', bottom: 0, left: '50%',}}>
        <Footer 
        fullWidthButton={true}
        onlyButton={true}
        showLoader={this.state.show_loader}
        // handleClick={() => this.handleClick()}
        noFooter={true}
        buttonTitle='Continue'
        />
        </div>
       </div>

    );
  }
}
export default MoneyControlLayout;