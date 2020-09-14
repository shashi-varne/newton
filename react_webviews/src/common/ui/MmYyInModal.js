import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import DropdownInModal from './DropdownInModal';
import { FormControl } from 'utils/validators';
import Input from './Input';

class MmYyInModal extends Component {
    contructor(props) {
        super(props);
        this.state = {
        }

        this.handleShow.bind(this, this.props.selectedIndex)
    };

    componentDidMount() {
        this.handleShow(this.state.selectedIndex)
    }

    handleChange = () => {

    }
    
    render() {
        return (
            <div className="InputField">
                <Input 
                    type="text"
                    id={''}
                    label=""
                    name=''
                    className="date"
                    placeholder="MM/YYYY"
                    maxLength='7'
                    value={''}
                    error={this.props.date_error ? true : false}
                    helperText={''}
                    onChange={(event) => this.handleChange(event)}
                />
            </div>
        )
    }
}

export default MmYyInModal;