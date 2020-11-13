import React, { Component } from 'react';
import Declaration from '../../ui_components/general_insurance/declaration';

class CoronaPlanDeclaration extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      product_key: 'CORONA'
    }
  }

  render() {  console.log(this)
    return (
      <div>
        <Declaration
          parent={this}
        />
      </div>
    );
  }
}

export default CoronaPlanDeclaration;