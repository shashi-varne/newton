import React, { Component } from 'react';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import Checkbox from 'material-ui/Checkbox';
import { FormControl } from 'material-ui/Form';
import Input from '../../../../common/ui/Input';
import Grid from 'material-ui/Grid';

class radioAndCheckboxList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            form_data: {}
        }
    }

    componentWillMount() {
        this.onload();
    }

    onload() {
        let { account_type, list, name } = this.props;

        this.setState({
            account_type: account_type,
            name: name,
            list: list
        })
    }

    handleChangeRadio = (name, index) => event => {
        let value = this.state.list[index].options[event].value;

        this.setState({
            [name]: value,
            [name + '_error']: ''
        });

        this.props.handleChangeRadio(value);
    }

    handleChange = name => event => {
        if (!name) {
            name = event.target.name;

            this.setState({
                [name]: event.target.checked
            })
        } else {

            var value = event.target ? event.target.value : '';
            var form_data = this.state.form_data || {};

            form_data[name] = value;
            form_data[name + '_error'] = '';

            this.setState({
                form_data: form_data
            })
        }
    }

    renderInputs = () => {
        return (
            <FormControl fullWidth>
                <div className="InputField">
                    <Input
                        type="text"
                        id="description"
                        label="description"
                        name="description"
                        placeholder="Lorem ipsum lorem ipsum"
                        value={this.state.form_data.description || ''}
                        onChange={this.handleChange('description')} />
                </div>
                <div className="InputField">
                    <Input
                        type="text"
                        id="Since_when"
                        label="Since When"
                        name="duration"
                        placeholder="July 1990"
                        value={this.state.form_data.duration || ''}
                        onChange={this.handleChange('duration')} />
                </div>
            </FormControl>
        )
    }
    
    render() {
        let { account_type, list, name } = this.state;

        return ( 
            <div style={{marginBottom: '40px'}}>
                {list.map((item, index) => (
                    <div key={index} style={{color: '#0A1D32', lineHeight:'1.8', fontSize: '13px'}}>

                        <p>{item.label}</p>

                        {item.input_type === 'radio' && 
                            <div>
                                <RadioWithoutIcon
                                    width="20"
                                    isVertical={false}
                                    options={item.options}
                                    id={name}
                                    name={name}
                                    onChange={this.handleChangeRadio(name, index)} />
                                {this.state['lifeStyle details'] === 'Yes' && this.renderInputs()}
                            </div>
                        }
                        
                        {item.input_type === 'checkbox' && name === 'lifeStyle details' &&
                            item.options[account_type].map((option, index) => (
                                <div key={index}>
                                    <Grid container spacing={16} alignItems="center">
                                        <Grid item xs={1} className="TextCenter">
                                            <Checkbox
                                                checked={this.state[option]}
                                                color="primary"
                                                value={option}
                                                name={option}
                                                disableRipple
                                                onChange={this.handleChange()}
                                                className="Checkbox" />
                                        </Grid>
                                        <Grid item xs={11} style={{fontSize:'14px'}}>
                                            {option}
                                        </Grid>
                                    </Grid>
                                    {this.state[option] && option !== 'None' &&
                                        <Grid container spacing={16} alignItems="center">
                                        <Grid item xs={1} className="TextCenter"></Grid>
                                            <Grid item xs={11} style={{fontSize:'14px'}}>
                                                {this.renderInputs()}
                                            </Grid>
                                        </Grid>}
                                </div>
                            ))
                        }

                        {item.input_type === 'checkbox' && name === 'medical history' &&
                            <Grid container spacing={8}>
                                {item.options[account_type].map((option, index) => (
                                <Grid item xs key={index}>
                                    <Grid item xs>
                                            <Checkbox
                                                checked={this.state[option]}
                                                color="primary"
                                                value={option}
                                                name={option}
                                                disableRipple
                                                onChange={this.handleChange()}
                                                className="Checkbox" />
                                            {option}
                                        </Grid>
                                        
                                </Grid>))}
                            </Grid>
                        }
                    </div>
                ))}
            </div>
         );
    }
}
 
export default radioAndCheckboxList;