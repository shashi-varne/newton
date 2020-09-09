import React, { Component } from 'react';
import RadioWithoutIcon from '../../../../common/ui/RadioWithoutIcon';
import Checkbox from 'material-ui/Checkbox';
import { FormControl } from 'material-ui/Form';
import Input from '../../../../common/ui/Input';
import Grid from 'material-ui/Grid';
import {  formatMonthandYear, dobFormatTest } from 'utils/validators';

class radioAndCheckboxList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
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

            if(name === 'None') {
                let options = this.state.list[0].options[this.state.account_type];
                
                options.forEach(name => {
                    if (name !== 'None') {
                        this.setState({
                            [name]: {
                                checked: false,
                            },
                            [name+'_error']: {
                                checked: '',
                            }
                        })
                    }
                })
            } else {
                this.setState({
                    'None': {
                        checked: false,
                    },
                    'None_error': {
                        checked: '',
                    }
                })
            }

            this.setState({
                [name]: {
                    checked: event.target.checked
                },
                [name+'_error']: {
                    checked: ''
                }
            })
        } else {

            let value = event.target ? event.target.value : '';
            
            this.setState({
                [name]: {
                    ...this.state[name],
                    description: value
                },
                [name+'_error']: {
                    ...this.state[name+'_error'],
                    description: ''
                }
            })
        }
    }

    handleDateInput = name => event => {
        let value = event.target.value;

        if(!dobFormatTest(value)) {
            return;
        }

        let input = document.getElementById(name+'_date');
        input.onkeyup = formatMonthandYear;

        this.setState({
            [name]: {
                ...this.state[name],
                date: value
            },
            [name+'_error'] : {
                ...this.state[name+'_error'],
                date: ''
            },
        });

        this.props.handleChange({[name]: value})
    }

    renderInputs = (name) => {
        return (
            <FormControl fullWidth>
                <div className="InputField">
                    <Input
                        type="text"
                        label="description"
                        name="description"
                        placeholder="Lorem ipsum lorem ipsum"
                        value={this.state[name].description || ''}
                        onChange={this.handleChange(name)} />
                </div>
                <div className="InputField">
                    <Input
                        type="text"
                        id={name+'_date'}
                        label="Since When"
                        name={name}
                        placeholder="MM/YYYY"
                        maxLength="7"
                        value={this.state[name].date || ''}
                        error={this.props[name+'_error'] ? true : false}
                        helperText={this.props[name+'_error']}
                        onChange={this.handleDateInput(name)} />
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
                                    style={{width:'20px'}}
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
                                                checked={this.state[option] ? this.state[option].checked : false}
                                                color="primary"
                                                value={option}
                                                id={option}
                                                name={option}
                                                disableRipple
                                                onChange={this.handleChange()}
                                                className="Checkbox" />
                                        </Grid>
                                        <Grid item xs={11} style={{fontSize:'14px'}}>
                                            {option}
                                        </Grid>
                                    </Grid>
                                    {(this.state[option] && this.state[option].checked) && option !== 'None' &&
                                        <Grid container spacing={16} alignItems="center">
                                        <Grid item xs={1} className="TextCenter"></Grid>
                                            <Grid item xs={11} style={{fontSize:'14px'}}>
                                                {this.renderInputs(option)}
                                            </Grid>
                                        </Grid>}
                                </div>
                            ))
                        }

                        {item.input_type === 'checkbox' && name === 'medical history' &&
                            <Grid container spacing={0}>
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