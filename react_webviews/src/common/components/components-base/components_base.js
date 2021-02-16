import React, { Component } from 'react';

import Input from '../../ui/Input'
import DropdownWithoutIcon from '../../ui/SelectWithoutIcon'
import { FormControl } from "material-ui/Form";


class Components_base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_data: {}
        };
    }


    componentWillMount() {
        
        let vendor_details = [{
            'name': 'Donne Darko',
            'value': 'Donne Darko'
          },
          {
            'name': 'Bharti Axa',
            'value': 'bharti axa general'
          },
        ]

        this.setState({ vendor_details: vendor_details })
    }

    handleChange = (name) => (event) => {
        let form_data = this.state.form_data;
        let mobile, value;

        if (name !== 'Vendor') {
            value = event.target.value || ''
            mobile = value.slice(4);
        }

        if (name === 'Vendor') {
            // eslint-disable-next-line
            value = event
            form_data[name] = value ;
            form_data[name + '_error'] = '';
        };

        this.setState({
            mobile_no: mobile,
            mobile_no_error: "",
            form_data: form_data,
        });
    };

    render() {
        let { mobile_no } = this.state;
        return (
            <div>  
            <header className='header-components-base'>
            <h2>UI Componets List</h2>
            </header>
            <div className='compoenets-list'>
            <h2>Select the List to View Demo</h2>

          <div className="compoenets-base">
            <FormControl fullWidth>
            <div className="InputField">
              <Input
                error={''}
                type='data'
                helperText={''}
                type="text"
                width="40"
                className='compoenets-base'
                label="Label"
                class="Mobile"
                maxLength={14}
                id="number"
                name="mobile_no"
                value={`+91 ${mobile_no}` || ''}
                onChange={this.handleChange("mobile_no")}
                inputMode="numeric"
              />
            </div>
           </FormControl>

            <DropdownWithoutIcon
              parent={this}
              header_title="Insurance Company"
              cta_title="SAVE"
              selectedIndex = { 0 }
              width="40"
              dataType="AOB"
              options={this.state.vendor_details}
              id="relation"
              label="Insurance Company"
              error={this.state.form_data.name_error2 ? true : false}
              name="Vendor"
              helperText={this.state.form_data.name_error2}
              value={this.state.form_data.Vendor || ''}
              onChange={this.handleChange("Vendor")}
            />
          </div>
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