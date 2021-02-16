import React, { Component } from 'react';

import Input from '../../ui/Input'
import { FormControl } from "material-ui/Form";


class Components_base extends Component {


    render() {
        return (
            <div>  
            <header className='header-components-base'>
            <h2>UI Componets List</h2>
            </header>
            <div className='compoenets-list'>
            <h2>Select the List to View Demo</h2>
              


            <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={''}
                helperText={''}
                type="text"
                width="40"
                label="Enter mobile number"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={"+91 "}
                // onChange={this.handleChange("mobile_no")}
                inputMode="numeric"
              />
            </div>
          </FormControl>
                



            </div>
            </div>
        );
    }
}

const abcd = (props) => (
    <Components_base
        {...props} />
);

export default abcd;